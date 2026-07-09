import Image from "next/image";
import Link from "next/link";
import { navLinks, site } from "@/lib/site";
import { getSiteContent } from "@/data/settings";

export default async function Footer() {
  const content = await getSiteContent();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-charcoal/10 bg-parchment">
      <div className="container-editorial grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src="/signature.png"
              alt=""
              width={14}
              height={26}
              className="h-[26px] w-auto"
            />
            <p className="font-heading text-2xl text-charcoal">{content.brandName}</p>
          </div>
          <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-label-gray">
            {content.tagline}. Studio practice based in {content.location}.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="link-underline font-body text-sm text-charcoal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-4">Studio</p>
          <ul className="space-y-2.5 font-body text-sm text-charcoal">
            <li>
              <a href={`mailto:${content.email}`} className="link-underline">
                {content.email}
              </a>
            </li>
            <li>
              <a
                href={content.instagram}
                target="_blank"
                rel="noreferrer"
                className="link-underline"
              >
                Instagram
              </a>
            </li>
            <li className="text-label-gray">{content.location}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-charcoal/10">
        <div className="container-editorial flex flex-col items-center justify-between gap-2 py-6 text-xs text-label-gray sm:flex-row">
          <p>
            © {year} {site.artistName}. All rights reserved.
          </p>
          <p className="uppercase tracking-[0.2em]">{content.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
