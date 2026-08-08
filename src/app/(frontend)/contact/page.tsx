import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import ContactView from "@/components/ContactView";
import { getArtworkBySlug } from "@/data/artworks";
import { getSiteContent } from "@/data/settings";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: "Contact",
    description: `Inquire about a work or commission an original. The studio responds to every message ${content.contact.responseTime.toLowerCase()}.`,
  };
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ artwork?: string; inquiry?: string; type?: string }>;
}) {
  const params = await searchParams;
  const [prefillArtwork, content] = await Promise.all([
    params.artwork ? getArtworkBySlug(params.artwork) : null,
    getSiteContent(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={content.contact.eyebrow}
        title="Contact"
        intro={content.contact.intro}
      />

      <section className="container-editorial grid gap-12 pb-16 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
        <Suspense
          fallback={
            <p className="font-body text-sm text-label-gray">Loading form…</p>
          }
        >
          <ContactView prefillArtwork={prefillArtwork} />
        </Suspense>

        <aside className="lg:sticky lg:top-28 lg:self-start lg:border-l lg:border-charcoal/10 lg:pl-12">
          <p className="eyebrow mb-4">{content.contact.asideEyebrow}</p>
          <dl className="space-y-5 font-body text-sm">
            <div>
              <dt className="text-label-gray">{content.contact.emailLabel}</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${content.email}`}
                  className="link-underline text-charcoal"
                >
                  {content.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-label-gray">{content.contact.locationLabel}</dt>
              <dd className="mt-1 text-charcoal">{content.location}</dd>
            </div>
            <div>
              <dt className="text-label-gray">{content.contact.responseTimeLabel}</dt>
              <dd className="mt-1 text-charcoal">{content.contact.responseTime}</dd>
            </div>
          </dl>
          <p className="mt-8 font-body text-xs leading-relaxed text-label-gray">
            {content.contact.note}
          </p>
        </aside>
      </section>
    </>
  );
}
