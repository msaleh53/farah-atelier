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
    ],
  },
};

export default withPayload(nextConfig);
