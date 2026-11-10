import Image from "next/image";
import Link from "next/link";
import { urlDoImovel } from "@/lib/site-urls";
import styles from "./ProdutoCard.module.css";

export type Produto = {
  id: string;
  nome: string;
  bairro: string;
  tipologia: string;
  valor: string;
  categoria: "Lançamento" | "Alto padrão";
  imagem: string;
  alt: string;
  slug?: string;
  segmento?: "imovel" | "refugio";
  tipoImovel?: string;
};

type ProdutoCardProps = {
  produto: Produto;
};

export default function ProdutoCard({ produto }: ProdutoCardProps) {
  return (
    <article className={styles.card}>
      <Link
        href={urlDoImovel(produto)}
        className={styles.link}
        aria-label={`Conhecer ${produto.nome}, ${produto.bairro}`}
      >
        <div className={styles.media}>
          <Image
            src={produto.imagem}
            alt={produto.alt}
            fill
            sizes="(max-width: 50rem) 82vw, (max-width: 78.5714rem) 46vw, 31vw"
          />
          <span className={styles.category}>{produto.categoria}</span>
          <span className={styles.index}>{produto.id}</span>
          <div className={styles.imageShade} />
        </div>

        <div className={styles.content}>
          <p className={styles.location}>
            <PinIcon />
            {produto.bairro}
          </p>
          <h3>{produto.nome}</h3>
          <p className={styles.type}>{produto.tipologia}</p>

          <div className={styles.footer}>
            <p className={styles.price}>
              <span>A partir de</span>
              <strong>{produto.valor}</strong>
            </p>
            <span className={styles.action} aria-hidden="true">
              <ArrowIcon />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 7l5 5-5 5" />
    </svg>
  );
}
