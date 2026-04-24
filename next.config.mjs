/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'www.sunprime.com.br' },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'three', '@react-three/drei'],
  },
};

export default nextConfig;
