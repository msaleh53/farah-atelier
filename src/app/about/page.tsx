import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.artistName} — studio practice, materials, and approach to inquiry-first acquisition in ${site.location}.`,
};

const timeline = [
  { year: "2003", text: "Begins formal study in painting and printmaking." },
  { year: "2011", text: "First solo exhibition of works on paper in Amman." },
  { year: "2018", text: "Expands the practice into clay and mixed media." },
  { year: "2024", text: "Opens the studio for direct, inquiry-first acquisition." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="The artist" title={site.artistName} />

      <section className="container-editorial grid gap-12 pb-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
          <Image
            src="https://images.unsplash.com/photo-1531123414780-f74242c2b052?auto=format&fit=crop&w=1200&q=80"
            alt={`${site.artistName} working in the studio.`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-5 font-body text-base leading-relaxed text-charcoal/80">
          <p className="font-heading text-2xl font-light leading-snug text-charcoal">
            I make quiet work about the light and geology of Jordan — paintings,
            drawings and objects that ask to be lived with slowly.
          </p>
          <p>
            My practice moves between oil, ink and clay, but it is held together
            by restraint: the fewest marks that still carry a feeling. I work in
            long looking sessions, often returning to the same ridge, the same
            tide, until a single gesture holds it.
          </p>
          <p>
            Materials matter. Sand from Wadi Rum is bound into the mixed-media
            panels; wood ash glazes the vessels; the works on paper are made in
            the field, drying in the sun. The landscape is not only the subject
            but, often, the medium.
          </p>
          <p>
            I prefer to know where a work is going. That is why everything leaves
            the studio through conversation rather than a checkout — an
            inquiry-first approach that lets each acquisition begin with care.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-editorial py-16">
        <h2 className="mb-8 font-heading text-3xl font-light text-charcoal">
          Selected timeline
        </h2>
        <ol className="divide-y divide-charcoal/10 border-y border-charcoal/10">
          {timeline.map((t) => (
            <li
              key={t.year}
              className="grid grid-cols-[5rem_1fr] gap-6 py-5 sm:grid-cols-[8rem_1fr]"
            >
              <span className="font-heading text-2xl text-ochre">{t.year}</span>
              <span className="self-center font-body text-base text-charcoal/80">
                {t.text}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="bg-pigment text-canvas">
        <div className="container-editorial flex flex-col items-center gap-6 py-20 text-center">
          <h2 className="max-w-2xl font-heading text-4xl font-light leading-tight">
            Find a work for your space, or imagine one together.
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/gallery" className="btn-primary">
              View the Gallery
            </Link>
            <Link
              href="/contact?type=commission"
              className="inline-flex items-center justify-center border border-canvas/40 px-8 py-3.5 font-body text-xs uppercase tracking-[0.2em] text-canvas transition-colors duration-300 ease-editorial hover:bg-canvas hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-pigment"
            >
              Commission a Work
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
