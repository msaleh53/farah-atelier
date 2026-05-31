import Link from "next/link";

export default function SectionHeading({
  eyebrow,
  title,
  link,
}: {
  eyebrow?: string;
  title: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-charcoal/10 pb-6">
      <div>
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h2 className="font-heading text-3xl font-light text-charcoal sm:text-4xl">
          {title}
        </h2>
      </div>
      {link ? (
        <Link
          href={link.href}
          className="link-underline font-body text-xs uppercase tracking-[0.2em] text-charcoal"
        >
          {link.label}
        </Link>
      ) : null}
    </div>
  );
}
