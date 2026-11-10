"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { encontrarDestino } from "@/lib/bairros";
import { encontrarPost } from "@/lib/blog";
import { encontrarImovel } from "@/lib/imoveis";
import styles from "./Breadcrumbs.module.css";

type Crumb = {
  href?: string;
  label: string;
};

const ROUTE_LABELS: Record<string, string> = {
  "alto-padrao": "Alto padrão",
  bairros: "Bairros",
  blog: "Blog",
  "calculadora-investimento-compra": "Calculadora imobiliária",
  contato: "Contato",
  construtoras: "Construtoras",
  lancamentos: "Lançamentos",
  refugios: "Refúgios",
  sobre: "Sobre o projeto",
  "termos-de-uso": "Termos de uso",
  "politica-de-privacidade": "Política de privacidade",
  "politica-de-cookies": "Política de cookies",
};

function labelFromSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function crumbsFor(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [];

  const [section, slug] = segments;
  const crumbs: Crumb[] = [{ href: "/", label: "Início" }];

  if (section === "imovel" && slug) {
    crumbs.push({ href: "/lancamentos", label: "Imóveis" });
    crumbs.push({ label: encontrarImovel(slug).nome });
    return crumbs;
  }

  if (section === "rio-de-janeiro") {
    if (segments.length === 4) {
      const [, bairro, tipo, titulo] = segments;
      crumbs.push({ href: tipo === "refugio" ? "/refugios" : "/lancamentos", label: tipo === "refugio" ? "Refúgios" : "Imóveis" });
      crumbs.push({ href: `/rio-de-janeiro/${bairro}`, label: labelFromSlug(bairro) });
      crumbs.push({ label: labelFromSlug(titulo) });
    } else if (slug) {
      crumbs.push({ href: "/bairros", label: "Rio de Janeiro" });
      crumbs.push({ label: labelFromSlug(slug) });
    }
    return crumbs;
  }

  if (section === "bairros" && slug) {
    crumbs.push({ href: "/bairros", label: "Bairros" });
    crumbs.push({ label: encontrarDestino(slug)?.nome ?? labelFromSlug(slug) });
    return crumbs;
  }

  if (section === "blog" && slug) {
    crumbs.push({ href: "/blog", label: "Blog" });
    crumbs.push({ label: encontrarPost(slug)?.titulo ?? labelFromSlug(slug) });
    return crumbs;
  }

  if (section === "construtora" && slug) {
    crumbs.push({ href: "/construtoras", label: "Construtoras" });
    crumbs.push({ label: labelFromSlug(slug) });
    return crumbs;
  }

  if (section === "regiao" && slug) {
    crumbs.push({ href: "/bairros", label: "Regiões" });
    crumbs.push({ label: labelFromSlug(slug) });
    return crumbs;
  }

  crumbs.push({
    label: ROUTE_LABELS[section] ?? labelFromSlug(section),
  });
  return crumbs;
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname.startsWith("/painel")) return null;
  const crumbs = crumbsFor(pathname);
  const isProductPage = pathname.startsWith("/imovel/") || pathname.split("/").filter(Boolean).length === 4;

  if (crumbs.length === 0) return null;

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${siteUrl}${crumb.href ?? pathname}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <div className={styles.bar}>
        <nav
          className={`${styles.inner} ${isProductPage ? styles.productInner : ""}`}
          aria-label="Navegação estrutural"
        >
          <ol>
            {crumbs.map((crumb, index) => {
              const current = index === crumbs.length - 1;
              return (
                <li key={`${crumb.label}-${index}`}>
                  {crumb.href && !current ? (
                    <Link href={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span aria-current={current ? "page" : undefined}>
                      {crumb.label}
                    </span>
                  )}
                  {!current && <i aria-hidden="true">/</i>}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </>
  );
}
