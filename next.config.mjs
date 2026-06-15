/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow any HTTPS image (for admin-added products)
      },
    ],
  },
};

export default nextConfig;
