"use client";

import { usePathname } from "next/navigation";
import Hero from "./Hero";

const HERO_ROUTES = [
  "/",
  "/lancamentos",
  "/alto-padrao",
  "/refugios",
  "/bairros",
  "/blog",
  "/calculadora-investimento-compra",
  "/imovel",
  "/contato",
  "/ilha-pura",
  "/construtoras",
  "/construtora",
  "/regiao",
];

export default function SiteHero() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isNeighborhoodRoute = segments.length === 2 && segments[0] === "rio-de-janeiro";
  const isProductRoute = segments.length === 4 && segments[0] === "rio-de-janeiro";
  const hasHero = HERO_ROUTES.some(
    (route) =>
      pathname === route || (route !== "/" && pathname.startsWith(`${route}/`)),
  );

  return hasHero || isNeighborhoodRoute || isProductRoute ? <Hero /> : null;
}
