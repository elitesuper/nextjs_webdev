// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src')]
  },
  typescript:{
    ignoreBuildErrors: true,
  },
  publicRuntimeConfig:{
    staticFolder:'/uploads',
  },
}

module.exports = nextConfig
