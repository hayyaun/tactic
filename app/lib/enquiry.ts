export const enquiryServices = [
  "Brand & design",
  "Web & apps",
  "AI ad films",
  "A little of everything",
] as const;
export const enquiryLimits = { name: 100, email: 254, message: 5000 };
export type Enquiry = {
  name: string;
  email: string;
  service: string;
  message: string;
};
export type EnquiryResult =
  | { status: "prepared"; brief: string }
  | {
      status: "error";
      message: string;
      fields?: Partial<Record<keyof Enquiry, string>>;
    };

export function validateEnquiry(input: unknown): {
  value?: Enquiry;
  fields: Partial<Record<keyof Enquiry, string>>;
  spam: boolean;
} {
  const record =
    input && typeof input === "object" && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  const field = (key: string) =>
    typeof record[key] === "string" ? record[key].trim() : "";
  const value = {
    name: field("name"),
    email: field("email"),
    service: field("service"),
    message: field("message"),
  };
  const fields: Partial<Record<keyof Enquiry, string>> = {};
  if (
    !value.name ||
    value.name.length > enquiryLimits.name ||
    /[\r\n\x00-\x1f]/.test(value.name)
  )
    fields.name = "Enter a name of 1–100 characters.";
  if (
    !value.email ||
    value.email.length > enquiryLimits.email ||
    !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value.email)
  )
    fields.email = "Enter a valid email address.";
  if (!(enquiryServices as readonly string[]).includes(value.service))
    fields.service = "Choose one of the available services.";
  if (
    !value.message ||
    value.message.length > enquiryLimits.message ||
    /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value.message)
  )
    fields.message = "Enter a project description of 1–5,000 characters.";
  const spam = record.website !== undefined && record.website !== "";
  return {
    ...(Object.keys(fields).length === 0 ? { value } : {}),
    fields,
    spam,
  };
}

export function prepareBrief(value: Enquiry) {
  return [
    "TACTIC — Project enquiry",
    "",
    `Name: ${value.name}`,
    `Email: ${value.email}`,
    `Interested in: ${value.service}`,
    "",
    "About the project:",
    value.message,
  ].join("\n");
}
