"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getArtworkBySlug } from "@/data/artworks";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import InquiryForm from "@/components/InquiryForm";
import CommissionForm from "@/components/CommissionForm";

type Tab = "inquiry" | "commission";

export default function ContactView() {
  const searchParams = useSearchParams();
  const { items, subtotal } = useCart();
  const [tab, setTab] = useState<Tab>("inquiry");

  const artworkSlug = searchParams.get("artwork");
  const isCartInquiry = searchParams.get("inquiry") === "cart";

  // Build prefilled subject/message from the incoming context.
  const { defaultSubject, defaultMessage } = useMemo(() => {
    if (artworkSlug) {
      const art = getArtworkBySlug(artworkSlug);
      if (art) {
        return {
          defaultSubject: `${art.title} (${art.year})`,
          defaultMessage: `I'd like to inquire about "${art.title}" — ${art.medium}, ${art.dimensions}.\n\n`,
        };
      }
    }
    if (isCartInquiry && items.length > 0) {
      const lines = items
        .map(
          (i) =>
            `• ${i.product.title} — ${i.product.type} ×${i.quantity} (${formatPrice(
              i.product.price * i.quantity,
            )})`,
        )
        .join("\n");
      return {
        defaultSubject: "Acquisition inquiry (selected works)",
        defaultMessage: `I'd like to inquire about the following works:\n\n${lines}\n\nIndicative total: ${formatPrice(
          subtotal,
        )}\n\n`,
      };
    }
    return { defaultSubject: "", defaultMessage: "" };
  }, [artworkSlug, isCartInquiry, items, subtotal]);

  // If arriving from a work or cart, default to the inquiry tab.
  useEffect(() => {
    if (searchParams.get("type") === "commission") setTab("commission");
    else if (artworkSlug || isCartInquiry) setTab("inquiry");
  }, [searchParams, artworkSlug, isCartInquiry]);

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
            Inquire about a specific work, a print, or availability. Submitting
            sends your message to the studio — no payment is taken online.
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
