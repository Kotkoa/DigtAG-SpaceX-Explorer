import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  logging: {
    browserToTerminal: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images2.imgbox.com' },
      { protocol: 'https', hostname: 'imgur.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: '*.staticflickr.com' },
    ],
  },
}

export default nextConfig
