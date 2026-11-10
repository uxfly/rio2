import Image from "next/image";
import Link from "next/link";
import { urlDaTipologia } from "@/lib/site-urls";
import styles from "./TipologiasCuradoria.module.css";

type Tipologia = {
  id: string;
  nome: string;
  singular: string;
  quantidade: number;
  descricao: string;
  imagem: string;
  alt: string;
  palavras: readonly string[];
};

const TIPOLOGIAS: readonly Tipologia[] = [
  {
    id: "apartamentos",
    nome: "Apartamentos",
    singular: "Apartamento",
    quantidade: 48,
    descricao:
      "Plantas versáteis, varandas generosas e endereços que aproximam tudo o que importa.",
    imagem: "/img/barra-vista-lagoa.webp",
    alt: "Apartamento contemporâneo com sala integrada à varanda e vista para a lagoa",
    palavras: [
      "apartamento",
      "apartamentos",
      "varanda",
      "vista",
      "familia",
      "tres quartos",
      "quatro quartos",
      "cobertura",
    ],
  },
  {
    id: "casas",
    nome: "Casas",
    singular: "Casa",
    quantidade: 16,
    descricao:
      "Mais privacidade, arquitetura autoral e espaço para viver entre jardim, piscina e natureza.",
    imagem: "/img/barra-itanhanga.webp",
    alt: "Casa contemporânea integrada à mata com jardim e piscina",
    palavras: [
      "casa",
      "casas",
      "piscina",
      "quintal",
      "privacidade",
      "condominio",
      "natureza",
      "familia",
    ],
  },
  {
    id: "gardens",
    nome: "Gardens",
    singular: "Garden",
    quantidade: 11,
    descricao:
      "A experiência de uma casa com a segurança do edifício e uma área externa só sua.",
    imagem: "/img/destaque-jardim-botanico.webp",
    alt: "Residência garden aberta para área externa com vegetação tropical",
    palavras: [
      "garden",
      "gardens",
      "jardim",
      "terreo",
      "area externa",
      "pet",
      "animais",
      "quintal",
    ],
  },
  {
    id: "studios",
    nome: "Studios",
    singular: "Studio",
    quantidade: 23,
    descricao:
      "Espaços inteligentes para quem busca mobilidade, praticidade e uma relação intensa com a cidade.",
    imagem: "/img/colecao-be-in-rio.webp",
    alt: "Empreendimento boutique de studios em rua arborizada próxima à praia",
    palavras: [
      "studio",
      "studios",
      "compacto",
      "investimento",
      "metro",
      "mobilidade",
      "praticidade",
      "sozinho",
      "aluguel",
    ],
  },
] as const;

export default function TipologiasCuradoria() {
  return (
    <section
      id="curadoria-tipologias"
      className={styles.section}
      aria-labelledby="tipologias-title"
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Curadoria por estilo de vida</p>
          <h2 id="tipologias-title">
            <span>Como você</span>
            <span>quer morar?</span>
          </h2>
        </div>

        <p className={styles.introduction}>
          Conte um pouco sobre a vida que você imagina. Nossa curadoria aproxima
          seu desejo das tipologias mais adequadas.
        </p>
      </header>

      <div className={styles.grid}>
        {TIPOLOGIAS.map((type) => (
          <article className={styles.card} key={type.id}>
            <Link
              href={urlDaTipologia(type.singular)}
              aria-label={`Explorar ${type.nome}: ${type.quantidade} empreendimentos`}
            >
              <Image
                src={type.imagem}
                alt={type.alt}
                fill
                sizes="(max-width: 51.4286rem) 100vw, 55vw"
              />
              <div className={styles.shade} />

              <div className={styles.cardTop}>
                <p>
                  <strong>{String(type.quantidade).padStart(2, "0")}</strong>
                  <span>empreendimentos</span>
                </p>
                <span className={styles.cardArrow}>
                  <ArrowIcon />
                </span>
              </div>

              <div className={styles.cardContent}>
                <p>{type.singular}</p>
                <h3>{type.nome}</h3>
                <span>{type.descricao}</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
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
