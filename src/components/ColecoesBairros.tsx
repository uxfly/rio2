import Image from "next/image";
import Link from "next/link";
import styles from "./ColecoesBairros.module.css";

const ILHA_PURA_PRODUTOS = [
  {
    id: "01",
    nome: "Pura por Artefacto",
    tipologia: "3 e 4 quartos · 117 a 264 m²",
  },
  {
    id: "02",
    nome: "Oro Ilha Pura",
    tipologia: "3 ou 4 suítes · 171 a 461 m²",
  },
  {
    id: "03",
    nome: "Astra",
    tipologia: "2 quartos · 86 a 93 m²",
  },
] as const;

const COLECOES = [
  {
    id: "01",
    nome: "Be.in.Rio",
    descricao:
      "Studios, gardens, double suites e coberturas em endereços selecionados de Copacabana e Arpoador.",
    locais: "Copacabana · Arpoador",
    imagem: "/img/colecao-be-in-rio.webp",
    alt: "Fachada de empreendimento boutique contemporâneo próximo à praia de Copacabana",
  },
  {
    id: "02",
    nome: "Soul Rio",
    descricao:
      "Empreendimentos boutique que traduzem a identidade de cada bairro em arquitetura, localização e lifestyle.",
    locais: "Ipanema · Flamengo · Copacabana",
    imagem: "/img/colecao-soul-rio.webp",
    alt: "Rooftop de empreendimento boutique no Rio de Janeiro com vista para as montanhas",
  },
] as const;

export default function ColecoesBairros() {
  return (
    <section
      id="colecoes-e-bairros"
      className={styles.section}
      aria-labelledby="colecoes-bairros-title"
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Outras formas de viver o Rio</p>
          <h2 id="colecoes-bairros-title">
            <span>Coleções e Bairros</span>
            <span>Planejados.</span>
          </h2>
        </div>
        <p className={styles.introduction}>
          Projetos conectados por uma visão maior: endereços com identidade e
          lugares pensados para transformar a vida ao redor.
        </p>
      </header>

      <div className={styles.grid}>
        <article className={styles.planned}>
          <div className={styles.plannedMedia}>
            <Image
              src="/img/colecao-ilha-pura.webp"
              alt="Bairro planejado na Barra da Tijuca com parque, lago, ciclovia e edifícios residenciais"
              fill
              sizes="(max-width: 64.2857rem) 100vw, 55vw"
            />
            <div className={styles.imageShade} />
            <p className={styles.cardLabel}>
              <span>01</span>
              Bairros Planejados
            </p>
          </div>

          <div className={styles.plannedContent}>
            <div className={styles.plannedCopy}>
              <p className={styles.location}>Barra da Tijuca</p>
              <h3>Ilha Pura</h3>
              <p>
                Um bairro residencial de alto padrão organizado ao redor de um
                parque de 72 mil m², com lazer, segurança e conveniências para
                uma rotina mais completa.
              </p>
            </div>

            <div className={styles.products} aria-label="Produtos Ilha Pura">
              {ILHA_PURA_PRODUTOS.map((produto) => (
                <Link
                  href="#"
                  className={styles.product}
                  key={produto.id}
                  aria-label={`Conhecer ${produto.nome}, Ilha Pura`}
                >
                  <span className={styles.productNumber}>{produto.id}</span>
                  <span className={styles.productCopy}>
                    <strong>{produto.nome}</strong>
                    <small>{produto.tipologia}</small>
                  </span>
                  <ArrowIcon />
                </Link>
              ))}
            </div>

            <Link className={styles.button} href="#">
              <span>Conhecer Ilha Pura</span>
              <ArrowIcon />
            </Link>
          </div>
        </article>

        <div className={styles.collections}>
          <div className={styles.collectionsIntro}>
            <div>
              <p className={styles.columnNumber}>02</p>
              <h3>Coleções</h3>
            </div>
          </div>

          <div className={styles.collectionList}>
            {COLECOES.map((colecao) => (
              <article className={styles.collectionCard} key={colecao.id}>
                <div className={styles.collectionMedia}>
                  <Image
                    src={colecao.imagem}
                    alt={colecao.alt}
                    fill
                    sizes="(max-width: 50rem) 100vw, (max-width: 64.2857rem) 45vw, 24vw"
                  />
                  <div className={styles.imageShade} />
                </div>

                <div className={styles.collectionContent}>
                  <p className={styles.location}>{colecao.locais}</p>
                  <h4>{colecao.nome}</h4>
                  <p>{colecao.descricao}</p>
                  <Link
                    className={styles.textLink}
                    href="#"
                    aria-label={`Conhecer a coleção ${colecao.nome}`}
                  >
                    Ver empreendimentos
                    <ArrowIcon />
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
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
