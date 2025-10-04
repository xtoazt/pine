/** @type {import('next').NextConfig} */
const nextConfig = {
      images: {
        domains: ['localhost', 'fortnite-game.github.io', 'raw.githubusercontent.com', 'classroom.mathify.space'],
      },
  async rewrites() {
    return [
      {
        source: '/api/games/:path*',
        destination: '/api/games/:path*',
      },
      {
        source: '/proxy/lessons/:path*',
        destination: 'https://classroom.mathify.space/lessons/:path*',
      },
      {
        source: '/proxy/lessons-img/:path*',
        destination: 'https://classroom.mathify.space/lessons-img/:path*',
      },
      {
        source: '/proxy/classroom/:path*',
        destination: 'https://classroom.mathify.space/:path*',
      },
    ]
  },
  // Ensure static assets are served correctly
  trailingSlash: false,
  // Enable static file serving
  assetPrefix: '',
}

module.exports = nextConfig
