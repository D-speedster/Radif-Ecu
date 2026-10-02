/** @type {import('next').NextConfig} */

// آدرس بکاند برای proxy کردن /api (در زمان build خوانده می‌شود)
// داخل Docker: http://backend:5000 | توسعهٔ محلی: http://localhost:5000
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || 'http://localhost:5000';

const nextConfig = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${BACKEND_ORIGIN}/api/:path*` }];
  },
};

module.exports = nextConfig;
