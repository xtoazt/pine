/** @type {import('next').NextConfig} */
const nextConfig = {
      images: {
        domains: ['localhost', 'fortnite-game.github.io', 'raw.githubusercontent.com'],
      },
  async rewrites() {
    return [
      {
        source: '/api/games/:path*',
        destination: '/api/games/:path*',
      },
    ]
  },
  // Ensure static assets are served correctly
  trailingSlash: false,
  // Enable static file serving
  assetPrefix: '',
}

module.exports = nextConfig
