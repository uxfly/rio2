import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const storageRoot = path.resolve(process.env.RIO_STORAGE_DIR?.trim() || ".data");
mkdirSync(storageRoot, { recursive: true });
const database = new Database(path.join(storageRoot, "rio.sqlite"));
database.pragma("journal_mode = WAL");
database.pragma("foreign_keys = ON");
database.pragma("busy_timeout = 5000");
database.exec(`
  CREATE TABLE IF NOT EXISTS neighborhoods (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    regiao TEXT NOT NULL CHECK (regiao IN ('Zona Oeste', 'Zona Sul', 'Zona Norte')),
    imagem TEXT NOT NULL,
    texto_curto TEXT NOT NULL,
    texto TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Rascunho', 'Publicado')),
    author TEXT NOT NULL,
    created_at TEXT NOT NULL,
    published_at TEXT,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS developers (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Rascunho', 'Publicado')),
    author TEXT NOT NULL,
    created_at TEXT NOT NULL,
    published_at TEXT,
    updated_at TEXT NOT NULL
  );
`);

function slugify(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function regionFor(neighborhood) {
  if (["Barra Olímpica", "Barra da Tijuca", "Recreio dos Bandeirantes"].includes(neighborhood)) {
    return "Zona Oeste";
  }
  if (["Tijuca", "Centro"].includes(neighborhood)) return "Zona Norte";
  return "Zona Sul";
}

const now = new Date().toISOString();
const neighborhoods = database.prepare(`
  SELECT p.bairro AS nome,
    (SELECT pm.path FROM property_media pm
      JOIN properties cover_property ON cover_property.id = pm.property_id
      WHERE cover_property.bairro = p.bairro AND pm.kind = 'gallery'
      ORDER BY cover_property.updated_at DESC, pm.sort_order ASC LIMIT 1) AS imagem
  FROM properties p
  WHERE p.bairro <> ''
  GROUP BY p.bairro
  ORDER BY p.bairro
`).all();
const developers = database.prepare(`
  SELECT incorporadora AS nome, MIN(nome) AS primeiro_produto
  FROM properties
  WHERE incorporadora <> '' AND incorporadora <> 'Não definida'
  GROUP BY incorporadora
  ORDER BY incorporadora
`).all();

const findNeighborhood = database.prepare("SELECT id FROM neighborhoods WHERE lower(nome) = lower(?) LIMIT 1");
const findNeighborhoodSlug = database.prepare("SELECT id FROM neighborhoods WHERE slug = ?");
const insertNeighborhood = database.prepare(`INSERT INTO neighborhoods (
  id, slug, nome, regiao, imagem, texto_curto, texto, status, author,
  created_at, published_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, 'Publicado', 'Rafael', ?, ?, ?)`);
const findDeveloper = database.prepare("SELECT id FROM developers WHERE lower(nome) = lower(?) LIMIT 1");
const findDeveloperSlug = database.prepare("SELECT id FROM developers WHERE slug = ?");
const insertDeveloper = database.prepare(`INSERT INTO developers (
  id, slug, nome, descricao, status, author, created_at, published_at, updated_at
) VALUES (?, ?, ?, ?, 'Publicado', 'Rafael', ?, ?, ?)`);

let neighborhoodsCreated = 0;
let developersCreated = 0;
database.transaction(() => {
  for (const neighborhood of neighborhoods) {
    if (findNeighborhood.get(neighborhood.nome)) continue;
    const baseSlug = slugify(neighborhood.nome) || "bairro";
    let slug = baseSlug;
    let suffix = 2;
    while (findNeighborhoodSlug.get(slug)) slug = `${baseSlug}-${suffix++}`;
    const shortText = `Conheça os imóveis e lançamentos selecionados em ${neighborhood.nome}, no Rio de Janeiro.`;
    const text = `<p>${neighborhood.nome} reúne endereços selecionados pela curadoria Rio Lançamentos. Explore os empreendimentos disponíveis, características da região e oportunidades para morar ou investir.</p>`;
    insertNeighborhood.run(randomUUID(), slug, neighborhood.nome, regionFor(neighborhood.nome), neighborhood.imagem || "/img/cover.webp", shortText, text, now, now, now);
    neighborhoodsCreated += 1;
  }

  for (const developer of developers) {
    if (findDeveloper.get(developer.nome)) continue;
    const baseSlug = slugify(developer.nome) || "incorporador";
    let slug = baseSlug;
    let suffix = 2;
    while (findDeveloperSlug.get(slug)) slug = `${baseSlug}-${suffix++}`;
    insertDeveloper.run(
      randomUUID(), slug, developer.nome,
      `${developer.nome} é responsável por empreendimentos presentes no catálogo da Rio Lançamentos.`,
      now, now, now,
    );
    developersCreated += 1;
  }
})();

console.log(JSON.stringify({
  neighborhoodsFound: neighborhoods.length,
  neighborhoodsCreated,
  developersFound: developers.length,
  developersCreated,
}, null, 2));
database.close();
