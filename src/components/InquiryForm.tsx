"use client";

import { useState, type FormEvent } from "react";
import Script from "next/script";
import { Field, inputClass } from "@/components/FormField";

export interface InquiryFormProps {
  /** Pre-filled subject line, e.g. an artwork title. */
  defaultSubject?: string;
  /** Pre-filled message body, e.g. from an artwork or commission deep-link. */
  defaultMessage?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function InquiryForm({
  defaultSubject = "",
  defaultMessage = "",
}: InquiryFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState(defaultMessage);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-charcoal/15 bg-parchment p-8 text-center">
        <p className="font-heading text-2xl text-charcoal">Inquiry received</p>
        <p className="mt-3 font-body text-sm leading-relaxed text-label-gray">
          Thank you, {name || "friend"}. The studio will reply to{" "}
          <span className="text-charcoal">{email}</span> within two business
          days to confirm availability and next steps.
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />
      <input type="hidden" name="type" value="inquiry" />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="inq-name" label="Name" required>
          <input
            id="inq-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="inq-email" label="Email" required>
          <input
            id="inq-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field id="inq-subject" label="Regarding">
        <input
          id="inq-subject"
          name="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="A particular work, a print, or a general question"
          className={inputClass}
        />
      </Field>

      <Field id="inq-message" label="Message" required>
        <textarea
          id="inq-message"
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
        />
      </Field>

      <div
        className="cf-turnstile"
        data-sitekey="0x4AAAAAAD3nuFJuIftIk0G7"
        data-action="turnstile-spin-v2"
      />

      {status === "error" ? (
        <p className="border border-charcoal/15 bg-parchment px-4 py-3 font-body text-sm text-charcoal">
          Something went wrong sending your message.{" "}
          <span className="text-ochre">Please try again.</span>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Send Inquiry"}
      </button>
    </form>
  );
}
