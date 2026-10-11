import type { Enquiry, EnquiryResult } from "../../lib/enquiry";

type EnquiryPayload = Enquiry & { website: string };
type EnquiryRequest =
  EnquiryPayload | (EnquiryPayload & { intent: "send"; submissionId: string });

export function readEnquiry(form: HTMLFormElement): EnquiryPayload {
  const data = new FormData(form);
  const field = (name: string) => String(data.get(name) ?? "").trim();
  return {
    name: field("name"),
    email: field("email"),
    service: field("service"),
    message: field("message"),
    website: field("website"),
  };
}

export async function requestEnquiry(payload: EnquiryRequest) {
  const response = await fetch("/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });
  const result: EnquiryResult = await response.json();
  return { ok: response.ok, result };
}
