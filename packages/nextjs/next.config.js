// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bafybeifymhdsrm624idcn3zafq7c4qdppc5mhes2o62ygzc2kzfy7mkgqm.ipfs.nftstorage.link",
      },
    ],
  },
};

module.exports = nextConfig;
