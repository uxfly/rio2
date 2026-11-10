import BarraDestaques, {
  ZonaSulDestaques,
} from "@/components/BarraDestaques";
import BairrosAtlas from "@/components/BairrosAtlas";
import BlogHome from "@/components/BlogHome";
import ColecoesBairros from "@/components/ColecoesBairros";
import ConstrutorasCarousel from "@/components/ConstrutorasCarousel";
import Destaques from "@/components/Destaques";
import Newsletter from "@/components/Newsletter";
import SobreCta from "@/components/SobreCta";
import TipologiasCuradoria from "@/components/TipologiasCuradoria";
import { getAdminBairros } from "@/lib/admin-bairros-store";
import { getAdminIncorporadores } from "@/lib/admin-incorporadores-store";
import { getPublishedProperties } from "@/lib/admin-imoveis-store";
import { slugificarImovel } from "@/lib/imoveis";
import { toCatalogProperty } from "@/lib/published-imoveis";
import { urlDoBairro } from "@/lib/site-urls";

export default async function Home() {
  const [bairrosAdmin, incorporadoresAdmin, properties] = await Promise.all([
    getAdminBairros(),
    getAdminIncorporadores(),
    getPublishedProperties(),
  ]);
  const bairrosDisponiveis = bairrosAdmin
    .filter((bairro) => bairro.status === "Publicado")
    .map((bairro) => {
      const imoveis = properties.filter(
        (property) => slugificarImovel(property.bairro) === slugificarImovel(bairro.nome),
      );
      const tipologias = [...new Set(imoveis.map((item) => item.tipoImovel).filter(Boolean))];
      return {
        nome: bairro.nome,
        regiao: bairro.regiao,
        descricao: bairro.textoCurto,
        tipologias: tipologias.length ? tipologias.slice(0, 3).join(" · ") : "Imóveis selecionados",
        quantidade: imoveis.length,
        imagem: bairro.imagem || imoveis[0]?.galeria[0] || "/img/cover.webp",
        alt: `Vista do bairro ${bairro.nome}, Rio de Janeiro`,
        href: urlDoBairro(bairro.slug),
      };
    });
  const ordemBairros = [
    { cadastro: "Barra da Tijuca", exibicao: "Barra da Tijuca" },
    { cadastro: "Recreio dos Bandeirantes", exibicao: "Recreio" },
    { cadastro: "Barra Olímpica", exibicao: "Barra Olímpica" },
    { cadastro: "Botafogo", exibicao: "Botafogo" },
    { cadastro: "Flamengo", exibicao: "Flamengo" },
    { cadastro: "Ipanema", exibicao: "Ipanema" },
    { cadastro: "Leblon", exibicao: "Leblon" },
  ] as const;
  const bairros = ordemBairros.flatMap(({ cadastro, exibicao }) => {
    const bairro = bairrosDisponiveis.find((item) => item.nome === cadastro);
    return bairro ? [{ ...bairro, nome: exibicao }] : [];
  });
  const incorporadores = incorporadoresAdmin
    .filter((incorporador) => incorporador.status === "Publicado")
    .map((incorporador, index) => {
      const imoveis = properties.filter(
        (property) => slugificarImovel(property.incorporadora) === slugificarImovel(incorporador.nome),
      );
      return {
        id: String(index + 1).padStart(2, "0"),
        nome: incorporador.nome,
        monograma: incorporador.nome.split(/\s+/).map((parte) => parte[0]).join("").slice(0, 3).toUpperCase(),
        especialidade: incorporador.descricao,
        quantidade: imoveis.length,
        imagem: imoveis.find((item) => item.galeria[0])?.galeria[0] || "/img/cover.webp",
        href: `/construtora/${incorporador.slug}`,
      };
    });
  const regiaoPorBairro = new Map(
    bairrosAdmin.map((bairro) => [slugificarImovel(bairro.nome), bairro.regiao]),
  );
  const imoveisPublicados = properties.filter(
    (property) => property.segmento === "imovel",
  );
  const bairrosDaBarraERecreio = [
    "barra",
    "recreio",
    "jardim-oceanico",
    "peninsula",
    "ilha-pura",
    "joa",
    "itanhanga",
  ];
  const produtosBarraERecreio = imoveisPublicados
    .filter((property) => {
      const bairro = slugificarImovel(property.bairro);
      return (
        regiaoPorBairro.get(bairro) === "Zona Oeste" &&
        bairrosDaBarraERecreio.some((termo) => bairro.includes(termo))
      );
    })
    .slice(0, 10)
    .map(toCatalogProperty);
  const produtosZonaSul = imoveisPublicados
    .filter((property) => {
      const tipo = slugificarImovel(property.tipoImovel);
      return (
        regiaoPorBairro.get(slugificarImovel(property.bairro)) === "Zona Sul" &&
        (tipo === "apartamento" || tipo === "casa")
      );
    })
    .slice(0, 10)
    .map(toCatalogProperty);

  return (
    <main className="home-content">
      <Destaques />
      <BarraDestaques produtos={produtosBarraERecreio} />
      <ZonaSulDestaques produtos={produtosZonaSul} />
      <ColecoesBairros />
      <BairrosAtlas items={bairros} />
      <TipologiasCuradoria />
      <SobreCta />
      <Newsletter />
      <ConstrutorasCarousel items={incorporadores} />
      <BlogHome />
    </main>
  );
}
