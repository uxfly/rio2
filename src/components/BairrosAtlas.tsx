import Image from "next/image";
import Link from "next/link";
import styles from "./BairrosAtlas.module.css";

export type BairroAtlasItem = {
  nome: string;
  regiao: string;
  descricao: string;
  tipologias: string;
  quantidade: number;
  imagem: string;
  alt: string;
  href: string;
};

const BAIRROS: readonly BairroAtlasItem[] = [
  {
    nome: "Barra da Tijuca",
    regiao: "Zona Oeste",
    descricao: "Mar, lagoa e condomínios desenhados para uma vida completa.",
    tipologias: "Lançamentos · Casas · Coberturas",
    quantidade: 27,
    imagem: "/img/colecao-ilha-pura.webp",
    alt: "Parque residencial com lago e edifícios na Barra da Tijuca",
    href: "/rio-de-janeiro/barra-da-tijuca",
  },
  {
    nome: "Ipanema",
    regiao: "Zona Sul",
    descricao: "Arquitetura, praia e uma forma singular de viver a cidade.",
    tipologias: "Coberturas · Apartamentos · Studios",
    quantidade: 18,
    imagem: "/img/bairro-ipanema.webp",
    alt: "Rua arborizada em Ipanema com vista para o mar e o Morro Dois Irmãos",
    href: "/rio-de-janeiro/ipanema",
  },
  {
    nome: "Leblon",
    regiao: "Zona Sul",
    descricao: "Endereços raros entre ruas tranquilas, gastronomia e montanha.",
    tipologias: "Alto padrão · Gardens · Coberturas",
    quantidade: 14,
    imagem: "/img/bairro-leblon.webp",
    alt: "Rua residencial arborizada no Leblon com edifícios e montanha ao fundo",
    href: "/rio-de-janeiro/leblon",
  },
  {
    nome: "Botafogo",
    regiao: "Zona Sul",
    descricao: "Um bairro cosmopolita diante de uma das paisagens mais icônicas do Rio.",
    tipologias: "Lançamentos · Studios · Apartamentos",
    quantidade: 12,
    imagem: "/img/bairro-botafogo.webp",
    alt: "Enseada de Botafogo com edifícios, barcos e o Pão de Açúcar",
    href: "/rio-de-janeiro/botafogo",
  },
  {
    nome: "Jardim Botânico",
    regiao: "Zona Sul",
    descricao: "Casas e residenciais contemporâneos cercados pela Mata Atlântica.",
    tipologias: "Casas · Apartamentos · Jardins",
    quantidade: 9,
    imagem: "/img/destaque-jardim-botanico.webp",
    alt: "Casa contemporânea integrada à vegetação do Jardim Botânico",
    href: "/rio-de-janeiro/jardim-botanico",
  },
  {
    nome: "Copacabana",
    regiao: "Zona Sul",
    descricao: "A energia da orla encontra uma nova geração de projetos boutique.",
    tipologias: "Studios · Double suites · Coberturas",
    quantidade: 21,
    imagem: "/img/colecao-be-in-rio.webp",
    alt: "Edifício residencial boutique em rua arborizada próxima à praia de Copacabana",
    href: "/rio-de-janeiro/copacabana",
  },
] as const;

export default function BairrosAtlas({ items = BAIRROS }: { items?: readonly BairroAtlasItem[] }) {
  return (
    <section className={styles.section} aria-labelledby="atlas-bairros-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Guia de bairros do Rio</p>
          <h2 id="atlas-bairros-title">
            <span>Bairros que transformam</span>
            <span>a forma de viver.</span>
          </h2>
        </div>

        <p className={styles.introduction}>
          Explore imóveis nos endereços mais desejados do Rio de Janeiro e
          descubra qual paisagem combina com o seu próximo capítulo.
        </p>
      </header>

      <ol className={styles.list}>
        {items.map((bairro, index) => (
          <li key={bairro.nome}>
            <Link
              className={styles.row}
              href={bairro.href}
              aria-label={`Explorar ${bairro.nome}: ${bairro.quantidade} empreendimentos`}
            >
              <span className={styles.index}>
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className={styles.media}>
                <Image
                  src={bairro.imagem}
                  alt={bairro.alt}
                  fill
                  sizes="(max-width: 51.4286rem) 100vw, 25vw"
                />
                <span className={styles.region}>{bairro.regiao}</span>
              </div>

              <div className={styles.identity}>
                <h3>{bairro.nome}</h3>
                <p>{bairro.descricao}</p>
                <span>{bairro.tipologias}</span>
              </div>

              <p className={styles.availability}>
                <strong>{String(bairro.quantidade).padStart(2, "0")}</strong>
                <span>empreendimentos</span>
              </p>

              <span className={styles.arrow} aria-hidden="true">
                <ArrowIcon />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <Link className={styles.allNeighborhoods} href="/bairros">
        <span>Conhecer todos os bairros</span>
        <ArrowIcon />
      </Link>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 7l5 5-5 5" />
    </svg>
  );
}
