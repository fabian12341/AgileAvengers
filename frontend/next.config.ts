/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/calls',
        destination: 'http://localhost:5000/calls',
      },
    ];
  },
};

module.exports = nextConfig;
