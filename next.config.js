/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    // Allow loading from Laravel dev server (both localhost and 127.0.0.1)
    domains: ['localhost', '127.0.0.1'],
    // If you later serve over a different host or CDN, add it here or use remotePatterns.
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:8000',
  },
};

