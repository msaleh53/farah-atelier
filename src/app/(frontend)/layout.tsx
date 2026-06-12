import type { Metadata, Viewport } from "next";
import { cormorant, inter } from "@/lib/fonts";
import { site } from "@/lib/site";
import { getSiteContent } from "@/data/settings";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import "@/styles/globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const title = `${content.brandName} — Original Paintings & Prints`;
  return {
    metadataBase: new URL("https://farah-ramadan.com"),
    title: {
      default: title,
      template: `%s — ${content.brandName}`,
    },
    description: content.seoDescription,
    openGraph: {
      title,
      description: content.seoDescription,
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#F4F1EA",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtsEvent",
    name: content.brandName,
    description: content.seoDescription,
    organizer: {
      "@type": "Person",
      name: site.artistName,
      email: content.email,
      address: {
        "@type": "PostalAddress",
        addressLocality: content.location,
      },
    },
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-charcoal focus:px-4 focus:py-2 focus:font-body focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-canvas"
          >
            Skip to content
          </a>
          <Navbar brandName={content.brandName} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
