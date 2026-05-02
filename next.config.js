/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    FINANCE_API_URL: process.env.FINANCE_API_URL,
  },
}

module.exports = nextConfig
