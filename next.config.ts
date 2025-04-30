import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     output: 'export',
     basePath: process.env.NODE_ENV === 'production' ? '/CRM-SCIENTIFIC' : '',
     images: {
       unoptimized: true,
     },
     typescript: {
       ignoreBuildErrors: true,
     },
   };

export default nextConfig;
