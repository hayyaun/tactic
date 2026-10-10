import "server-only";
import { prepareBrief, type Enquiry } from "./enquiry";

export function enquiryDeliveryEnabled() {
  return process.env.CONTACT_DELIVERY_ENABLED === "true";
}

export async function sendEnquiry(value: Enquiry, submissionId: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!enquiryDeliveryEnabled() || !key || !from || !to)
    throw new Error("Enquiry delivery is not configured");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `enquiry/${submissionId}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: value.email,
      subject: `TACTIC enquiry — ${value.service}`,
      text: prepareBrief(value),
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const result: { id?: unknown } = await response.json();
  if (!response.ok || typeof result.id !== "string")
    throw new Error("Enquiry delivery was not confirmed");
}
