import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArtigo from "@/components/BlogArtigo";
import { BLOG_ARTICLES, encontrarPost } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = encontrarPost(slug);

  if (!article) return {};

  return {
    title: `${article.titulo} — Rio Imóveis`,
    description: article.resumo,
    openGraph: {
      title: article.titulo,
      description: article.resumo,
      images: [{ url: article.imagem, alt: article.alt }],
      type: "article",
    },
  };
}

export default async function Page({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = encontrarPost(slug);

  if (!article) notFound();

  const index = BLOG_ARTICLES.findIndex((item) => item.slug === slug);
  const relacionados = Array.from({ length: 3 }, (_, offset) => {
    return BLOG_ARTICLES[(index + offset + 1) % BLOG_ARTICLES.length];
  });

  return <BlogArtigo artigo={article} relacionados={relacionados} />;
}
