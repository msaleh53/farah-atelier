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
          <Image
            src={content.logo || "/logo-farah-ramadan.png"}
            alt={content.brandName}
            width={1315}
            height={399}
            className="h-16 w-auto"
          />
          <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-label-gray">
            {content.tagline}. Studio practice based in {content.location}.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow mb-4">{content.footer.exploreLabel}</p>
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
          <p className="eyebrow mb-4">{content.footer.studioLabel}</p>
          <ul className="space-y-2.5 font-body text-sm text-charcoal">
            <li>
              <a href={`mailto:${content.email}`} className="link-underline">
                {content.email}
              </a>
            </li>
            {content.socialLinks.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline"
                >
                  {link.platform}
                </a>
              </li>
            ))}
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
