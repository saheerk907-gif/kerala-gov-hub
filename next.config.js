/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize images: WebP format, responsive sizing, lazy loading
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: '**' }, // external news article images
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable gzip compression
  compress: true,

  async redirects() {
    return [
      {
        source: '/kerala-service-rules',
        destination: '/ksr',
        permanent: true,
      },
      {
        source: '/ksr-part-i-%E2%80%94-general-service-conditions',
        destination: '/ksr/part-1',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      // Immutable assets (hashed filenames) — cache for 1 year
      {
        source: '/(_next/static|public)/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Images in public folder — cache for 30 days
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, must-revalidate' },
        ],
      },
      // Security + compression headers
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',        value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
