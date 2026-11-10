import type { Metadata } from "next";
import { Figtree, Bricolage_Grotesque } from "next/font/google";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import RouteScrollManager from "@/components/RouteScrollManager";
import SiteHero from "@/components/SiteHero";
import "./globals.css";

// fonte do corpo, via var(--font-figtree). só os pesos usados: 400 (corpo) e 500 (menu/busca)
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// título (H1 do hero) via var(--font-titulo). só o peso 600 é usado
const titulo = Bricolage_Grotesque({
  variable: "--font-titulo",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Imóveis à venda no Rio de Janeiro | Rio Lançamentos",
  description:
    "Encontre apartamentos, casas, coberturas, lançamentos e imóveis de alto padrão para comprar ou investir nos melhores bairros do Rio de Janeiro.",
  icons: {
    icon: [{ url: "/img/favicon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/img/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Imóveis à venda no Rio de Janeiro | Rio Lançamentos",
    description:
      "Apartamentos, casas, coberturas, lançamentos e imóveis de alto padrão para comprar ou investir nos melhores bairros do Rio de Janeiro.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${figtree.variable} ${titulo.variable}`}>
      <body>
        <RouteScrollManager />
        <SiteHero />
        <Breadcrumbs />
        {children}
        <Footer />
      </body>
    </html>
  );
}
