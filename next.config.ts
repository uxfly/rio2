import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages
  ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "/rio")
  : "";

const nextConfig: NextConfig = {
  // GitHub Pages: export estático. VPS (Node): standalone — empacota o servidor
  // mínimo + só as deps necessárias, sem precisar de `npm ci` no servidor.
  output: isGitHubPages ? "export" : "standalone",
  basePath,
  trailingSlash: isGitHubPages,
  poweredByHeader: false,
  serverExternalPackages: ["better-sqlite3"],
  images: {
    loader: isGitHubPages ? "custom" : "default",
    loaderFile: isGitHubPages
      ? "./src/lib/githubPagesImageLoader.ts"
      : undefined,
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      {
        pathname: "/img/**",
        search: "",
      },
      {
        pathname: "/uploads/**",
        search: "",
      },
      {
        pathname: "/media/**",
        search: "",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "haushome.co",
        pathname: "/api/midia/file/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["@splidejs/react-splide", "@splidejs/splide"],
  },
};

export default nextConfig;
