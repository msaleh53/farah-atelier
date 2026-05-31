export default function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="container-editorial pb-12 pt-16 md:pt-20">
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h1 className="max-w-3xl font-heading text-5xl font-light leading-[1.05] text-charcoal sm:text-6xl">
        {title}
      </h1>
      {intro ? (
        <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-label-gray">
          {intro}
        </p>
      ) : null}
    </header>
  );
}
