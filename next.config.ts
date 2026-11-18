import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Photographs are sized ahead of time (npm run photos) and served as files: Vercel's on-request resizing is
    // a paid quota that ran out. The widths here are the copies that exist; 2400 is the original.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    imageSizes: [384],
    deviceSizes: [640, 1080, 1600, 2400],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
