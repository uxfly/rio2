import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const SOURCE = "https://haushome.co";
const LISTING_URL = `${SOURCE}/lancamentos/`;
const storageRoot = path.resolve(process.env.RIO_STORAGE_DIR?.trim() || ".data");
const envFile = (() => { try { return readFileSync(".env.local", "utf8"); } catch { return ""; } })();
const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY
  || envFile.match(/^NEXT_PUBLIC_MAPTILER_KEY=(.+)$/m)?.[1]?.trim()
  || "";
mkdirSync(storageRoot, { recursive: true });

function decodedRsc(html) {
  const parts = [];
  const pattern = /self\.__next_f\.push\(\[1,"((?:\\.|[^"\\])*)"\]\)<\/script>/g;
  let match;
  while ((match = pattern.exec(html))) {
    try { parts.push(JSON.parse(`"${match[1]}"`)); } catch { /* ignore unrelated chunks */ }
  }
  return parts.join("\n");
}

function jsonValueAfter(source, marker, opening, closing) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return null;
  const start = source.indexOf(opening, markerIndex + marker.length);
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === opening) depth += 1;
    else if (character === closing) {
      depth -= 1;
      if (depth === 0) return JSON.parse(source.slice(start, index + 1));
    }
  }
  return null;
}

async function fetchText(url, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, {
      headers: { "user-agent": "RioLancamentosCatalogImport/1.0 (+https://riolancamentos.com.br)" },
    });
    if (response.ok) return response.text();
    if (attempt === attempts) throw new Error(`${response.status} em ${url}`);
    await new Promise((resolve) => setTimeout(resolve, attempt * 500));
  }
}

function absoluteMedia(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${SOURCE}${url}`;
}

function choice(value) {
  if (!value) return "";
  if (String(value).includes("+")) return "5+";
  const number = Number.parseInt(String(value), 10);
  if (!Number.isFinite(number)) return "";
  return number >= 5 ? "5+" : String(Math.max(1, number));
}

function propertyType(title) {
  const normalized = title.toLocaleLowerCase("pt-BR");
  if (normalized.includes("studio")) return "Studio";
  if (normalized.includes("garden")) return "Garden";
  if (normalized.includes("casa")) return "Casa";
  return "Apartamento";
}

function formatPrice(price) {
  return typeof price === "number" && price >= 600000
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(price)
    : "Sob consulta";
}

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function renderLexicalNode(node) {
  if (!node) return "";
  if (node.type === "text") {
    let content = escapeHtml(node.text);
    if (node.format & 1) content = `<strong>${content}</strong>`;
    if (node.format & 2) content = `<em>${content}</em>`;
    if (node.format & 8) content = `<u>${content}</u>`;
    return content;
  }
  if (node.type === "linebreak") return "<br>";
  const children = (node.children || []).map(renderLexicalNode).join("");
  if (node.type === "root") return children;
  if (node.type === "paragraph") return `<p>${children}</p>`;
  if (node.type === "heading") return `<${node.tag || "h2"}>${children}</${node.tag || "h2"}>`;
  if (node.type === "quote") return `<blockquote>${children}</blockquote>`;
  if (node.type === "list") return `<${node.listType === "number" ? "ol" : "ul"}>${children}</${node.listType === "number" ? "ol" : "ul"}>`;
  if (node.type === "listitem") return `<li>${children}</li>`;
  if (node.type === "link" || node.type === "autolink") return `<a href="${escapeHtml(node.url || "#")}">${children}</a>`;
  return children;
}

function fullDescription(item) {
  const rendered = renderLexicalNode(item.textoPrincipal?.root);
  return rendered.replace(/<p>\s*<\/p>/g, "").trim() || generatedDescription(item);
}

function brlFromText(value) {
  const match = String(value || "").match(/R\$\s*([\d.]+(?:,\d{1,2})?)/i);
  return match ? Number(match[1].replaceAll(".", "").replace(",", ".")) || null : null;
}

function priceTable(tipologias = [], item) {
  const rows = (tipologias || []).map((entry) => {
    const embeddedPrice = brlFromText(entry.metragem);
    const rawArea = String(entry.metragem || "");
    const areaMatch = embeddedPrice ? null : rawArea.match(/^\s*([\d.]+(?:,\d+)?)\b/);
    const area = areaMatch ? `${areaMatch[1]} m²` : "Metragem sob consulta";
    const numericPrice = entry.precoDe >= 1000 ? entry.precoDe : embeddedPrice;
    const price = /vendido/i.test(rawArea)
      ? "Vendido"
      : numericPrice ? formatPrice(numericPrice) : "Sob consulta";
    return [entry.tipo || "Tipologia", area, price].join(" | ");
  });
  if (!rows.length && item) {
    rows.push([
      propertyType(item.titulo),
      item.metragem ? `${item.metragem} m²` : "Metragem sob consulta",
      formatPrice(item.valorImovel),
    ].join(" | "));
  }
  return rows.join("\n");
}

function resolvedStartingPrice(item) {
  if (typeof item.valorImovel === "number" && item.valorImovel >= 1000) return item.valorImovel;
  const prices = (item.tipologias || []).flatMap((entry) =>
    [entry.precoDe, brlFromText(entry.metragem)]
      .filter((value) => typeof value === "number" && value >= 1000),
  );
  return prices.length ? Math.min(...prices) : null;
}

function normalized(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

async function viaCepFor(item) {
  if (!item.logradouro || !item.cidade) return "";
  try {
    const cleanStreet = item.logradouro
      .replace(/\s*\([^)]*\)\s*/g, " ")
      .replace(/^Av\.\s*/i, "Avenida ")
      .trim();
    const url = `https://viacep.com.br/ws/RJ/${encodeURIComponent(item.cidade)}/${encodeURIComponent(cleanStreet)}/json/`;
    const response = await fetch(url);
    if (!response.ok) return "";
    const matches = await response.json();
    if (!Array.isArray(matches)) return "";
    const neighborhood = normalized(item.bairroNome || item.bairro);
    const best = matches.find((entry) => normalized(entry.bairro) === neighborhood) || matches[0];
    return best?.cep || "";
  } catch { return ""; }
}

async function geocodeAddress(item) {
  const query = [item.logradouro, item.numero, item.bairroNome || item.bairro, item.cidade || "Rio de Janeiro", "RJ", "Brasil"].filter(Boolean).join(", ");
  let longitude = "";
  let latitude = "";
  let fallbackLongitude = "";
  let fallbackLatitude = "";
  let cep = "";
  if (maptilerKey && query) {
    try {
      const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${encodeURIComponent(maptilerKey)}&country=br&language=pt&limit=1`;
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        const feature = result.features?.[0];
        fallbackLongitude = feature?.center?.[0] == null ? "" : String(feature.center[0]);
        fallbackLatitude = feature?.center?.[1] == null ? "" : String(feature.center[1]);
        const precise = ["address", "house", "building"].includes(feature?.properties?.kind);
        longitude = precise && feature?.center?.[0] != null ? String(feature.center[0]) : "";
        latitude = precise && feature?.center?.[1] != null ? String(feature.center[1]) : "";
        cep = feature?.context?.find((entry) => String(entry.id || "").startsWith("postal_code."))?.text || "";
      }
    } catch { /* retain source coordinates below */ }
  }
  if (!cep) cep = await viaCepFor(item);
  if (item.slug === "arte-wave") cep = "22775-040";
  return {
    cep,
    latitude: latitude || (item.latitude == null ? "" : String(item.latitude)) || fallbackLatitude,
    longitude: longitude || (item.longitude == null ? "" : String(item.longitude)) || fallbackLongitude,
  };
}

function generatedDescription(item) {
  const neighborhood = item.bairroNome || item.bairro || "Rio de Janeiro";
  const details = [
    item.quartos ? `${item.quartos} quarto${item.quartos === "1" ? "" : "s"}` : "",
    item.metragem ? `${item.metragem} m²` : "",
    item.vagas ? `${item.vagas} vaga${item.vagas === "1" ? "" : "s"}` : "",
  ].filter(Boolean).join(", ");
  const address = [item.logradouro, item.numero, neighborhood, item.cidade].filter(Boolean).join(", ");
  return [
    `<p>${item.titulo} é um lançamento localizado em ${neighborhood}, no Rio de Janeiro${details ? `, com opções de ${details}` : ""}.</p>`,
    address ? `<p>O empreendimento está situado em ${address}. Consulte disponibilidade, plantas e condições comerciais.</p>` : "",
  ].filter(Boolean).join("");
}

const listingHtml = await fetchText(LISTING_URL);
const listingRsc = decodedRsc(listingHtml);
const searchSources = jsonValueAfter(listingRsc, '"searchSources":', "[", "]");
const collectionScripts = [...listingHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map((match) => { try { return JSON.parse(match[1]); } catch { return null; } })
  .filter(Boolean);
const itemList = collectionScripts.find((item) => item?.mainEntity?.itemListElement)?.mainEntity?.itemListElement || [];
const urlBySlug = new Map(itemList.map((item) => [item.url.split("/").filter(Boolean).at(-1), item.url]));

if (!Array.isArray(searchSources) || searchSources.length !== 119) {
  throw new Error(`Catálogo inesperado: ${searchSources?.length ?? 0} itens encontrados.`);
}

const selected = searchSources.filter((item) =>
  item.valorImovel == null || item.valorImovel < 1000 || item.valorImovel >= 600000,
);
const excluded = searchSources.filter((item) =>
  typeof item.valorImovel === "number" && item.valorImovel >= 1000 && item.valorImovel < 600000,
);
console.log(`Catálogo: ${searchSources.length}; selecionados: ${selected.length}; excluídos: ${excluded.length}.`);

const detailed = [];
for (let offset = 0; offset < selected.length; offset += 5) {
  const batch = selected.slice(offset, offset + 5);
  const results = await Promise.all(batch.map(async (summary) => {
    const url = urlBySlug.get(summary.slug) || `${SOURCE}/lancamentos/${summary.bairro.toLocaleLowerCase("pt-BR").replaceAll(" ", "-")}/${summary.slug}/`;
    try {
      const html = await fetchText(url);
      const detail = jsonValueAfter(decodedRsc(html), '"lancamento":', "{", "}");
      const merged = { ...summary, ...detail, sourceUrl: url };
      return { ...merged, geocode: await geocodeAddress(merged) };
    } catch (error) {
      console.error(`Falha no detalhe de ${summary.slug}: ${error.message}`);
      const merged = { ...summary, bairroNome: summary.bairro, sourceUrl: url, photos: [], plantas: [] };
      return { ...merged, geocode: await geocodeAddress(merged) };
    }
  }));
  detailed.push(...results);
  console.log(`Detalhes: ${Math.min(offset + batch.length, selected.length)}/${selected.length}`);
}

const imported = detailed.filter((item) => {
  const resolved = resolvedStartingPrice(item);
  return resolved == null || resolved >= 600000;
});
const excludedAfterDetail = detailed.filter((item) => !imported.includes(item));
console.log(`Após revisar tabelas: ${imported.length} selecionados; ${excludedAfterDetail.length} exclusões adicionais.`);

const database = new Database(path.join(storageRoot, "rio.sqlite"));
database.pragma("journal_mode = WAL");
database.pragma("foreign_keys = ON");
database.pragma("busy_timeout = 5000");
database.exec(`
  CREATE TABLE IF NOT EXISTS developers (
    id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, nome TEXT NOT NULL,
    descricao TEXT NOT NULL, status TEXT NOT NULL, author TEXT NOT NULL,
    created_at TEXT NOT NULL, published_at TEXT, updated_at TEXT NOT NULL
  );
`);

const now = new Date().toISOString();
const existingBySource = database.prepare("SELECT * FROM properties WHERE source_id = ?");
const slugOwner = database.prepare("SELECT id FROM properties WHERE slug = ? AND id <> ?");
const insertProperty = database.prepare(`INSERT INTO properties (
  id, source_id, slug, nome, bairro, tipologia, valor, categoria, segmento,
  incorporadora, tipo_imovel, quartos, garagem, banheiros, suites, metragem,
  terreno, cep, logradouro, numero, complemento, cidade, latitude, longitude,
  chamada, endereco, descricao, tabela_preco, status, author, created_at,
  published_at, updated_at
) VALUES (
  @id, @source_id, @slug, @nome, @bairro, @tipologia, @valor, @categoria, @segmento,
  @incorporadora, @tipo_imovel, @quartos, @garagem, @banheiros, @suites, @metragem,
  @terreno, @cep, @logradouro, @numero, @complemento, @cidade, @latitude, @longitude,
  @chamada, @endereco, @descricao, @tabela_preco, @status, @author, @created_at,
  @published_at, @updated_at
)
`);
const updateProperty = database.prepare(`UPDATE properties SET
  slug=@slug, nome=@nome, bairro=@bairro, tipologia=@tipologia, valor=@valor,
  categoria=@categoria, segmento=@segmento, incorporadora=@incorporadora,
  tipo_imovel=@tipo_imovel, quartos=@quartos, garagem=@garagem,
  banheiros=@banheiros, suites=@suites, metragem=@metragem, terreno=@terreno,
  cep=@cep, logradouro=@logradouro, numero=@numero, complemento=@complemento,
  cidade=@cidade, latitude=@latitude, longitude=@longitude, chamada=@chamada,
  endereco=@endereco, descricao=@descricao, tabela_preco=@tabela_preco,
  status=@status, published_at=COALESCE(published_at, @published_at), updated_at=@updated_at
  WHERE id=@id
`);
const deleteMedia = database.prepare("DELETE FROM property_media WHERE property_id = ?");
const insertMedia = database.prepare("INSERT INTO property_media (property_id, kind, path, sort_order) VALUES (?, ?, ?, ?)");
const findDeveloper = database.prepare("SELECT id FROM developers WHERE slug = ?");
const insertDeveloper = database.prepare(`INSERT INTO developers (
  id, slug, nome, descricao, status, author, created_at, published_at, updated_at
) VALUES (?, ?, ?, ?, 'Publicado', 'Rafael', ?, ?, ?)`);

let created = 0;
let updated = 0;
database.transaction(() => {
  const importedSourceIds = new Set(imported.map((item) => `haushome:${item.id}`));
  const priorImports = database.prepare("SELECT id, source_id FROM properties WHERE source_id LIKE 'haushome:%'").all();
  const deleteProperty = database.prepare("DELETE FROM properties WHERE id = ?");
  for (const prior of priorImports) {
    if (!importedSourceIds.has(prior.source_id)) deleteProperty.run(prior.id);
  }

  for (const item of imported) {
    const sourceId = `haushome:${item.id}`;
    const existing = existingBySource.get(sourceId);
    const id = existing?.id || randomUUID();
    let slug = existing?.slug || item.slug;
    let suffix = 2;
    while (slugOwner.get(slug, id)) slug = `${item.slug}-${suffix++}`;
    const tipo = propertyType(item.titulo);
    const quartos = choice(item.quartos);
    const garagem = choice(item.vagas);
    const startingPrice = resolvedStartingPrice(item);
    const metragem = String(item.metragem || "");
    const incorporadora = item.incorporador?.nome || "Não definida";
    const tipologia = [tipo, quartos ? `${quartos} quarto${quartos === "1" ? "" : "s"}` : "", metragem ? `${metragem} m²` : ""].filter(Boolean).join(" · ");
    const endereco = [item.logradouro, item.numero, item.bairroNome || item.bairro, item.cidade].filter(Boolean).join(", ");
    const values = {
      id, source_id: sourceId, slug, nome: item.titulo,
      bairro: item.bairroNome || item.bairro || "Rio de Janeiro", tipologia,
      valor: formatPrice(startingPrice), categoria: startingPrice > 5_000_000 ? "Alto padrão" : "Lançamento", segmento: "imovel",
      incorporadora, tipo_imovel: tipo, quartos, garagem,
      banheiros: choice(item.banheiros), suites: "", metragem, terreno: "", cep: item.geocode?.cep || "",
      logradouro: item.logradouro || "", numero: item.numero || "", complemento: "",
      cidade: item.cidade || "Rio de Janeiro", latitude: item.geocode?.latitude || "",
      longitude: item.geocode?.longitude || "",
      chamada: `Lançamento em ${item.bairroNome || item.bairro}, Rio de Janeiro.`,
      endereco, descricao: fullDescription(item), tabela_preco: priceTable(item.tipologias, item),
      status: "Publicado", author: existing?.author || "Rafael",
      created_at: existing?.created_at || now, published_at: existing?.published_at || now,
      updated_at: now,
    };
    if (existing) { updateProperty.run(values); updated += 1; }
    else { insertProperty.run(values); created += 1; }
    deleteMedia.run(id);
    (item.photos || []).map((media) => absoluteMedia(media.url)).filter(Boolean).forEach((url, index) => insertMedia.run(id, "gallery", url, index));
    (item.plantas || []).map((media) => absoluteMedia(media.url)).filter(Boolean).forEach((url, index) => insertMedia.run(id, "floor_plan", url, index));

    if (item.incorporador?.nome && item.incorporador?.slug && !findDeveloper.get(item.incorporador.slug)) {
      insertDeveloper.run(randomUUID(), item.incorporador.slug, item.incorporador.nome, item.incorporador.descricao || `Incorporador responsável por ${item.titulo}.`, now, now, now);
    }
  }
})();

console.log(JSON.stringify({ imported: imported.length, created, updated, excluded: excluded.length + excludedAfterDetail.length }, null, 2));
database.close();
await import("./sync-property-taxonomies.mjs");
