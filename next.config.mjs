/** @type {import('next').NextConfig} */
const nextConfig = {
  // Opt-out native binary dependencies from the Server Components bundler loop
  serverExternalPackages: ['@napi-rs/canvas', 'pdfjs-dist'],

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