import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-editorial flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-heading text-5xl font-light text-charcoal sm:text-6xl">
        This work isn’t here
      </h1>
      <p className="mt-5 max-w-md font-body text-base leading-relaxed text-label-gray">
        The page you’re looking for may have moved or sold. Browse the gallery to
        find something that speaks to you.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <Link href="/gallery" className="btn-primary">
          View the Gallery
        </Link>
        <Link href="/" className="btn-outline">
          Return Home
        </Link>
      </div>
    </section>
  );
}
