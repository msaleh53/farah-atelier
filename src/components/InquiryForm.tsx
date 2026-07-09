"use client";

import { useState } from "react";
import { Field, inputClass } from "@/components/FormField";

export interface InquiryFormProps {
  /** Pre-filled subject line, e.g. an artwork title. */
  defaultSubject?: string;
  /** Pre-filled message body, e.g. from an artwork or commission deep-link. */
  defaultMessage?: string;
}

export default function InquiryForm({
  defaultSubject = "",
  defaultMessage = "",
}: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState(defaultMessage);

  if (submitted) {
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
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-6"
    >
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

      <button type="submit" className="btn-primary w-full sm:w-auto">
        Send Inquiry
      </button>
    </form>
  );
}
