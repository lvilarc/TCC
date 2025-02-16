import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true, // 301 redirect permanente
      },
    ];
  },
  images: {
    domains: ['d3h1lg3ksw6i6b.cloudfront.net'],
  },
};

export default nextConfig;
