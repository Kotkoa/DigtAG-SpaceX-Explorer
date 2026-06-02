import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/DigtAG-SpaceX-Explorer',
  assetPrefix: '/DigtAG-SpaceX-Explorer',
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
  logging: {
    browserToTerminal: true,
  },
}

export default nextConfig
