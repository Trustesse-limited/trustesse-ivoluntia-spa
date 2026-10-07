import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Server Actions receive the uploaded file in the request body.
  // Next.js defaults bodySizeLimit to 1MB, which rejects images >1MB with a 413.
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // matches the ImageUpload 10MB client-side limit
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
