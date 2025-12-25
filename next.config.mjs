/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "/navidadMily",
  assetPrefix: "/navidadMily/",
  trailingSlash: true,
};

export default nextConfig;
