import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ArtworkDetailImage from "@/components/ArtworkDetailImage";
import { getArtworkBySlug, getArtworkSlugs } from "@/data/artworks";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  const slugs = await getArtworkSlugs()
  return slugs.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  if (!artwork) return { title: "Work not found" };

  const detail = [artwork.medium, artwork.dimensions].filter(Boolean).join(", ");
  const description = [
    `${artwork.title} (${artwork.year})`,
    detail,
    artwork.story ? `${artwork.story.slice(0, 120)}…` : "",
  ]
    .filter(Boolean)
    .join(" — ");

  return {
    title: artwork.title,
    description,
    openGraph: {
      title: artwork.title,
      ...(artwork.image ? { images: [{ url: artwork.image }] } : {}),
    },
  };
}

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  if (!artwork) notFound();

  const metadata: { label: string; value: string }[] = [
    { label: "Year", value: String(artwork.year) },
    { label: "Medium", value: artwork.medium },
    { label: "Dimensions", value: artwork.dimensions },
    { label: "Category", value: artwork.category },
  ].filter((row) => Boolean(row.value));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.title,
    artform: artwork.category,
    artMedium: artwork.medium,
    dateCreated: String(artwork.year),
    ...(artwork.image ? { image: artwork.image } : {}),
    creator: { "@type": "Person", name: site.artistName },
  };

  return (
    <article className="container-editorial py-10 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/gallery"
          className="link-underline font-body text-xs uppercase tracking-[0.2em] text-label-gray"
        >
          ← Back to Gallery
        </Link>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        {/* Image */}
        <ArtworkDetailImage artwork={artwork} />

        {/* Details */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h1 className="font-heading text-4xl font-light leading-tight text-charcoal sm:text-5xl">
            {artwork.title}
          </h1>

          <dl className="mt-8 divide-y divide-charcoal/10 border-y border-charcoal/10">
            {metadata.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-6 py-3.5"
              >
                <dt className="font-body text-xs uppercase tracking-[0.2em] text-label-gray">
                  {row.label}
                </dt>
                <dd className="text-right font-body text-sm text-charcoal">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <Link
              href={`/contact?artwork=${artwork.slug}`}
              className="btn-primary w-full"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>

      {/* Story */}
      {artwork.story ? (
        <section className="mx-auto mt-20 max-w-2xl border-t border-charcoal/10 pt-12">
          <p className="eyebrow mb-4">The work</p>
          <h2 className="font-heading text-2xl font-light text-charcoal">
            On {artwork.title}
          </h2>
          <p className="mt-5 font-body text-lg leading-relaxed text-charcoal/80">
            {artwork.story}
          </p>
        </section>
      ) : null}
    </article>
  );
}
