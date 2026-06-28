import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import {
  getSiteSettings,
  getSiteContent,
  toParagraphs,
  FALLBACK_ARTIST_PORTRAIT,
  type TimelineItem,
} from "@/data/settings";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: "About",
    description: `About ${site.artistName} — a graduating fine art student based in ${content.location}.`,
  };
}

const FALLBACK_LEAD =
  "I'm a final-year fine art student in Amman, working across painting, drawing, and mixed media.";

const FALLBACK_BODY = `My practice is rooted in observation — long sessions in front of a subject until something unexpected reveals itself. I work primarily in oil and ink, but I'm drawn to bringing in materials that carry their own history: ash, sand, torn paper.

I'm currently preparing for my graduation exhibition and exploring what comes next. I'm open to conversations about collaboration, residencies, and commissions.`;

const FALLBACK_TIMELINE: TimelineItem[] = [
  { year: "2021", text: "Enrolled in Fine Art at [Your University]." },
  { year: "2023", text: "Group exhibition — [Gallery Name], Amman." },
  { year: "2024", text: "Selected for the [Award/Residency] programme." },
  { year: "2025", text: "Graduation exhibition — [Venue], Amman." },
];

export default async function AboutPage() {
  const [settings, content] = await Promise.all([
    getSiteSettings(),
    getSiteContent(),
  ]);

  const portraitUrl = settings?.artistPortrait ?? FALLBACK_ARTIST_PORTRAIT;
  const portraitAlt =
    settings?.artistPortraitAlt || `${site.artistName} working in the studio.`;
  const lead = settings?.aboutLead || FALLBACK_LEAD;
  const bodyParagraphs = toParagraphs(settings?.aboutBody || FALLBACK_BODY);
  const timeline =
    settings?.timeline && settings.timeline.length > 0
      ? settings.timeline
      : FALLBACK_TIMELINE;

  return (
    <>
      <PageHeader eyebrow="The artist" title={site.artistName} />

      <section className="container-editorial grid gap-12 pb-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
          <Image
            src={portraitUrl}
            alt={portraitAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-5 font-body text-base leading-relaxed text-charcoal/80">
          <p className="font-heading text-2xl font-light leading-snug text-charcoal">
            {lead}
          </p>
          {bodyParagraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="container-editorial py-16">
        <h2 className="mb-8 font-heading text-3xl font-light text-charcoal">
          Selected timeline
        </h2>
        <ol className="divide-y divide-charcoal/10 border-y border-charcoal/10">
          {timeline.map((t, i) => (
            <li
              key={`${t.year}-${i}`}
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
            {content.about.ctaHeading}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/gallery" className="btn-primary">
              View the Gallery
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-canvas/40 px-8 py-3.5 font-body text-xs uppercase tracking-[0.2em] text-canvas transition-colors duration-300 ease-editorial hover:bg-canvas hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre focus-visible:ring-offset-2 focus-visible:ring-offset-pigment"
            >
              Say Hello
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
