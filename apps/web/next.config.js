/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@pbag/shared"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

module.exports = nextConfig;
