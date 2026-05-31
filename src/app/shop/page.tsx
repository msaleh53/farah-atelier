import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Acquire limited prints and original works. An inquiry-first flow: build a list, then request the works directly from the studio.",
};

const steps = [
  { n: "01", t: "Build your list", d: "Add prints or originals to your inquiry." },
  { n: "02", t: "Request the works", d: "Send your selection to the studio — no payment online." },
  { n: "03", t: "Studio confirms", d: "We verify availability and arrange the sale and delivery." },
];

export default function ShopPage() {
  const products = getAllProducts();

  return (
    <>
      <PageHeader
        eyebrow="Prints & originals"
        title="Shop"
        intro="Acquisition here is inquiry-first. Build a list of works, request them, and the studio will personally confirm availability and arrange payment and delivery."
      />

      {/* How it works */}
      <section className="container-editorial">
        <ol className="grid gap-px overflow-hidden border border-charcoal/10 bg-charcoal/10 sm:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="bg-canvas p-6">
              <p className="font-heading text-3xl text-ochre">{s.n}</p>
              <p className="mt-2 font-body text-sm font-medium uppercase tracking-[0.15em] text-charcoal">
                {s.t}
              </p>
              <p className="mt-1.5 font-body text-sm text-label-gray">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-editorial py-14">
        <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <li key={product.id}>
              <ProductCard product={product} priority={i < 3} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
