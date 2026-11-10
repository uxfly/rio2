"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import type { Options } from "@splidejs/splide";
import { useRef, useState } from "react";
import CarouselControls from "./CarouselControls";
import ProdutoCard, { type Produto } from "./ProdutoCard";
import styles from "./BarraDestaques.module.css";

const OPTIONS: Options = {
  type: "loop",
  perPage: 3,
  perMove: 1,
  gap: "2rem",
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
    1100: { perPage: 2 },
    700: {
      perPage: 1,
      gap: "1.1429rem",
      padding: { right: "14%" },
    },
  },
};

type RegiaoDestaquesProps = {
  id: string;
  titulo: readonly [string, string];
  sobretitulo: string;
  descricao: string;
  produtos: readonly Produto[];
};

function RegiaoDestaques({
  id,
  titulo,
  sobretitulo,
  descricao,
  produtos,
}: RegiaoDestaquesProps) {
  const splideRef = useRef<Splide | null>(null);
  const [active, setActive] = useState(0);
  const titleId = `${id}-title`;
  const titleText = titulo.join(" ");

  if (produtos.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <header className={styles.header}>
        <h2 id={titleId}>
          <span>{titulo[0]}</span>
          <span>{titulo[1]}</span>
        </h2>

        <div className={styles.context}>
          <p className={styles.eyebrow}>{sobretitulo}</p>
          <p>{descricao}</p>
        </div>
      </header>

      <Splide
        ref={splideRef}
        className={styles.carousel}
        options={{ ...OPTIONS, type: produtos.length > 3 ? "loop" : "slide" }}
        aria-label={titleText}
        data-drag-carousel
        onMove={(_splide, newIndex) => setActive(newIndex)}
      >
        {produtos.map((produto) => (
          <SplideSlide className={styles.slide} key={produto.id}>
            <ProdutoCard produto={produto} />
          </SplideSlide>
        ))}
      </Splide>

      {produtos.length > 1 && (
        <div className={styles.controls}>
          <CarouselControls
            active={active}
            labels={produtos.map((produto) => produto.nome)}
            onSelect={(index) => {
              setActive(index);
              splideRef.current?.go(index);
            }}
            onPrevious={() => {
              setActive(
                (current) => (current - 1 + produtos.length) % produtos.length,
              );
              splideRef.current?.go("<");
            }}
            onNext={() => {
              setActive((current) => (current + 1) % produtos.length);
              splideRef.current?.go(">");
            }}
          />
        </div>
      )}
    </section>
  );
}

type DestaquesProps = {
  produtos: readonly Produto[];
};

export default function BarraDestaques({ produtos }: DestaquesProps) {
  return (
    <RegiaoDestaques
      id="barra"
      titulo={["Imóveis à venda na", "Barra da Tijuca e no Recreio"]}
      sobretitulo="Comprar na Barra e no Recreio"
      descricao="Apartamentos, casas, coberturas e lançamentos à venda entre as praias, lagoas e condomínios da Barra da Tijuca e do Recreio dos Bandeirantes."
      produtos={produtos}
    />
  );
}

export function ZonaSulDestaques({ produtos }: DestaquesProps) {
  return (
    <RegiaoDestaques
      id="zona-sul"
      titulo={["Apartamento e casa à venda", "no Rio de Janeiro"]}
      sobretitulo="Comprar na Zona Sul"
      descricao="Apartamentos e casas à venda nos endereços mais desejados da Zona Sul carioca."
      produtos={produtos}
    />
  );
}
