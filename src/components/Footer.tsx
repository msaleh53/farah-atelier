import Link from "next/link";
import { navLinks, site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-charcoal/10 bg-parchment">
      <div className="container-editorial grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-heading text-2xl text-charcoal">{site.name}</p>
          <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-label-gray">
            {site.tagline}. Studio practice based in {site.location}.
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
              <a href={`mailto:${site.email}`} className="link-underline">
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="link-underline"
              >
                Instagram
              </a>
            </li>
            <li className="text-label-gray">{site.location}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-charcoal/10">
        <div className="container-editorial flex flex-col items-center justify-between gap-2 py-6 text-xs text-label-gray sm:flex-row">
          <p>
            © {year} {site.artistName}. All rights reserved.
          </p>
          <p className="uppercase tracking-[0.2em]">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
