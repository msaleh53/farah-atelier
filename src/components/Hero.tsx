import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative">
      <div className="container-editorial grid items-center gap-10 pb-16 pt-12 md:grid-cols-2 md:gap-16 md:pb-24 md:pt-16">
        <div className="fade-up order-2 md:order-1">
          <p className="eyebrow">{site.location}</p>
          <h1 className="mt-5 font-heading text-5xl font-light leading-[1.05] text-charcoal sm:text-6xl lg:text-7xl">
            Quiet paintings for considered spaces.
          </h1>
          <p className="mt-6 max-w-md font-body text-base leading-relaxed text-label-gray">
            {site.artistName} works in oil, paper and clay, drawing on the light
            and geology of Jordan. Each piece is available to acquire through a
            direct, inquiry-first conversation with the studio.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/gallery" className="btn-primary">
              View the Gallery
            </Link>
            <Link href="/contact" className="btn-outline">
              Commission a Work
            </Link>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
            <Image
              src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1400&q=80"
              alt="Featured oil painting Morning Tide in soft blues and ochre."
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
