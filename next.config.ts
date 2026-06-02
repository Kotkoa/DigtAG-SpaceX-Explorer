import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

const nextConfig: NextConfig = {
  output: isDev ? undefined : 'export',
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
