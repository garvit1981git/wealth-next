/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Keep your existing configurations intact */
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },

  // Bypasses ESLint rule validations during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Bypasses TypeScript compiler type check errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;