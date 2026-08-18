/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disables double rendering in development to speed up load times
  poweredByHeader: false,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
};

module.exports = nextConfig;
