import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      { hostname: 'picsum.photos' },
      { hostname: 'covers.openlibrary.org' },
    ],
    localPatterns: [
      {
        pathname: "/uploads/**", // ** matches any subfolder depth and filename
      },
    ],
  },
};

export default nextConfig;