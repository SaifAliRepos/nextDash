/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/dashboard/:path*',
        destination: '/ui/dashboard/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
