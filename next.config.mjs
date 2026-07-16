import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep sharp out of the webpack bundle so it loads its native binary from
  // node_modules at runtime (withPayload may already set this; harmless to repeat).
  serverExternalPackages: ["sharp"],
  // Force the sharp native binaries (and the libvips .so they dlopen) into the
  // serverless functions for the Payload routes. Next's file tracer doesn't
  // follow sharp's runtime dlopen, so without this the function fails at init
  // with "Could not load the sharp module / libvips-cpp.so ... No such file".
  outputFileTracingIncludes: {
    "/admin/[[...segments]]": ["./node_modules/sharp/**/*", "./node_modules/@img/**/*"],
    "/api/[...slug]": ["./node_modules/sharp/**/*", "./node_modules/@img/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        // R2's "Public Development URL" (Settings → Public access), used by
        // generateFileURL in payload.config.ts once S3_PUBLIC_URL is set.
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        // R2 custom domain for the bucket's public reads (Settings → Public
        // access → Custom Domains), set as S3_PUBLIC_URL in production.
        protocol: "https",
        hostname: "media.farahramadan.art",
      },
      {
        // Payload serves media through its own endpoint and, because serverURL
        // is set, returns absolute URLs on this host — next/image needs it
        // explicitly allowlisted to render uploaded artwork on the live site.
        protocol: "https",
        hostname: "farah-atelier.vercel.app",
      },
      {
        // Production custom domain.
        protocol: "https",
        hostname: "farahramadan.art",
      },
    ],
  },
};

export default withPayload(nextConfig);
