import "server-only";
import { prepareBrief, validateEnquiry } from "../../lib/enquiry";
import { allowEnquiry } from "../../lib/enquiry-rate-limit";

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
  // Preparation only. Replace this return with confirmed delivery when Resend is configured.
  return reply({ status: "prepared", brief: prepareBrief(checked.value) }, 200);
}
