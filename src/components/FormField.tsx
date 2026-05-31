import type { ReactNode } from "react";

interface BaseProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

export function Field({ id, label, required, hint, children }: BaseProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-body text-xs uppercase tracking-[0.2em] text-label-gray"
      >
        {label}
        {required ? <span className="text-ochre"> *</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {hint ? (
        <p className="mt-1.5 font-body text-xs text-label-gray">{hint}</p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "w-full border border-charcoal/20 bg-canvas px-4 py-3 font-body text-sm text-charcoal placeholder:text-label-gray/60 focus:border-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-ochre";
