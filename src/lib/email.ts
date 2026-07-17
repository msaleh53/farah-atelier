import { Resend } from "resend";
import { site } from "@/lib/site";

let resend: Resend | undefined;

function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export interface InquiryPayload {
  type: "inquiry";
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface CommissionPayload {
  type: "commission";
  name: string;
  email: string;
  medium?: string;
  budget?: string;
  size?: string;
  timeline?: string;
  vision: string;
}

export type ContactPayload = InquiryPayload | CommissionPayload;

function buildEmail(payload: ContactPayload) {
  if (payload.type === "inquiry") {
    const subject = payload.subject
      ? `Inquiry: ${payload.subject}`
      : `New inquiry from ${payload.name}`;
    const text = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.subject ? `Regarding: ${payload.subject}` : null,
      "",
      payload.message,
    ]
      .filter((line) => line !== null)
      .join("\n");
    return { subject, text };
  }

  const subject = `Commission request from ${payload.name}`;
  const text = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.medium ? `Preferred medium: ${payload.medium}` : null,
    payload.budget ? `Budget range: ${payload.budget}` : null,
    payload.size ? `Approximate size: ${payload.size}` : null,
    payload.timeline ? `Ideal timeline: ${payload.timeline}` : null,
    "",
    payload.vision,
  ]
    .filter((line) => line !== null)
    .join("\n");
  return { subject, text };
}

export async function sendContactEmail(payload: ContactPayload) {
  const { subject, text } = buildEmail(payload);
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  const { error } = await getResend().emails.send({
    from,
    to: site.email,
    replyTo: payload.email,
    subject,
    text,
  });

  if (error) {
    throw new Error(error.message);
  }
}
