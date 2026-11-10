import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BairroProdutos from "@/components/BairroProdutos";
import ImovelDetalhePage from "@/components/ImovelDetalhePage";
import { DESTINOS, type DestinoBairro } from "@/lib/bairros";
import { getAdminBairros } from "@/lib/admin-bairros-store";
import { getPublishedProperties } from "@/lib/admin-imoveis-store";
import { IMOVEIS_DETALHES, relacionadosAoImovel, slugificarImovel } from "@/lib/imoveis";
import { relatedPublishedProperties, toPropertyDetail } from "@/lib/published-imoveis";
import { slugDoTipo } from "@/lib/site-urls";

type PageProps = { params: Promise<{ slug: string[] }> };

const TIPOLOGIAS = new Set(["apartamento", "casa", "cobertura", "garden", "studio"]);

async function produtoDaRota(segmentos: string[]) {
  if (segmentos.length !== 3) return null;
  const [bairro, tipo, titulo] = segmentos;
  const properties = await getPublishedProperties();
  const item = properties.find((property) =>
    property.slug === titulo &&
    slugificarImovel(property.bairro) === bairro &&
    (property.segmento === "refugio"
      ? tipo === "refugio"
      : tipo === slugDoTipo(property.tipoImovel, property.tipologia)),
  );
  if (item) {
    return {
      detail: toPropertyDetail(item),
      related: relatedPublishedProperties(item, properties).map(toPropertyDetail),
    };
  }
  const estatico = IMOVEIS_DETALHES.find((property) =>
    property.slug === titulo &&
    slugificarImovel(property.bairro) === bairro &&
    (property.segmento === "refugio"
      ? tipo === "refugio"
      : tipo === slugDoTipo(undefined, property.tipologia)),
  );
  return estatico ? { detail: estatico, related: relacionadosAoImovel(estatico) } : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const produto = await produtoDaRota(slug);
  if (produto) {
    const title = `${produto.detail.nome} em ${produto.detail.bairro} | Rio Lançamentos`;
    return { title, description: `${produto.detail.tipologia}. ${produto.detail.descricao}` };
  }
  const nome = slug[0]?.split("-").map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1)).join(" ");
  return nome ? { title: `Imóveis em ${nome} | Rio Lançamentos` } : {};
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const produto = await produtoDaRota(slug);
  if (produto) {
    return <ImovelDetalhePage imovel={produto.detail} relacionados={produto.related} />;
  }

  if (slug.length !== 1) notFound();
  const segmento = slug[0];
  const properties = await getPublishedProperties();
  const detalhes = properties.map(toPropertyDetail);
  const tipologia = TIPOLOGIAS.has(segmento);
  const bairrosAdmin = await getAdminBairros();
  const bairroAdmin = bairrosAdmin.find((item) => item.status === "Publicado" && item.slug === segmento);
  const destinoEstatico = DESTINOS.find((item) => item.slug === segmento && item.tipo === "bairro");
  const nomeBairro = bairroAdmin?.nome ?? destinoEstatico?.nome ??
    properties.find((item) => slugificarImovel(item.bairro) === segmento)?.bairro;

  if (!tipologia && !nomeBairro) notFound();

  const nome = tipologia
    ? segmento.charAt(0).toUpperCase() + segmento.slice(1)
    : nomeBairro!;
  const filtrados = tipologia
    ? properties.filter((item) => item.segmento === "imovel" && slugDoTipo(item.tipoImovel, item.tipologia) === segmento).map(toPropertyDetail)
    : detalhes.filter((item) => slugificarImovel(item.bairro) === segmento);
  const destino: DestinoBairro = {
    slug: segmento,
    nome,
    tipo: "bairro",
    zona: bairroAdmin?.regiao === "Centro" ? "Centro" : bairroAdmin?.regiao === "Zona Oeste" ? "Barra e Recreio" : "Zona Sul",
    descricao: bairroAdmin?.textoCurto ?? `Imóveis selecionados em ${nome}.`,
    imagem: bairroAdmin?.imagem ?? destinoEstatico?.imagem ?? filtrados[0]?.imagem ?? "/img/cover.webp",
    quantidade: filtrados.length,
  };
  return (
    <BairroProdutos
      contexto={tipologia ? "tipologia" : "bairro"}
      destino={destino}
      imoveis={filtrados}
    />
  );
}
