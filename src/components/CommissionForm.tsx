"use client";

import { useRef, useState, type FormEvent } from "react";
import { Field, inputClass } from "@/components/FormField";
import TurnstileWidget, {
  type TurnstileWidgetHandle,
} from "@/components/TurnstileWidget";

const mediums = ["Oil painting", "Works on paper", "Mixed media", "Sculpture", "Unsure"];
const budgets = ["Under 500 JOD", "500–1,500 JOD", "1,500–3,000 JOD", "3,000+ JOD"];

type Status = "idle" | "submitting" | "success" | "error";

export default function CommissionForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

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
      turnstileRef.current?.reset();
    }
  }

  if (status === "success") {
    return (
      <div className="border border-charcoal/15 bg-parchment p-8 text-center">
        <p className="font-heading text-2xl text-charcoal">
          Commission request received
        </p>
        <p className="mt-3 font-body text-sm leading-relaxed text-label-gray">
          Thank you, {name || "friend"}. The studio will be in touch at{" "}
          <span className="text-charcoal">{email}</span> to discuss your idea,
          timeline, and a proposal.
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="type" value="commission" />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="com-name" label="Name" required>
          <input
            id="com-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="com-email" label="Email" required>
          <input
            id="com-email"
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

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="com-medium" label="Preferred medium">
          <select id="com-medium" name="medium" className={inputClass}>
            {mediums.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </Field>
        <Field id="com-budget" label="Budget range">
          <select id="com-budget" name="budget" className={inputClass}>
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="com-size" label="Approximate size" hint="e.g. 100 × 80 cm">
          <input id="com-size" name="size" type="text" className={inputClass} />
        </Field>
        <Field id="com-timeline" label="Ideal timeline" hint="When do you need it?">
          <input
            id="com-timeline"
            name="timeline"
            type="text"
            className={inputClass}
          />
        </Field>
      </div>

      <Field id="com-vision" label="Tell me about the work you imagine" required>
        <textarea
          id="com-vision"
          name="vision"
          required
          rows={6}
          placeholder="Subject, mood, the room it will live in, any references…"
          className={inputClass}
        />
      </Field>

      <TurnstileWidget ref={turnstileRef} />

      {status === "error" ? (
        <p className="border border-charcoal/15 bg-parchment px-4 py-3 font-body text-sm text-charcoal">
          Something went wrong sending your request.{" "}
          <span className="text-ochre">Please try again.</span>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Request a Commission"}
      </button>
    </form>
  );
}
