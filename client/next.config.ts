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
    domains: ['lvilarc-tcc-bucket.s3.us-east-2.amazonaws.com',],
  },
};

export default nextConfig;
