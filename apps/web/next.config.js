/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@pbag/shared"],
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? "/pbaginternational" : "",
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

module.exports = nextConfig;
