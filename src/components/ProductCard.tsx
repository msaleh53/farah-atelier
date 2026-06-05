"use client";

import Image from "next/image";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart-context";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addItem } = useCart();

  return (
    <figure className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-label-gray">
              Image coming soon
            </span>
          </div>
        )}
        <span className="absolute left-4 top-4 bg-canvas/90 px-3 py-1 font-body text-[0.65rem] uppercase tracking-[0.2em] text-charcoal ring-1 ring-charcoal/5 backdrop-blur">
          {product.type}
        </span>
      </div>

      <figcaption className="mt-4 flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-heading text-xl leading-tight text-charcoal">
            {product.title}
          </h3>
          <p className="shrink-0 font-body text-sm text-charcoal tabular-nums">
            {formatPrice(product.price)}
          </p>
        </div>
        <p className="mt-1 font-body text-sm text-label-gray">
          {product.edition} · {product.size}
        </p>

        <button
          type="button"
          onClick={() => addItem(product)}
          className="btn-outline mt-5 w-full"
        >
          Add to Inquiry
        </button>
      </figcaption>
    </figure>
  );
}
