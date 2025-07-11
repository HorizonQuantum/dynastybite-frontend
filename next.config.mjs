/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dynastybite-backend-production-7527.up.railway.app',
        pathname: '/storage/public/images/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
