import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import ContactView from "@/components/ContactView";
import { getArtworkBySlug } from "@/data/artworks";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Inquire about a work or commission an original. The studio responds to every message within two business days.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ artwork?: string; inquiry?: string; type?: string }>;
}) {
  const params = await searchParams;
  const prefillArtwork = params.artwork
    ? await getArtworkBySlug(params.artwork)
    : null;

  return (
    <>
      <PageHeader
        eyebrow="Begin a conversation"
        title="Contact"
        intro="Whether you have your eye on a particular piece or want something made for your space, every conversation starts here."
      />

      <section className="container-editorial grid gap-12 pb-16 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
        <Suspense
          fallback={
            <p className="font-body text-sm text-label-gray">Loading form…</p>
          }
        >
          <ContactView prefillArtwork={prefillArtwork} />
        </Suspense>

        <aside className="lg:border-l lg:border-charcoal/10 lg:pl-12">
          <p className="eyebrow mb-4">The studio</p>
          <dl className="space-y-5 font-body text-sm">
            <div>
              <dt className="text-label-gray">Email</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline text-charcoal"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-label-gray">Location</dt>
              <dd className="mt-1 text-charcoal">{site.location}</dd>
            </div>
            <div>
              <dt className="text-label-gray">Response time</dt>
              <dd className="mt-1 text-charcoal">Within two business days</dd>
            </div>
          </dl>
          <p className="mt-8 font-body text-xs leading-relaxed text-label-gray">
            Studio visits are available by appointment. Mention your preferred
            dates in your message and we will arrange a time.
          </p>
        </aside>
      </section>
    </>
  );
}
