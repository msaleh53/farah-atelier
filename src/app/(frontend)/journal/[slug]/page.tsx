import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getPostBySlug, getPostSlugs } from "@/data/posts";
import { shimmerBlurDataURL } from "@/lib/media";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
  };
}

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="container-editorial py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/journal"
          className="link-underline font-body text-xs uppercase tracking-[0.2em] text-label-gray"
        >
          ← Back to Journal
        </Link>
      </nav>

      <header className="mx-auto max-w-2xl">
        {post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-teal"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h1 className="font-heading text-4xl font-light leading-tight text-charcoal sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 font-body text-sm text-label-gray">
          {formatDate(post.publishedAt)}
        </p>
      </header>

      {post.coverImage && (
        <div className="mx-auto mt-10 max-w-4xl">
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt}
            width={1200}
            height={900}
            priority
            sizes="(max-width: 1024px) 100vw, 900px"
            placeholder="blur"
            blurDataURL={shimmerBlurDataURL}
            className="w-full h-auto"
          />
        </div>
      )}

      {post.body != null && (
        <div className="prose prose-stone mx-auto mt-12 max-w-2xl font-body prose-a:text-ochre prose-a:no-underline hover:prose-a:underline prose-strong:text-charcoal">
          <RichText data={post.body as SerializedEditorState} />
        </div>
      )}
    </article>
  );
}
