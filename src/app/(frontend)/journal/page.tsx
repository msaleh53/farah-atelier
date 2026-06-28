import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { getAllPosts } from "@/data/posts";
import { getSiteContent } from "@/data/settings";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Process notes, sketchbook pages, and reflections from the studio.",
};

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function JournalPage() {
  const [posts, content] = await Promise.all([getAllPosts(), getSiteContent()]);

  return (
    <>
      <PageHeader
        eyebrow="Writing"
        title="Journal"
        intro="Process notes, sketchbook pages, and reflections from the studio."
      />

      {posts.length === 0 ? (
        <div className="container-editorial py-20 text-center">
          <p className="font-body text-base text-label-gray">
            No entries yet — check back soon.
          </p>
        </div>
      ) : (
        <section className="container-editorial py-14">
          <ul className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal as="li" key={post.id} delay={i * 60}>
                <Link
                  href={`/journal/${post.slug}`}
                  className="group block focus-visible:outline-none"
                >
                  <article>
                    <div className="relative aspect-[4/3] overflow-hidden bg-parchment">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.coverImageAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          priority={i < 3}
                          className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-label-gray">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      {post.tags.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-body text-[0.6rem] uppercase tracking-[0.2em] text-label-gray"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <h2 className="font-heading text-xl leading-snug text-charcoal">
                        <span className="link-underline">{post.title}</span>
                      </h2>
                      <p className="mt-1 font-body text-xs text-label-gray">
                        {formatDate(post.publishedAt)}
                      </p>
                      {post.excerpt && (
                        <p className="mt-3 font-body text-sm leading-relaxed text-charcoal/70 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
