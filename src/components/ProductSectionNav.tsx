"use client";

import type { MouseEvent } from "react";

type ProductSectionNavProps = {
  className: string;
  hasFeatures?: boolean;
  hasPlants?: boolean;
};

const SECTIONS = [
  ["visao-geral", "Visão geral"],
  ["plantas", "Plantas"],
  ["galeria", "Galeria"],
  ["diferenciais", "Diferenciais"],
  ["localizacao", "Localização"],
] as const;

export default function ProductSectionNav({
  className,
  hasFeatures = true,
  hasPlants = true,
}: ProductSectionNavProps) {
  function scrollToSection(
    event: MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    event.preventDefault();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    section.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

    const hash = `#${sectionId}`;
    if (window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
    }
  }

  return (
    <nav className={className} aria-label="Navegação do imóvel">
      {SECTIONS.filter(
        ([sectionId]) =>
          (hasPlants || sectionId !== "plantas") &&
          (hasFeatures || sectionId !== "diferenciais"),
      ).map(([sectionId, label]) => (
        <a
          href={`#${sectionId}`}
          key={sectionId}
          onClick={(event) => scrollToSection(event, sectionId)}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
