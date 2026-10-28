/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig

module.exports = {
  distDir: '.next-clean',
  images: {
    domains: ['firebasestorage.googleapis.com', 'media4.giphy.com', '64.media.tumblr.com', 'i.pinimg.com'],
  },
};
