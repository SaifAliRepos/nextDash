/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/dashboard/:path*',
        destination: '/ui/dashboard/:path*',
      },
      {
        source: '/login',
        destination: '/ui/login',
      },
    ];
  },
};

module.exports = nextConfig;
