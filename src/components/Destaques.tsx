"use client";

import Image from "next/image";
import Link from "next/link";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import type { Options } from "@splidejs/splide";
import { useRef, useState } from "react";
import "@splidejs/react-splide/css/core";
import CarouselControls, { ArrowIcon } from "./CarouselControls";
import { urlDoImovel } from "@/lib/site-urls";
import styles from "./Destaques.module.css";

const IMOVEIS = [
  {
    id: "01",
    bairro: "Ipanema",
    titulo: "Cobertura com vista para o mar em Ipanema",
    descricao:
      "Uma cobertura desenhada para viver o Rio por inteiro, com terraço generoso, piscina e a luz do fim de tarde sobre o mar.",
    imagem: "/img/destaque-ipanema.webp",
    alt: "Cobertura contemporânea em Ipanema com terraço, piscina e vista para o Morro Dois Irmãos",
    area: "412 m²",
    quartos: "4 suítes",
    vagas: "3 vagas",
    detalhe: "Vista mar",
  },
  {
    id: "02",
    bairro: "Leblon",
    titulo: "Apartamento de alto padrão no Leblon",
    descricao:
      "Interiores amplos e silenciosos, varanda aberta para o verde e uma localização que deixa praia, gastronomia e cidade a poucos passos.",
    imagem: "/img/destaque-leblon.webp",
    alt: "Sala ampla de apartamento no Leblon integrada a uma varanda com vista para o mar",
    area: "286 m²",
    quartos: "3 suítes",
    vagas: "2 vagas",
    detalhe: "Pronto para morar",
  },
  {
    id: "03",
    bairro: "Jardim Botânico",
    titulo: "Casa contemporânea no Jardim Botânico",
    descricao:
      "Arquitetura brasileira em diálogo com o jardim: concreto, madeira e grandes aberturas em um refúgio cercado pela natureza.",
    imagem: "/img/destaque-jardim-botanico.webp",
    alt: "Casa modernista no Jardim Botânico aberta para jardim tropical e piscina",
    area: "538 m²",
    quartos: "4 suítes",
    vagas: "4 vagas",
    detalhe: "Piscina e jardim",
  },
  {
    id: "04",
    bairro: "Gávea",
    titulo: "Lançamento residencial na Gávea",
    descricao:
      "Um residencial de poucas unidades, com varandas profundas, paisagismo integrado e a tranquilidade de uma rua aos pés da mata.",
    imagem: "/img/destaque-gavea.webp",
    alt: "Residencial contemporâneo na Gávea com varandas, madeira e paisagismo tropical",
    area: "185 a 312 m²",
    quartos: "3 e 4 suítes",
    vagas: "Até 3 vagas",
    detalhe: "Entrega 2028",
  },
] as const;

const OPCOES_SPLIDE: Options = {
  type: "loop",
  fixedWidth: "90%",
  gap: "4rem",
  perMove: 1,
  focus: 0,
  trimSpace: false,
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
    620: {
      gap: "1.2857rem",
    },
  },
};

export default function Destaques() {
  const splideRef = useRef<Splide | null>(null);
  const [ativo, setAtivo] = useState(0);

  return (
    <section className={styles.secao} aria-labelledby="destaques-titulo">
      <div className={styles.cabecalho}>
        <div className={styles.cabecalhoPrincipal}>
          <p className={styles.sobretitulo}>Imóveis em destaque</p>
          <h2 id="destaques-titulo">
            <span>Imóveis de alto padrão</span>
            <span>no Rio de Janeiro</span>
          </h2>
        </div>
        <p className={styles.introducao}>
          Conheça casas, apartamentos e coberturas de alto padrão à venda em
          Ipanema, Leblon, Gávea e Jardim Botânico, selecionados por
          localização, arquitetura e qualidade de vida.
        </p>
      </div>

      <Splide
        className={styles.carousel}
        ref={splideRef}
        options={OPCOES_SPLIDE}
        aria-label="Imóveis em destaque"
        data-drag-carousel
        onMove={(_splide, newIndex) => setAtivo(newIndex)}
      >
        {IMOVEIS.map((imovel) => (
          <SplideSlide className={styles.slide} key={imovel.id}>
            <article className={styles.card}>
              <div className={styles.imagem}>
                <Image
                  src={imovel.imagem}
                  alt={imovel.alt}
                  fill
                  sizes="(max-width: 57.1429rem) 82vw, 58vw"
                />
                <div className={styles.imagemSombra} />
              </div>

              <div className={styles.conteudo}>
                <div>
                  <p className={styles.curadoria}>Destaque em {imovel.bairro}</p>
                  <h3>{imovel.titulo}</h3>
                  <p className={styles.descricao}>{imovel.descricao}</p>
                </div>

                <dl className={styles.atributos}>
                  <div>
                    <dt>Área privativa</dt>
                    <dd>{imovel.area}</dd>
                  </div>
                  <div>
                    <dt>Configuração</dt>
                    <dd>{imovel.quartos}</dd>
                  </div>
                  <div>
                    <dt>Conveniência</dt>
                    <dd>{imovel.vagas}</dd>
                  </div>
                  <div>
                    <dt>Diferencial</dt>
                    <dd>{imovel.detalhe}</dd>
                  </div>
                </dl>

                <Link
                  className={styles.cta}
                  href={urlDoImovel({ bairro: imovel.bairro, nome: imovel.titulo, tipologia: imovel.titulo })}
                >
                  <span>Conhecer o imóvel</span>
                  <ArrowIcon />
                </Link>
              </div>
              <span className={styles.numero}>{imovel.id}</span>
            </article>
          </SplideSlide>
        ))}
      </Splide>

      <div className={styles.rodape}>
        <CarouselControls
          active={ativo}
          labels={IMOVEIS.map((imovel) => imovel.titulo)}
          onSelect={(indice) => {
            setAtivo(indice);
            splideRef.current?.go(indice);
          }}
          onPrevious={() => {
            setAtivo((current) => (current - 1 + IMOVEIS.length) % IMOVEIS.length);
            splideRef.current?.go("<");
          }}
          onNext={() => {
            setAtivo((current) => (current + 1) % IMOVEIS.length);
            splideRef.current?.go(">");
          }}
        />
      </div>
    </section>
  );
}
