import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import ArtworkCard from "@/components/ArtworkCard";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { getFeaturedArtworks } from "@/data/artworks";
import { site } from "@/lib/site";

export default async function HomePage() {
  const featured = (await getFeaturedArtworks()).slice(0, 3);

  return (
    <>
      <Hero />

      {/* Featured works */}
      <section className="container-editorial py-16 md:py-24">
        <SectionHeading
          eyebrow="Selected works"
          title="Featured"
          link={{ href: "/gallery", label: "All works" }}
        />
        <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((artwork, i) => (
            <Reveal as="li" key={artwork.id} delay={i * 80}>
              <ArtworkCard artwork={artwork} />
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Artist intro */}
      <section className="bg-pigment text-canvas">
        <div className="container-editorial grid items-center gap-12 py-20 md:grid-cols-2 md:gap-20 md:py-28">
          <div className="relative order-2 aspect-[4/5] overflow-hidden bg-charcoal md:order-1">
            <Image
              src="https://images.unsplash.com/photo-1531123414780-f74242c2b052?auto=format&fit=crop&w=1200&q=80"
              alt={`Portrait of the artist ${site.artistName} in the studio.`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="eyebrow text-ochre">In the studio</p>
            <h2 className="mt-5 font-heading text-4xl font-light leading-tight sm:text-5xl">
              {site.artistName}
            </h2>
            <div className="mt-6 space-y-4 font-body text-base leading-relaxed text-canvas/70">
              <p>
                For two decades I have painted the thresholds of the Jordanian
                landscape — the moment a colour turns, the line where dune meets
                sky. My work moves between oil, ink and clay, but always returns
                to restraint: the fewest marks that still hold a feeling.
              </p>
              <p>
                Every work leaves the studio through conversation. I prefer to
                know where a painting is going, so each acquisition begins with a
                simple inquiry rather than a checkout.
              </p>
            </div>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex items-center justify-center border border-canvas/40 px-8 py-3.5 font-body text-xs uppercase tracking-[0.2em] text-canvas transition-colors duration-300 ease-editorial hover:bg-canvas hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-pigment"
              >
                Read the Full Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="container-editorial py-20 text-center md:py-28">
        <Reveal>
          <p className="eyebrow mb-5">Acquire a work</p>
          <h2 className="mx-auto max-w-2xl font-heading text-4xl font-light leading-tight text-charcoal sm:text-5xl">
            Begin a quiet conversation about bringing a piece home.
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="btn-primary">
              Browse the Shop
            </Link>
            <Link href="/contact" className="btn-outline">
              Contact the Studio
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
