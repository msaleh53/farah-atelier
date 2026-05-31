"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";

export default function CartDrawer() {
  const {
    items,
    count,
    subtotal,
    isOpen,
    closeCart,
    removeItem,
    setQuantity,
  } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closeCart]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-charcoal/40 transition-opacity duration-300 ease-editorial ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Inquiry list"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-canvas shadow-xl outline-none transition-transform duration-300 ease-editorial ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
          <h2 className="font-heading text-2xl text-charcoal">
            Your Inquiry{" "}
            <span className="font-body text-sm text-label-gray">({count})</span>
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close inquiry list"
            className="font-body text-xs uppercase tracking-[0.2em] text-label-gray hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre"
          >
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="font-heading text-2xl text-charcoal">
              Your inquiry is empty
            </p>
            <p className="mt-3 font-body text-sm text-label-gray">
              Add prints or originals to start a conversation with the studio.
            </p>
            <Link href="/shop" onClick={closeCart} className="btn-primary mt-7">
              Browse the Shop
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-charcoal/10 overflow-y-auto px-6">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-parchment">
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-heading text-lg leading-tight text-charcoal">
                          {product.title}
                        </p>
                        <p className="mt-0.5 font-body text-xs uppercase tracking-[0.15em] text-label-gray">
                          {product.type}
                        </p>
                      </div>
                      <p className="font-body text-sm tabular-nums text-charcoal">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-charcoal/20">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(product.id, quantity - 1)
                          }
                          aria-label={`Decrease quantity of ${product.title}`}
                          className="px-2.5 py-1 text-charcoal hover:bg-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre"
                        >
                          –
                        </button>
                        <span className="min-w-8 text-center font-body text-sm tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(product.id, quantity + 1)
                          }
                          aria-label={`Increase quantity of ${product.title}`}
                          className="px-2.5 py-1 text-charcoal hover:bg-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="font-body text-xs uppercase tracking-[0.15em] text-label-gray underline-offset-4 hover:text-charcoal hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-charcoal/10 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-label-gray">
                  Indicative total
                </p>
                <p className="font-heading text-2xl text-charcoal tabular-nums">
                  {formatPrice(subtotal)}
                </p>
              </div>
              <p className="mt-2 font-body text-xs leading-relaxed text-label-gray">
                No payment is taken online. Submitting sends your selection to
                the studio, who will confirm availability and arrange the sale.
              </p>
              <Link
                href="/contact?inquiry=cart"
                onClick={closeCart}
                className="btn-primary mt-5 w-full"
              >
                Request These Works
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
