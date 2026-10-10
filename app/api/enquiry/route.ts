import "server-only";
import { prepareBrief, validateEnquiry } from "../../lib/enquiry";
import { allowEnquiry } from "../../lib/enquiry-rate-limit";
import { sendEnquiry } from "../../lib/enquiry-delivery";

const maxBytes = 16_384;
function reply(
  body: unknown,
  status: number,
  extraHeaders: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...extraHeaders },
  });
}

async function readBody(request: Request) {
  if (Number(request.headers.get("content-length")) > maxBytes) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const buffer = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(buffer);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  let sameOrigin = false;
  try {
    const parsed = new URL(origin ?? "");
    // Next's internal request URL can use a different loopback hostname.
    // Host is the browser-visible host; never trust an arbitrary forwarded host.
    sameOrigin =
      parsed.origin === origin &&
      parsed.host === request.headers.get("host") &&
      ["http:", "https:"].includes(parsed.protocol);
    if (
      parsed.hostname === "tacticforyou.com" ||
      parsed.hostname === "www.tacticforyou.com"
    )
      sameOrigin = sameOrigin && parsed.protocol === "https:";
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin)
    return reply(
      { status: "error", message: "Please submit from this website." },
      403,
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return reply({ status: "error", message: "Unsupported form format." }, 415);
  try {
    if (!(await allowEnquiry(request)))
      return reply(
        {
          status: "error",
          message: "Too many attempts. Please try again in a minute.",
        },
        429,
        { "Retry-After": "60" },
      );
  } catch {
    return reply(
      {
        status: "error",
        message:
          "The form is temporarily unavailable. Your details have not been sent. Please try again later.",
      },
      503,
    );
  }
  let input: unknown;
  try {
    const raw = await readBody(request);
    if (raw === null)
      return reply(
        { status: "error", message: "Your enquiry is too long." },
        413,
      );
    input = JSON.parse(raw);
  } catch {
    return reply(
      { status: "error", message: "Please check your form and try again." },
      400,
    );
  }
  const checked = validateEnquiry(input);
  if (checked.spam)
    return reply(
      { status: "error", message: "Please check your form and try again." },
      400,
    );
  if (!checked.value)
    return reply(
      {
        status: "error",
        message: "Please check the highlighted fields.",
        fields: checked.fields,
      },
      422,
    );
  const record = input as Record<string, unknown>;
  if (record.intent === "send") {
    if (
      typeof record.submissionId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        record.submissionId,
      )
    )
      return reply(
        { status: "error", message: "Please prepare your brief again." },
        400,
      );
    try {
      await sendEnquiry(checked.value, record.submissionId);
      return reply({ status: "sent" }, 200);
    } catch {
      return reply(
        {
          status: "error",
          message:
            "We couldn’t confirm sending your enquiry. Your brief is saved here; try sending again.",
        },
        503,
      );
    }
  }
  if (record.intent !== undefined && record.intent !== "prepare")
    return reply({ status: "error", message: "Unsupported form action." }, 400);
  return reply({ status: "prepared", brief: prepareBrief(checked.value) }, 200);
}
