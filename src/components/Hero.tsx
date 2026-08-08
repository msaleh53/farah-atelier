import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { getSiteSettings } from "@/data/settings";
import { shimmerBlurDataURL } from "@/lib/media";

// Fallbacks used until the studio's Site Settings are filled in.
const FALLBACK_HEADLINE = "Quiet paintings for considered spaces.";
const FALLBACK_SUBTITLE = `${site.artistName} works in oil, paper and clay, drawing on the light and geology of Jordan. Each piece is available to acquire through a direct, inquiry-first conversation with the studio.`;
const FALLBACK_PRIMARY_CTA = "View the Gallery";
const FALLBACK_SECONDARY_CTA = "Commission a Work";

export default async function Hero() {
  const settings = await getSiteSettings();
  const headline = settings?.heroHeadline || FALLBACK_HEADLINE;
  const subtitle = settings?.heroSubtitle || FALLBACK_SUBTITLE;
  const primaryCta = settings?.heroPrimaryCta || FALLBACK_PRIMARY_CTA;
  const secondaryCta = settings?.heroSecondaryCta || FALLBACK_SECONDARY_CTA;
  const imageAlt = settings?.heroImageAlt || "Featured artwork from the studio.";
  // Already cropped to the locked 4:5 frame by the Media `hero` size variant.
  const imageUrl = settings?.heroImage ?? null;

  return (
    <section className="relative">
      <div className="container-editorial grid items-center gap-10 pb-16 pt-12 md:grid-cols-2 md:gap-16 md:pb-24 md:pt-16">
        <div className="fade-up order-2 md:order-1">
          <p className="eyebrow">{site.location}</p>
          <h1 className="mt-5 font-heading text-5xl font-light leading-[1.05] text-charcoal sm:text-6xl lg:text-7xl">
            {headline}
          </h1>
          <p className="mt-6 max-w-md font-body text-base leading-relaxed text-label-gray">
            {subtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/gallery" className="btn-primary">
              {primaryCta}
            </Link>
            <Link href="/contact" className="btn-outline">
              {secondaryCta}
            </Link>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={shimmerBlurDataURL}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-body text-xs uppercase tracking-[0.2em] text-label-gray">
                  Image coming soon
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
