import Link from "next/link";
import AssistenteImovel from "./AssistenteImovel";
import GaleriaImovel from "./GaleriaImovel";
import GaleriaPlantas from "./GaleriaPlantas";
import ImovelMapa from "./ImovelMapa";
import ProductSectionNav from "./ProductSectionNav";
import ProdutoCard from "./ProdutoCard";
import { DESTINOS } from "@/lib/bairros";
import type { ImovelDetalhe } from "@/lib/imoveis";
import { urlDoBairro } from "@/lib/site-urls";
import styles from "./ImovelDetalhePage.module.css";

type ImovelDetalhePageProps = {
  imovel: ImovelDetalhe;
  relacionados: readonly ImovelDetalhe[];
};

function escapeHtml(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function blocosDoAdmin(imovel: ImovelDetalhe) {
  const html = imovel.descricaoHtml?.trim();
  if (!html) return imovel.descricao.trim() ? [`<p>${escapeHtml(imovel.descricao)}</p>`] : [];

  const blocos = html.match(
    /<(p|h[2-4]|blockquote|ul|ol)\b[^>]*>[\s\S]*?<\/\1>/gi,
  );
  return blocos?.length ? blocos : [html];
}

function classeDaDistribuicao(quantidade: number) {
  if (quantidade <= 1) return styles.storyTextSingle;
  if (quantidade === 2) return styles.storyTextDouble;
  return styles.storyTextMultiple;
}

function quantidadeDeTextos(blocos: readonly string[]) {
  const textos = blocos.filter((bloco) => !/^<h[2-4]\b/i.test(bloco));
  return Math.max(1, textos.length);
}

export default function ImovelDetalhePage({
  imovel,
  relacionados,
}: ImovelDetalhePageProps) {
  const destinoBairro = DESTINOS.find(
    (destino) => destino.nome === imovel.bairro,
  );
  const bairroHref = urlDoBairro(destinoBairro?.slug ?? imovel.bairro);
  const blocos = blocosDoAdmin(imovel);
  const pontoDeDivisao = Math.max(1, Math.ceil(blocos.length / 2));
  const blocosAntesDaGaleria = blocos.slice(0, pontoDeDivisao);
  const blocosDepoisDaGaleria = blocos.slice(pontoDeDivisao);
  const textoAntesDaGaleria = blocosAntesDaGaleria.join("");
  const textoDepoisDaGaleria = blocosDepoisDaGaleria.join("");
  const dadosDoEndereco = [
    ["Logradouro", [imovel.logradouro, imovel.numero].filter(Boolean).join(", ")],
    ["Complemento", imovel.complemento],
    ["Bairro", imovel.bairro],
    ["Cidade", imovel.cidade],
    ["CEP", imovel.cep],
  ].filter((item): item is [string, string] => Boolean(item[1]));
  const consultaMapa =
    Number.isFinite(imovel.latitude) && Number.isFinite(imovel.longitude)
      ? `${imovel.latitude},${imovel.longitude}`
      : imovel.endereco;

  return (
    <main className={styles.page}>
      <section className={styles.summary} aria-label="Resumo do imóvel">
        <div>
          <span>
            {imovel.segmento === "refugio"
              ? "Refúgio selecionado"
              : imovel.categoria}
          </span>
          <strong>{imovel.bairro}</strong>
        </div>
        <div className={styles.summaryDetails}>
          <p>{imovel.tipologia}</p>
          <strong>{imovel.valor}</strong>
        </div>
        <Link href="#assistente">Consultar disponibilidade <span>↓</span></Link>
      </section>

      <ProductSectionNav
        className={styles.productNav}
        hasFeatures={imovel.diferenciais.length > 0}
        hasPlants={imovel.plantas.length > 0}
      />

      <div className={styles.layout}>
        <div className={styles.content}>
          <section id="visao-geral" className={styles.introduction}>
            <p className={styles.eyebrow}>O endereço</p>
            <h2>{imovel.chamada}</h2>
          </section>

          <section className={styles.facts} aria-label="Características principais">
            <article>
              <span>Área privativa</span>
              <strong>{imovel.area}</strong>
            </article>
            <article>
              <span>Tipologia</span>
              <strong>{imovel.tipologia}</strong>
            </article>
            <article>
              <span>Conveniência</span>
              <strong>{imovel.vagas}</strong>
            </article>
            <article>
              <span>Disponibilidade</span>
              <strong>{imovel.entrega}</strong>
            </article>
          </section>

          <section className={styles.story} aria-labelledby="imovel-historia">
            <p className={styles.eyebrow}>A experiência de morar</p>
            <h2 id="imovel-historia">
              Uma forma singular de viver {imovel.bairro}.
            </h2>

            {textoAntesDaGaleria && (
              <div
                className={`${styles.storyText} ${classeDaDistribuicao(
                  quantidadeDeTextos(blocosAntesDaGaleria),
                )}`}
                dangerouslySetInnerHTML={{ __html: textoAntesDaGaleria }}
              />
            )}

            <div id="galeria" className={styles.galleryAnchor}>
              <GaleriaImovel imagens={imovel.galeria} nome={imovel.nome} />
            </div>

            {textoDepoisDaGaleria && (
              <div
                className={`${styles.storyText} ${classeDaDistribuicao(
                  quantidadeDeTextos(blocosDepoisDaGaleria),
                )}`}
                dangerouslySetInnerHTML={{ __html: textoDepoisDaGaleria }}
              />
            )}
          </section>

          {imovel.plantas.length > 0 && (
            <section
              id="plantas"
              className={styles.plans}
              aria-labelledby="plantas-titulo"
            >
              <div className={styles.sectionHeading}>
                <div>
                  <p className={styles.eyebrow}>Plantas e possibilidades</p>
                  <h2 id="plantas-titulo">Entenda o espaço antes da visita.</h2>
                </div>
                <p>
                  Explore as configurações disponíveis e amplie cada desenho
                  para observar circulação, proporções e relação entre os
                  ambientes.
                </p>
              </div>
              <GaleriaPlantas nome={imovel.nome} plantas={imovel.plantas} />
              <p className={styles.planNotice}>
                Plantas ilustrativas. Medidas, disponibilidade e configurações
                devem ser confirmadas com a curadoria.
              </p>
            </section>
          )}

          {imovel.diferenciais.length > 0 && (
            <section id="diferenciais" className={styles.features}>
              <div className={styles.sectionHeading}>
                <div>
                  <p className={styles.eyebrow}>Diferenciais</p>
                  <h2>Por que este endereço está na seleção.</h2>
                </div>
                <p>
                  Informações gerais para apresentar a seleção com clareza e
                  acompanhar os próximos passos.
                </p>
              </div>
              <ol>
                {imovel.diferenciais.map((diferencial, index) => (
                  <li key={diferencial}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {diferencial}
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section id="localizacao" className={styles.mapSection}>
            <div className={styles.mapCopy}>
              <p className={styles.eyebrow}>Bairro e localização</p>
              <h2>Viver {imovel.bairro} por inteiro.</h2>
              <p>
                Localização cadastrada para {imovel.nome}, com o ponto indicado
                pelas coordenadas do empreendimento.
              </p>
              <address>{imovel.endereco}</address>
              <div className={styles.context}>
                {dadosDoEndereco.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <div className={styles.mapActions}>
                <Link href={bairroHref}>
                  Conhecer {imovel.bairro} <span>→</span>
                </Link>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    consultaMapa,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir no mapa <span>↗</span>
                </a>
              </div>
            </div>

            <div className={styles.map} aria-label={`Mapa de ${imovel.endereco}`}>
              <ImovelMapa
                id={imovel.id}
                nome={imovel.nome}
                bairro={imovel.bairro}
                tipologia={imovel.tipologia}
                valor={imovel.valor}
                imagem={imovel.imagem}
                endereco={imovel.endereco}
                latitude={imovel.latitude}
                longitude={imovel.longitude}
                slug={imovel.slug}
                segmento={imovel.segmento}
              />
            </div>
          </section>
        </div>

        <div id="assistente" className={styles.assistant}>
          <AssistenteImovel imovel={imovel} />

          <section className={styles.sideInfo} aria-label="Informações complementares">
            <article>
              <div className={styles.sideInfoTop}>
                <span>01</span>
                <p>Incorporadora</p>
              </div>
              <h3>{imovel.incorporadora}</h3>
              <p>
                {imovel.segmento === "refugio"
                  ? "Um endereço de autoria reservada, apresentado de forma individual pela curadoria Rio. Informações técnicas e comerciais são confirmadas durante o atendimento."
                  : `${imovel.incorporadora} integra a seleção de parceiros deste endereço. Histórico, memorial e informações comerciais são apresentados com contexto pela curadoria.`}
              </p>
            </article>

          </section>
        </div>
      </div>

      <section className={styles.related}>
        <div className={styles.relatedHeading}>
          <div>
            <p className={styles.eyebrow}>Continue explorando</p>
            <h2>Outros endereços que fazem sentido.</h2>
          </div>
          <Link href="/lancamentos">Ver todos os imóveis <span>→</span></Link>
        </div>
        <div className={styles.relatedGrid}>
          {relacionados.map((produto) => (
            <ProdutoCard
              produto={produto}
              key={produto.slug}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
