/** @type {import('next').NextConfig} */

// آدرس بکاند برای proxy کردن /api (در زمان build خوانده می‌شود)
// داخل Docker: http://backend:5000 | توسعهٔ محلی: http://localhost:5000
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || 'http://localhost:5000';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Target modern browsers - no legacy polyfills
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true, // Enable CSS optimization
    optimizePackageImports: ['lucide-react'], // Optimize icon imports
  },
  // Modular imports to reduce bundle size
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
  // Webpack configuration for modern JavaScript
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Replace node modules with empty modules for client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // Exclude polyfills for modern browsers
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.BROWSERSLIST_ENV': JSON.stringify('modern'),
        })
      );
      
      // Replace Next.js polyfills with empty module for modern browsers
      // This removes Array.flat, Object.fromEntries, Array.at, etc.
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /next[\\/]dist[\\/]build[\\/]polyfills[\\/]polyfill-module/,
          require.resolve('./polyfills-noop.js')
        )
      );
    }
    return config;
  },
  async rewrites() {
    // Proxy تمام درخواست‌های /api/* به Backend
    // و همچنین /uploads/* برای فایل‌های آپلود شده
    // Next.js به صورت خودکار Headers، Cookies، و Query Strings را forward می‌کند
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_ORIGIN}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${BACKEND_ORIGIN}/uploads/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/css/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Link',
            value: '</_next/static/css/:path*>; rel=preload; as=style',
          },
        ],
      },
      {
        source: '/_next/static/chunks/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
