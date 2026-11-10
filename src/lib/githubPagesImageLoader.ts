import type { ImageLoaderProps } from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function githubPagesImageLoader({
  src,
}: ImageLoaderProps): string {
  if (/^(?:https?:|data:|blob:)/.test(src)) return src;

  const pathname = src.startsWith("/") ? src : `/${src}`;
  return `${basePath}${pathname}`;
}
