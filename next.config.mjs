/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@google-cloud/pino-logging-gcp-config': false,
    }

    return config
  },
}

export default nextConfig
