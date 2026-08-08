import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import ArtworkCard from "@/components/ArtworkCard";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { getFeaturedArtworks } from "@/data/artworks";
import {
  getSiteSettings,
  getSiteContent,
  toParagraphs,
  FALLBACK_ARTIST_PORTRAIT,
} from "@/data/settings";
import { site } from "@/lib/site";
import { shimmerBlurDataURL } from "@/lib/media";

const FALLBACK_HOME_INTRO = `I'm a final-year fine art student based in Amman, working in painting, drawing, and mixed media. My practice is rooted in close observation of the Jordanian landscape — its light, colour, and geology.

I'm currently preparing for my graduation exhibition and am open to conversations about commissions and collaboration.`;

export default async function HomePage() {
  const [featuredAll, settings, content] = await Promise.all([
    getFeaturedArtworks(),
    getSiteSettings(),
    getSiteContent(),
  ]);
  const featured = featuredAll.slice(0, 3);

  const portraitUrl = settings?.artistPortrait ?? FALLBACK_ARTIST_PORTRAIT;
  const portraitAlt =
    settings?.artistPortraitAlt ||
    `Portrait of the artist ${site.artistName} in the studio.`;
  const introParagraphs = toParagraphs(settings?.homeIntro || FALLBACK_HOME_INTRO);

  return (
    <>
      <Hero />

      {/* Featured works */}
      <section className="container-editorial py-16 md:py-24">
        <SectionHeading
          eyebrow={content.home.featuredEyebrow}
          title={content.home.featuredTitle}
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
      <section className="bg-parchment text-charcoal">
        <div className="container-editorial grid items-center gap-12 py-20 md:grid-cols-2 md:gap-20 md:py-28">
          <div className="relative order-2 aspect-[4/5] overflow-hidden bg-charcoal md:order-1">
            <Image
              src={portraitUrl}
              alt={portraitAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={shimmerBlurDataURL}
              className="object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="eyebrow text-charcoal/80">{content.home.introEyebrow}</p>
            <h2 className="mt-5 font-heading text-4xl font-light leading-tight sm:text-5xl">
              {site.artistName}
            </h2>
            <div className="mt-6 space-y-4 font-body text-base leading-relaxed text-charcoal/75">
              {introParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex items-center justify-center border border-charcoal/60 px-8 py-3.5 font-body text-xs uppercase tracking-[0.2em] text-charcoal transition-colors duration-300 ease-editorial hover:bg-charcoal hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-parchment"
              >
                About Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="container-editorial py-20 text-center md:py-28">
        <Reveal>
          <p className="eyebrow mb-5">{content.home.closingEyebrow}</p>
          <h2 className="mx-auto max-w-2xl font-heading text-4xl font-light leading-tight text-charcoal sm:text-5xl">
            {content.home.closingHeading}
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/gallery" className="btn-primary">
              View the Gallery
            </Link>
            <Link href="/contact" className="btn-outline">
              Get in Touch
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
