/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['top-vaz-online.github.io'],
  },
  async rewrites() {
    return [
      {
        source: '/api/games/:path*',
        destination: '/api/games/:path*',
      },
    ]
  },
}

module.exports = nextConfig
