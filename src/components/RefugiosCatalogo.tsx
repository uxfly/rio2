import Image from "next/image";
import Link from "next/link";
import { urlDoImovel } from "@/lib/site-urls";
import styles from "./RefugiosCatalogo.module.css";

export type RefugioCatalogo = {
  id: string;
  slug: string;
  nome: string;
  local: string;
  assinatura: string;
  descricao: string;
  tipologia: string;
  area: string;
  terreno: string;
  valor: string;
  imagem: string;
  alt: string;
};

const REFUGIOS: readonly RefugioCatalogo[] = [
  {
    id: "01",
    slug: "quinta-das-amoras",
    nome: "Quinta das Amoras",
    local: "Vargem Grande",
    assinatura: "Refúgio em destaque",
    descricao:
      "Uma propriedade cercada pelo verde, desenhada para uma rotina mais silenciosa e próxima da natureza, sem deixar o Rio para trás.",
    tipologia: "Casa com 5 suítes",
    area: "1.180 m² privativos",
    terreno: "4.600 m² de terreno",
    valor: "R$ 12.800.000",
    imagem: "/img/barra-itanhanga.webp",
    alt: "Casa contemporânea cercada por vegetação em Vargem Grande",
  },
  {
    id: "02",
    slug: "casa-suspensa-do-joa",
    nome: "Casa Suspensa do Joá",
    local: "Joá",
    assinatura: "Mar e montanha",
    descricao:
      "Arquitetura aberta para o horizonte, com grandes planos de vidro, terraços generosos e privacidade entre a Pedra da Gávea e o Atlântico.",
    tipologia: "Casa com 4 suítes",
    area: "720 m² privativos",
    terreno: "1.340 m² de terreno",
    valor: "R$ 24.500.000",
    imagem: "/img/barra-vista-lagoa.webp",
    alt: "Residência elevada com vista para montanhas e mar no Joá",
  },
  {
    id: "03",
    slug: "reserva-itanhanga",
    nome: "Reserva Itanhangá",
    local: "Itanhangá",
    assinatura: "Mata e arquitetura",
    descricao:
      "Uma casa de linhas essenciais dentro de um dos condomínios mais reservados da cidade, com jardim maduro e ambientes integrados.",
    tipologia: "Casa com 5 suítes",
    area: "860 m² privativos",
    terreno: "2.100 m² de terreno",
    valor: "R$ 16.900.000",
    imagem: "/img/barra-clube.webp",
    alt: "Casa de alto padrão integrada à mata no Itanhangá",
  },
  {
    id: "04",
    slug: "alto-da-floresta",
    nome: "Alto da Floresta",
    local: "Alto da Boa Vista",
    assinatura: "Clima de serra",
    descricao:
      "Temperatura amena, jardins históricos e uma casa voltada para receber. Um endereço para viver o tempo em outro ritmo.",
    tipologia: "Casa com 6 suítes",
    area: "940 m² privativos",
    terreno: "5.200 m² de terreno",
    valor: "R$ 14.600.000",
    imagem: "/img/destaque-jardim-botanico.webp",
    alt: "Residência ampla em jardim arborizado no Alto da Boa Vista",
  },
  {
    id: "05",
    slug: "horizonte-sao-conrado",
    nome: "Horizonte São Conrado",
    local: "São Conrado",
    assinatura: "Vista preservada",
    descricao:
      "Uma residência panorâmica com piscina, pátios protegidos e ambientes que acompanham a luz ao longo de todo o dia.",
    tipologia: "Casa com 5 suítes",
    area: "810 m² privativos",
    terreno: "1.780 m² de terreno",
    valor: "R$ 21.300.000",
    imagem: "/img/barra-jardim-oceanico.webp",
    alt: "Casa panorâmica com piscina e vista preservada em São Conrado",
  },
];

export default function RefugiosCatalogo({ items = REFUGIOS }: { items?: readonly RefugioCatalogo[] }) {
  return (
    <main className={styles.page}>
      <section
        className={styles.catalog}
        aria-label="Seleção de cinco refúgios no Rio de Janeiro"
      >
        <div className={styles.list}>
          {items.map((refugio) => (
            <article className={styles.refugio} key={refugio.id}>
              <div className={styles.image}>
                <Image
                  src={refugio.imagem}
                  alt={refugio.alt}
                  fill
                  sizes="(max-width: 50rem) 100vw, 55vw"
                />
                <span className={styles.imageIndex}>{refugio.id}</span>
              </div>

              <div className={styles.content}>
                <div className={styles.contentTop}>
                  <span>{refugio.assinatura}</span>
                  <span>{refugio.local}</span>
                </div>

                <div>
                  <h3>{refugio.nome}</h3>
                  <p>{refugio.descricao}</p>
                </div>

                <dl className={styles.details}>
                  <div>
                    <dt>Configuração</dt>
                    <dd>{refugio.tipologia}</dd>
                  </div>
                  <div>
                    <dt>Área</dt>
                    <dd>{refugio.area}</dd>
                  </div>
                  <div>
                    <dt>Terreno</dt>
                    <dd>{refugio.terreno}</dd>
                  </div>
                </dl>

                <div className={styles.footer}>
                  <div>
                    <span>A partir de</span>
                    <strong>{refugio.valor}</strong>
                  </div>
                  <Link href={urlDoImovel({ bairro: refugio.local, nome: refugio.nome, slug: refugio.slug, segmento: "refugio", tipologia: refugio.tipologia })}>
                    Conhecer este refúgio
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
