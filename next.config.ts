import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Dynamic routes and secure server APIs require a Node.js deployment (Vercel).
  // The legacy GitHub Pages site remains live on main until cutover.
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
