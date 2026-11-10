import "server-only";

import type { ImovelCatalogo } from "@/components/LancamentosCatalogo";
import type { RefugioCatalogo } from "@/components/RefugiosCatalogo";
import { getPublishedProperties } from "@/lib/admin-imoveis-store";
import type { AdminImovelDraft } from "@/lib/admin-imoveis-store";
import type { ImovelDetalhe } from "@/lib/imoveis";
import { bairroEhDoCentro } from "@/lib/regioes";

function plainText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const RICH_TEXT_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "blockquote",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "h4",
]);

function safeRichText(html: string) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|form)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (tag, name: string) => {
      const normalized = name.toLowerCase();
      if (!RICH_TEXT_TAGS.has(normalized)) return "";
      if (tag.startsWith("</")) return `</${normalized}>`;
      return normalized === "br" ? "<br>" : `<${normalized}>`;
    })
    .trim();
}

function numericPrice(value: string) {
  const digits = value.replace(/\D/g, "");
  return Number(digits) || 0;
}

function numericArea(value: string) {
  return Number.parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
}

function numericRooms(value: string) {
  return Number.parseInt(value, 10) || 0;
}

function coordinates(item: AdminImovelDraft): [number, number] | null {
  const latitude = Number.parseFloat(item.latitude);
  const longitude = Number.parseFloat(item.longitude);
  return Number.isFinite(latitude) && Number.isFinite(longitude)
    ? [longitude, latitude]
    : null;
}

function distanceInKm(
  origin: [number, number] | null,
  destination: [number, number] | null,
) {
  if (!origin || !destination) return Number.POSITIVE_INFINITY;
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const [originLongitude, originLatitude] = origin;
  const [destinationLongitude, destinationLatitude] = destination;
  const latitudeDelta = radians(destinationLatitude - originLatitude);
  const longitudeDelta = radians(destinationLongitude - originLongitude);
  const startLatitude = radians(originLatitude);
  const endLatitude = radians(destinationLatitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function relatedScore(target: AdminImovelDraft, candidate: AdminImovelDraft) {
  const distance = distanceInKm(coordinates(target), coordinates(candidate));
  const targetPrice = numericPrice(target.valor);
  const candidatePrice = numericPrice(candidate.valor);
  const targetArea = numericArea(target.metragem);
  const candidateArea = numericArea(candidate.metragem);
  const targetRooms = numericRooms(target.quartos);
  const candidateRooms = numericRooms(candidate.quartos);

  let score = Number.isFinite(distance)
    ? Math.min(distance, 40) * 2.2
    : target.bairro === candidate.bairro
      ? 8
      : 55;

  if (targetPrice && candidatePrice) {
    const priceRatio = candidatePrice / targetPrice;
    score += Math.abs(Math.log(priceRatio)) * 34;
    if (priceRatio < 0.55 || priceRatio > 1.8) score += 55;
  } else if (!targetPrice && !candidatePrice) {
    score -= 7;
  } else if (targetPrice && !candidatePrice) {
    score += 16;
  } else {
    score += 4;
  }

  if (targetArea && candidateArea) {
    const areaRatio = candidateArea / targetArea;
    score += Math.abs(Math.log(areaRatio)) * 22;
    if (areaRatio < 0.5 || areaRatio > 2) score += 35;
  }

  if (target.tipoImovel === candidate.tipoImovel) score -= 7;
  else score += 18;

  if (targetRooms && candidateRooms) {
    score += Math.abs(targetRooms - candidateRooms) * 4;
  }

  if (target.categoria === candidate.categoria) score -= 2;
  if (target.bairro === candidate.bairro) score -= 3;

  return { candidate, distance, score };
}

export function relatedPublishedProperties(
  target: AdminImovelDraft,
  properties: readonly AdminImovelDraft[],
  limit = 3,
) {
  const ranked = properties
    .filter(
      (candidate) =>
        candidate.id !== target.id && candidate.segmento === target.segmento,
    )
    .map((candidate) => relatedScore(target, candidate))
    .sort((a, b) => a.score - b.score);
  const nearby = ranked.filter(({ distance }) => distance <= 12);
  const farther = ranked.filter(({ distance }) => distance > 12);

  return [...nearby, ...farther].slice(0, limit).map(({ candidate }) => candidate);
}

function regionFor(neighborhood: string): ImovelCatalogo["regiao"] {
  const normalized = neighborhood.toLocaleLowerCase("pt-BR");
  if (bairroEhDoCentro(neighborhood)) return "Centro";
  if (["barra", "recreio", "jacarepaguá", "ilha pura"].some((term) => normalized.includes(term))) {
    return "Barra e Recreio";
  }
  if (["tijuca", "usina", "grajaú", "maracanã"].some((term) => normalized.includes(term))) {
    return "Grande Tijuca";
  }
  return "Zona Sul";
}

function typeFor(value: string): ImovelCatalogo["tipo"] {
  if (value === "Studio" || value === "Casa" || value === "Garden") return value;
  return "Apartamento";
}

export function toCatalogProperty(item: AdminImovelDraft): ImovelCatalogo {
  return {
    id: item.id,
    slug: item.slug,
    segmento: item.segmento,
    tipoImovel: item.tipoImovel,
    nome: item.nome,
    bairro: item.bairro,
    incorporadora: item.incorporadora,
    regiao: regionFor(item.bairro),
    tipo: typeFor(item.tipoImovel),
    quartos: Number.parseInt(item.quartos, 10) || 0,
    preco: numericPrice(item.valor),
    latitude: Number.parseFloat(item.latitude) || undefined,
    longitude: Number.parseFloat(item.longitude) || undefined,
    tipologia: item.tipologia,
    valor: item.valor,
    categoria: item.categoria,
    imagem: item.galeria[0] || "/img/cover.webp",
    alt: item.chamada || item.nome,
  };
}

export function toPropertyDetail(item: AdminImovelDraft): ImovelDetalhe {
  const cover = item.galeria[0] || "/img/cover.webp";
  return {
    id: item.id,
    slug: item.slug,
    nome: item.nome,
    bairro: item.bairro,
    tipologia: item.tipologia,
    valor: item.valor,
    categoria: item.categoria,
    segmento: item.segmento === "refugio" ? "refugio" : undefined,
    incorporadora: item.incorporadora,
    imagem: cover,
    alt: item.chamada || item.nome,
    galeria: item.galeria.length ? item.galeria : [cover],
    plantas: item.plantas.map((imagem, index) => ({
      nome: `Planta ${index + 1}`,
      resumo: item.tipologia,
      imagem,
    })),
    chamada: item.chamada,
    descricao: plainText(item.descricao),
    descricaoHtml: safeRichText(item.descricao),
    endereco: item.endereco,
    cep: item.cep,
    logradouro: item.logradouro,
    numero: item.numero,
    complemento: item.complemento,
    cidade: item.cidade,
    latitude: Number.parseFloat(item.latitude) || undefined,
    longitude: Number.parseFloat(item.longitude) || undefined,
    area: `${item.metragem} m²`,
    configuracao: [
      item.quartos ? `${item.quartos} quartos` : "",
      item.suites ? `${item.suites} suítes` : "",
      item.banheiros ? `${item.banheiros} banheiros` : "",
    ].filter(Boolean).join(" · ") || "Sob consulta",
    vagas: item.garagem ? `${item.garagem} vagas` : "Sob consulta",
    entrega: "Disponibilidade sob consulta",
    diferenciais: [],
  };
}

export async function getPublishedCatalog() {
  return (await getPublishedProperties())
    .filter((item) => item.segmento === "imovel")
    .map(toCatalogProperty);
}

export async function getPublishedDetails() {
  return (await getPublishedProperties()).map(toPropertyDetail);
}

export async function getPublishedRefuges(): Promise<RefugioCatalogo[]> {
  return (await getPublishedProperties())
    .filter((item) => item.segmento === "refugio")
    .map((item, index) => ({
      id: String(index + 1).padStart(2, "0"),
      slug: item.slug,
      nome: item.nome,
      local: item.bairro,
      assinatura: item.chamada || "Refúgio em destaque",
      descricao: plainText(item.descricao),
      tipologia: item.tipologia,
      area: `${item.metragem} m² privativos`,
      terreno: item.terreno ? `${item.terreno} m² de terreno` : "Sob consulta",
      valor: item.valor,
      imagem: item.galeria[0] || "/img/cover.webp",
      alt: item.chamada || item.nome,
    }));
}
