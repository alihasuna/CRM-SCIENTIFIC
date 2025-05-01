import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't use export in development to allow client components to work
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true, // Add trailing slashes to URLs
  basePath: process.env.NODE_ENV === 'production' ? '/CRM-SCIENTIFIC' : '',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable static route checking
  experimental: {
    // Empty array for external packages
  }
};

export default nextConfig;
