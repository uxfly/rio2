import type { Metadata } from "next";
import BlogCatalogo from "@/components/BlogCatalogo";

export const metadata: Metadata = {
  title: "Blog imobiliário do Rio de Janeiro | Rio Imóveis",
  description:
    "Conteúdo sobre imóveis, arquitetura, bairros, lançamentos e investimento imobiliário no Rio de Janeiro.",
};

export default function Page() {
  return <BlogCatalogo />;
}
