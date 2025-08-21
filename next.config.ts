import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  typescript: {
    ignoreBuildErrors: false, // Strict type checking in production
  },
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Bundle analyzer (uncomment for analysis)
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },
  
  // Headers for security
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: false,
      },
    ];
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        'react/jsx-runtime.js': 'react/jsx-runtime.js',
        'react': 'react',
      });
    }
    
    return config;
  },
  
  // ESLint configuration
  eslint: {
    // Only ignore during builds if explicitly set
    ignoreDuringBuilds: process.env.IGNORE_ESLINT === 'true',
  },
};

export default nextConfig;
