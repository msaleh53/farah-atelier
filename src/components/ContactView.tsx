"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Artwork } from "@/types";
import InquiryForm from "@/components/InquiryForm";
import CommissionForm from "@/components/CommissionForm";

type Tab = "inquiry" | "commission";

export default function ContactView({
  prefillArtwork,
}: {
  prefillArtwork?: Artwork | null;
}) {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("inquiry");

  const artworkSlug = searchParams.get("artwork");

  const { defaultSubject, defaultMessage } = useMemo(() => {
    if (prefillArtwork) {
      return {
        defaultSubject: `${prefillArtwork.title} (${prefillArtwork.year})`,
        defaultMessage: `I'd like to ask about "${prefillArtwork.title}" — ${prefillArtwork.medium}, ${prefillArtwork.dimensions}.\n\n`,
      };
    }
    return { defaultSubject: "", defaultMessage: "" };
  }, [prefillArtwork]);

  useEffect(() => {
    if (searchParams.get("type") === "commission") setTab("commission");
    else if (artworkSlug) setTab("inquiry");
  }, [searchParams, artworkSlug]);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Contact options"
        className="mb-10 flex gap-8 border-b border-charcoal/10"
      >
        {(
          [
            { id: "inquiry", label: "Inquiry" },
            { id: "commission", label: "Commission" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`relative -mb-px pb-4 font-body text-sm uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre ${
              tab === t.id
                ? "text-charcoal after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-ochre"
                : "text-label-gray hover:text-charcoal"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "inquiry" ? (
        <div role="tabpanel" id="panel-inquiry" aria-labelledby="tab-inquiry">
          <p className="mb-8 max-w-xl font-body text-base leading-relaxed text-label-gray">
            Ask about a specific work, a collaboration, or anything else.
          </p>
          <InquiryForm
            key={defaultSubject + defaultMessage}
            defaultSubject={defaultSubject}
            defaultMessage={defaultMessage}
          />
        </div>
      ) : (
        <div
          role="tabpanel"
          id="panel-commission"
          aria-labelledby="tab-commission"
        >
          <p className="mb-8 max-w-xl font-body text-base leading-relaxed text-label-gray">
            Commission an original work made for your space. Share your idea and
            the studio will respond with a proposal and timeline.
          </p>
          <CommissionForm />
        </div>
      )}
    </div>
  );
}
