"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import type { Options } from "@splidejs/splide";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CarouselControls from "./CarouselControls";
import styles from "./ConstrutorasCarousel.module.css";

export type ConstrutoraCarouselItem = {
  id: string;
  nome: string;
  monograma: string;
  especialidade: string;
  quantidade: number;
  imagem: string;
  href: string;
};

const CONSTRUTORAS: readonly ConstrutoraCarouselItem[] = [
  {
    id: "01",
    nome: "Opportunity",
    monograma: "OP",
    especialidade: "Investimento e desenvolvimento imobiliário",
    quantidade: 0, imagem: "/img/cover.webp", href: "/construtora/opportunity",
  },
  {
    id: "02",
    nome: "Mozak",
    monograma: "MZ",
    especialidade: "Alto padrão na Zona Sul",
    quantidade: 0, imagem: "/img/cover.webp", href: "/construtora/mozak",
  },
  {
    id: "03",
    nome: "SIG Engenharia",
    monograma: "SIG",
    especialidade: "Arquitetura, estética e acabamento",
    quantidade: 0, imagem: "/img/cover.webp", href: "/construtora/sig-engenharia",
  },
  {
    id: "04",
    nome: "Balassiano",
    monograma: "BL",
    especialidade: "Residenciais de altíssimo padrão",
    quantidade: 0, imagem: "/img/cover.webp", href: "/construtora/balassiano",
  },
  {
    id: "05",
    nome: "RJZ Cyrela",
    monograma: "RJZ",
    especialidade: "Grandes projetos residenciais",
    quantidade: 0, imagem: "/img/cover.webp", href: "/construtora/rjz-cyrela",
  },
  {
    id: "06",
    nome: "Carvalho Hosken",
    monograma: "CH",
    especialidade: "Bairros planejados e desenvolvimento urbano",
    quantidade: 0, imagem: "/img/cover.webp", href: "/construtora/carvalho-hosken",
  },
  {
    id: "07",
    nome: "Calçada",
    monograma: "CA",
    especialidade: "Tradição no mercado carioca",
    quantidade: 0, imagem: "/img/cover.webp", href: "/construtora/calcada",
  },
  {
    id: "08",
    nome: "Performance",
    monograma: "PF",
    especialidade: "Design e transformação urbana",
    quantidade: 0, imagem: "/img/cover.webp", href: "/construtora/performance",
  },
  {
    id: "09",
    nome: "Tegra",
    monograma: "TG",
    especialidade: "Residenciais de alto padrão",
    quantidade: 0, imagem: "/img/cover.webp", href: "/construtora/tegra",
  },
  {
    id: "10",
    nome: "Patrimar",
    monograma: "PT",
    especialidade: "Imóveis de luxo e alto luxo",
    quantidade: 0, imagem: "/img/cover.webp", href: "/construtora/patrimar",
  },
] as const;

const OPTIONS: Options = {
  type: "loop",
  perPage: 4,
  perMove: 1,
  gap: "1.5714rem",
  arrows: false,
  pagination: false,
  drag: "free",
  snap: true,
  speed: 720,
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  flickPower: 420,
  flickMaxPages: 1,
  keyboard: "focused",
  waitForTransition: false,
  breakpoints: {
    1120: { perPage: 3 },
    820: { perPage: 2 },
    560: {
      perPage: 1,
      gap: "1.0714rem",
      padding: { right: "14%" },
    },
  },
};

export default function ConstrutorasCarousel({ items = CONSTRUTORAS }: { items?: readonly ConstrutoraCarouselItem[] }) {
  const splideRef = useRef<Splide | null>(null);
  const [active, setActive] = useState(0);

  return (
    <section className={styles.section} aria-labelledby="construtoras-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Quem constrói o novo Rio</p>
          <h2 id="construtoras-title">
            <span>Construtoras em</span>
            <span>nossa curadoria.</span>
          </h2>
        </div>
        <p>
          Uma visão organizada de incorporadoras e construtoras presentes nos
          projetos acompanhados pelo Rio Lançamentos.
        </p>
      </header>

      <Splide
        ref={splideRef}
        className={styles.carousel}
        options={OPTIONS}
        aria-label="Lista de construtoras"
        data-drag-carousel
        onMove={(_splide, newIndex) => setActive(newIndex)}
      >
        {items.map((company) => (
          <SplideSlide className={styles.slide} key={company.id}>
            <Link className={styles.card} href={company.href} aria-label={`Ver ${company.quantidade} imóveis de ${company.nome}`}>
              <Image className={styles.cardImage} src={company.imagem} alt="" fill sizes="(max-width: 50rem) 86vw, 25vw" />
              <span className={styles.cardShade} aria-hidden="true" />
              <div className={styles.cardTop}>
                <span>{company.id}</span>
                <span>Mercado carioca</span>
              </div>

              <div className={styles.mark} aria-hidden="true">
                <span>{company.monograma}</span>
                <i />
              </div>

              <div className={styles.cardContent}>
                <h3>{company.nome}</h3>
                <p>{company.especialidade}</p>
                <span>{company.quantidade} {company.quantidade === 1 ? "imóvel" : "imóveis"} na curadoria</span>
              </div>
            </Link>
          </SplideSlide>
        ))}
      </Splide>

      <div className={styles.controls}>
        <CarouselControls
          active={active}
          labels={items.map((company) => company.nome)}
          onSelect={(index) => {
            setActive(index);
            splideRef.current?.go(index);
          }}
          onPrevious={() => {
            setActive(
              (current) =>
                (current - 1 + items.length) % items.length,
            );
            splideRef.current?.go("<");
          }}
          onNext={() => {
            setActive((current) => (current + 1) % items.length);
            splideRef.current?.go(">");
          }}
        />
      </div>
      <Link className={styles.viewAll} href="/construtoras">
        <span>Ver todas as construtoras</span>
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
