import "server-only";

import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import Database from "better-sqlite3";
import { connection } from "next/server";
import { getAdminMasterName } from "@/lib/admin-auth";
import { slugificarImovel } from "@/lib/imoveis";
import { databaseFile, storageRoot } from "@/lib/storage-paths";

export type AdminImovelDraft = {
  id: string;
  slug: string;
  nome: string;
  bairro: string;
  tipologia: string;
  valor: string;
  categoria: "Lançamento" | "Alto padrão";
  segmento: "imovel" | "refugio";
  incorporadora: string;
  tipoImovel: string;
  quartos: string;
  garagem: string;
  banheiros: string;
  suites: string;
  metragem: string;
  terreno: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cidade: string;
  latitude: string;
  longitude: string;
  chamada: string;
  endereco: string;
  descricao: string;
  tabelaPreco: string;
  galeria: string[];
  plantas: string[];
  status: "Rascunho" | "Publicado" | "Agendado";
  author: string;
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
  sourceId?: string;
};

type AdminImovelInput = Omit<
  AdminImovelDraft,
  "id" | "status" | "author" | "createdAt" | "publishedAt" | "updatedAt" | "sourceId"
>;

type PropertyRow = {
  id: string;
  source_id: string | null;
  slug: string;
  nome: string;
  bairro: string;
  tipologia: string;
  valor: string;
  categoria: AdminImovelDraft["categoria"];
  segmento: AdminImovelDraft["segmento"];
  incorporadora: string;
  tipo_imovel: string;
  quartos: string;
  garagem: string;
  banheiros: string;
  suites: string;
  metragem: string;
  terreno: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cidade: string;
  latitude: string;
  longitude: string;
  chamada: string;
  endereco: string;
  descricao: string;
  tabela_preco: string;
  status: AdminImovelDraft["status"];
  author: string;
  created_at: string;
  published_at: string | null;
  updated_at: string;
};

declare global {
  var rioDatabase: Database.Database | undefined;
  var rioDatabaseSchemaVersion: number | undefined;
}

function openDatabase() {
  mkdirSync(storageRoot(), { recursive: true });
  const database = globalThis.rioDatabase ?? new Database(databaseFile());
  if (globalThis.rioDatabaseSchemaVersion === 2) return database;

  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  database.pragma("busy_timeout = 5000");
  database.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      source_id TEXT UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      nome TEXT NOT NULL,
      bairro TEXT NOT NULL,
      tipologia TEXT NOT NULL,
      valor TEXT NOT NULL,
      categoria TEXT NOT NULL CHECK (categoria IN ('Lançamento', 'Alto padrão')),
      segmento TEXT NOT NULL DEFAULT 'imovel' CHECK (segmento IN ('imovel', 'refugio')),
      incorporadora TEXT NOT NULL DEFAULT '',
      tipo_imovel TEXT NOT NULL DEFAULT '',
      quartos TEXT NOT NULL DEFAULT '',
      garagem TEXT NOT NULL DEFAULT '',
      banheiros TEXT NOT NULL DEFAULT '',
      suites TEXT NOT NULL DEFAULT '',
      metragem TEXT NOT NULL,
      terreno TEXT NOT NULL DEFAULT '',
      cep TEXT NOT NULL,
      logradouro TEXT NOT NULL,
      numero TEXT NOT NULL,
      complemento TEXT NOT NULL DEFAULT '',
      cidade TEXT NOT NULL,
      latitude TEXT NOT NULL DEFAULT '',
      longitude TEXT NOT NULL DEFAULT '',
      chamada TEXT NOT NULL,
      endereco TEXT NOT NULL,
      descricao TEXT NOT NULL,
      tabela_preco TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL CHECK (status IN ('Rascunho', 'Publicado', 'Agendado')),
      author TEXT NOT NULL,
      created_at TEXT NOT NULL,
      published_at TEXT,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS property_media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      kind TEXT NOT NULL CHECK (kind IN ('gallery', 'floor_plan')),
      path TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      UNIQUE(property_id, kind, sort_order)
    );

    CREATE INDEX IF NOT EXISTS properties_status_updated_idx
      ON properties(status, updated_at DESC);
    CREATE INDEX IF NOT EXISTS property_media_property_idx
      ON property_media(property_id, kind, sort_order);
  `);

  const columns = new Set(
    (database.prepare("PRAGMA table_info(properties)").all() as Array<{ name: string }>).map(
      (column) => column.name,
    ),
  );
  if (!columns.has("segmento")) {
    database.exec("ALTER TABLE properties ADD COLUMN segmento TEXT NOT NULL DEFAULT 'imovel'");
  }
  if (!columns.has("terreno")) {
    database.exec("ALTER TABLE properties ADD COLUMN terreno TEXT NOT NULL DEFAULT ''");
  }
  database.exec(`
    CREATE INDEX IF NOT EXISTS properties_segmento_status_updated_idx
      ON properties(segmento, status, updated_at DESC)
  `);

  globalThis.rioDatabase = database;
  globalThis.rioDatabaseSchemaVersion = 2;
  return database;
}

function mediaFor(database: Database.Database, propertyId: string, kind: "gallery" | "floor_plan") {
  return (database.prepare(
    "SELECT path FROM property_media WHERE property_id = ? AND kind = ? ORDER BY sort_order ASC",
  ).all(propertyId, kind) as Array<{ path: string }>).map((row) => row.path);
}

function toProperty(database: Database.Database, row: PropertyRow): AdminImovelDraft {
  return {
    id: row.id,
    sourceId: row.source_id || undefined,
    slug: row.slug,
    nome: row.nome,
    bairro: row.bairro,
    tipologia: row.tipologia,
    valor: row.valor,
    categoria: row.categoria,
    segmento: row.segmento,
    incorporadora: row.incorporadora,
    tipoImovel: row.tipo_imovel,
    quartos: row.quartos,
    garagem: row.garagem,
    banheiros: row.banheiros,
    suites: row.suites,
    metragem: row.metragem,
    terreno: row.terreno,
    cep: row.cep,
    logradouro: row.logradouro,
    numero: row.numero,
    complemento: row.complemento,
    cidade: row.cidade,
    latitude: row.latitude,
    longitude: row.longitude,
    chamada: row.chamada,
    endereco: row.endereco,
    descricao: row.descricao,
    tabelaPreco: row.tabela_preco,
    galeria: mediaFor(database, row.id, "gallery"),
    plantas: mediaFor(database, row.id, "floor_plan"),
    status: row.status,
    author: row.author,
    createdAt: row.created_at,
    publishedAt: row.published_at || undefined,
    updatedAt: row.updated_at,
  };
}

function uniqueSlug(database: Database.Database, value: string, excludedId?: string) {
  const base = slugificarImovel(value) || "imovel";
  let candidate = base;
  let suffix = 2;
  const exists = database.prepare(
    "SELECT id FROM properties WHERE slug = ? AND (? IS NULL OR id <> ?)",
  );
  while (exists.get(candidate, excludedId ?? null, excludedId ?? null)) {
    candidate = `${base}-${suffix++}`;
  }
  return candidate;
}

function propertyParameters(
  input: AdminImovelInput,
  metadata: {
    id: string;
    sourceId?: string;
    slug: string;
    status: AdminImovelDraft["status"];
    author: string;
    createdAt: string;
    publishedAt?: string;
    updatedAt: string;
  },
) {
  return {
    id: metadata.id,
    source_id: metadata.sourceId ?? null,
    slug: metadata.slug,
    nome: input.nome,
    bairro: input.bairro,
    tipologia: input.tipologia,
    valor: input.valor,
    categoria: input.categoria,
    segmento: input.segmento,
    incorporadora: input.incorporadora,
    tipo_imovel: input.tipoImovel,
    quartos: input.quartos,
    garagem: input.garagem,
    banheiros: input.banheiros,
    suites: input.suites,
    metragem: input.metragem,
    terreno: input.terreno,
    cep: input.cep,
    logradouro: input.logradouro,
    numero: input.numero,
    complemento: input.complemento,
    cidade: input.cidade,
    latitude: input.latitude,
    longitude: input.longitude,
    chamada: input.chamada,
    endereco: input.endereco,
    descricao: input.descricao,
    tabela_preco: input.tabelaPreco,
    status: metadata.status,
    author: metadata.author,
    created_at: metadata.createdAt,
    published_at: metadata.publishedAt ?? null,
    updated_at: metadata.updatedAt,
  };
}

const propertyColumns = `
  id, source_id, slug, nome, bairro, tipologia, valor, categoria, segmento,
  incorporadora, tipo_imovel, quartos, garagem, banheiros, suites,
  metragem, terreno, cep, logradouro, numero, complemento, cidade, latitude,
  longitude, chamada, endereco, descricao, tabela_preco, status,
  author, created_at, published_at, updated_at
`;

function replaceMedia(database: Database.Database, propertyId: string, gallery: string[], floorPlans: string[]) {
  database.prepare("DELETE FROM property_media WHERE property_id = ?").run(propertyId);
  const insert = database.prepare(
    "INSERT INTO property_media (property_id, kind, path, sort_order) VALUES (?, ?, ?, ?)",
  );
  gallery.forEach((mediaPath, index) => insert.run(propertyId, "gallery", mediaPath, index));
  floorPlans.forEach((mediaPath, index) => insert.run(propertyId, "floor_plan", mediaPath, index));
}

export async function getAdminImovelDrafts(): Promise<AdminImovelDraft[]> {
  await connection();
  const database = openDatabase();
  const rows = database.prepare("SELECT * FROM properties ORDER BY updated_at DESC").all() as PropertyRow[];
  return rows.map((row) => toProperty(database, row));
}

export async function getPublishedProperties(): Promise<AdminImovelDraft[]> {
  await connection();
  const database = openDatabase();
  const rows = database.prepare(
    "SELECT * FROM properties WHERE status = 'Publicado' ORDER BY published_at DESC, updated_at DESC",
  ).all() as PropertyRow[];
  return rows.map((row) => toProperty(database, row));
}

export async function getPublishedPropertyBySlug(slug: string): Promise<AdminImovelDraft | null> {
  await connection();
  const database = openDatabase();
  const row = database.prepare(
    "SELECT * FROM properties WHERE status = 'Publicado' AND slug = ? LIMIT 1",
  ).get(slug) as PropertyRow | undefined;
  return row ? toProperty(database, row) : null;
}

export async function addAdminImovelDraft(
  input: AdminImovelInput,
  status: AdminImovelDraft["status"] = "Rascunho",
) {
  const database = openDatabase();
  const now = new Date().toISOString();
  const id = randomUUID();
  const metadata = {
    id,
    slug: uniqueSlug(database, input.slug || input.nome),
    status,
    author: getAdminMasterName(),
    createdAt: now,
    publishedAt: status === "Publicado" ? now : undefined,
    updatedAt: now,
  };

  database.transaction(() => {
    database.prepare(`INSERT INTO properties (${propertyColumns}) VALUES (
      @id, @source_id, @slug, @nome, @bairro, @tipologia, @valor, @categoria, @segmento,
      @incorporadora, @tipo_imovel, @quartos, @garagem, @banheiros, @suites,
      @metragem, @terreno, @cep, @logradouro, @numero, @complemento, @cidade, @latitude,
      @longitude, @chamada, @endereco, @descricao, @tabela_preco, @status,
      @author, @created_at, @published_at, @updated_at
    )`).run(propertyParameters(input, metadata));
    replaceMedia(database, id, input.galeria, input.plantas);
  })();

  return toProperty(database, database.prepare("SELECT * FROM properties WHERE id = ?").get(id) as PropertyRow);
}

export async function saveAdminImovelDraft(
  referenceId: string,
  input: AdminImovelInput,
  status: AdminImovelDraft["status"] = "Rascunho",
) {
  const database = openDatabase();
  const current = database.prepare(
    "SELECT * FROM properties WHERE id = ? OR source_id = ? LIMIT 1",
  ).get(referenceId, referenceId) as PropertyRow | undefined;
  const now = new Date().toISOString();
  const id = current?.id ?? randomUUID();
  const metadata = {
    id,
    sourceId: current?.source_id ?? (current ? undefined : referenceId),
    slug: uniqueSlug(database, input.slug || input.nome, current?.id),
    status,
    author: current?.author || getAdminMasterName(),
    createdAt: current?.created_at || now,
    publishedAt: status === "Publicado" ? current?.published_at || now : current?.published_at || undefined,
    updatedAt: now,
  };
  const parameters = propertyParameters(input, metadata);

  database.transaction(() => {
    if (current) {
      database.prepare(`UPDATE properties SET
        source_id=@source_id, slug=@slug, nome=@nome, bairro=@bairro,
        tipologia=@tipologia, valor=@valor, categoria=@categoria, segmento=@segmento,
        incorporadora=@incorporadora, tipo_imovel=@tipo_imovel, quartos=@quartos,
        garagem=@garagem, banheiros=@banheiros, suites=@suites, metragem=@metragem,
        terreno=@terreno,
        cep=@cep, logradouro=@logradouro, numero=@numero, complemento=@complemento,
        cidade=@cidade, latitude=@latitude, longitude=@longitude, chamada=@chamada,
        endereco=@endereco, descricao=@descricao, tabela_preco=@tabela_preco,
        status=@status, author=@author, created_at=@created_at,
        published_at=@published_at, updated_at=@updated_at
        WHERE id=@id`).run(parameters);
    } else {
      database.prepare(`INSERT INTO properties (${propertyColumns}) VALUES (
        @id, @source_id, @slug, @nome, @bairro, @tipologia, @valor, @categoria, @segmento,
        @incorporadora, @tipo_imovel, @quartos, @garagem, @banheiros, @suites,
        @metragem, @terreno, @cep, @logradouro, @numero, @complemento, @cidade, @latitude,
        @longitude, @chamada, @endereco, @descricao, @tabela_preco, @status,
        @author, @created_at, @published_at, @updated_at
      )`).run(parameters);
    }
    replaceMedia(database, id, input.galeria, input.plantas);
  })();

  return toProperty(database, database.prepare("SELECT * FROM properties WHERE id = ?").get(id) as PropertyRow);
}

export async function removeAdminImovelDraft(id: string) {
  openDatabase().prepare("DELETE FROM properties WHERE id = ?").run(id);
}
