/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    // Add your production API domain
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
      },
      {
        protocol: 'http',
        hostname: '145.223.100.91',
      },
    ],
  },
  env: {
    API_URL: process.env.API_URL || 'http://145.223.100.91',
  },
};

