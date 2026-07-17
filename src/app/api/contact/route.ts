import { NextResponse } from "next/server";
import {
  sendContactEmail,
  type CommissionPayload,
  type InquiryPayload,
} from "@/lib/email";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

async function verifyTurnstile(token: unknown, remoteIp: string | null) {
  if (!isNonEmptyString(token)) return false;
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET ?? "",
        response: token,
        ...(remoteIp ? { remoteip: remoteIp } : {}),
      }),
    },
  );
  const result = await res.json();
  return result.success === true;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const remoteIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const verified = await verifyTurnstile(body["cf-turnstile-response"], remoteIp);
  if (!verified) {
    return NextResponse.json(
      { ok: false, error: "Verification failed. Please try again." },
      { status: 403 },
    );
  }

  const { type, name, email } = body;

  if (!isNonEmptyString(name) || !isNonEmptyString(email)) {
    return NextResponse.json(
      { ok: false, error: "Name and email are required." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "A valid email is required." },
      { status: 400 },
    );
  }

  let payload: InquiryPayload | CommissionPayload;

  if (type === "inquiry") {
    const { subject, message } = body;
    if (!isNonEmptyString(message)) {
      return NextResponse.json(
        { ok: false, error: "Message is required." },
        { status: 400 },
      );
    }
    payload = {
      type: "inquiry",
      name,
      email,
      subject: isNonEmptyString(subject) ? subject : undefined,
      message,
    };
  } else if (type === "commission") {
    const { medium, budget, size, timeline, vision } = body;
    if (!isNonEmptyString(vision)) {
      return NextResponse.json(
        { ok: false, error: "Please describe the work you imagine." },
        { status: 400 },
      );
    }
    payload = {
      type: "commission",
      name,
      email,
      medium: isNonEmptyString(medium) ? medium : undefined,
      budget: isNonEmptyString(budget) ? budget : undefined,
      size: isNonEmptyString(size) ? size : undefined,
      timeline: isNonEmptyString(timeline) ? timeline : undefined,
      vision,
    };
  } else {
    return NextResponse.json(
      { ok: false, error: "Unknown form type." },
      { status: 400 },
    );
  }

  try {
    await sendContactEmail(payload);
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return NextResponse.json(
      { ok: false, error: "Could not send your message. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
