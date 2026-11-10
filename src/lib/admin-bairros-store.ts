import "server-only";

import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import Database from "better-sqlite3";
import { connection } from "next/server";
import { getAdminMasterName } from "@/lib/admin-auth";
import { slugificarImovel } from "@/lib/imoveis";
import { databaseFile, storageRoot } from "@/lib/storage-paths";
import type { RegiaoDoRio } from "@/lib/regioes";

export type AdminBairro = {
  id: string;
  slug: string;
  nome: string;
  regiao: RegiaoDoRio;
  imagem: string;
  textoCurto: string;
  texto: string;
  status: "Rascunho" | "Publicado";
  author: string;
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
};

export type AdminBairroInput = Pick<AdminBairro, "slug" | "nome" | "regiao" | "imagem" | "textoCurto" | "texto">;

type BairroRow = {
  id: string;
  slug: string;
  nome: string;
  regiao: AdminBairro["regiao"];
  imagem: string;
  texto_curto: string;
  texto: string;
  status: AdminBairro["status"];
  author: string;
  created_at: string;
  published_at: string | null;
  updated_at: string;
};

declare global {
  var rioBairrosDatabase: Database.Database | undefined;
  var rioBairrosSchemaVersion: number | undefined;
}

function openDatabase() {
  mkdirSync(storageRoot(), { recursive: true });
  const database = globalThis.rioBairrosDatabase ?? new Database(databaseFile());
  if (globalThis.rioBairrosSchemaVersion === 2) return database;
  database.pragma("journal_mode = WAL");
  database.pragma("busy_timeout = 5000");
  database.exec(`
    CREATE TABLE IF NOT EXISTS neighborhoods (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      nome TEXT NOT NULL,
      regiao TEXT NOT NULL CHECK (regiao IN ('Zona Oeste', 'Zona Sul', 'Zona Norte', 'Centro')),
      imagem TEXT NOT NULL,
      texto_curto TEXT NOT NULL,
      texto TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('Rascunho', 'Publicado')),
      author TEXT NOT NULL,
      created_at TEXT NOT NULL,
      published_at TEXT,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS neighborhoods_status_updated_idx
      ON neighborhoods(status, updated_at DESC);
  `);
  const table = database.prepare(
    "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'neighborhoods'",
  ).get() as { sql: string } | undefined;
  if (table && !table.sql.includes("'Centro'")) {
    database.transaction(() => {
      database.exec(`
        CREATE TABLE neighborhoods_v2 (
          id TEXT PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          nome TEXT NOT NULL,
          regiao TEXT NOT NULL CHECK (regiao IN ('Zona Oeste', 'Zona Sul', 'Zona Norte', 'Centro')),
          imagem TEXT NOT NULL,
          texto_curto TEXT NOT NULL,
          texto TEXT NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('Rascunho', 'Publicado')),
          author TEXT NOT NULL,
          created_at TEXT NOT NULL,
          published_at TEXT,
          updated_at TEXT NOT NULL
        );
        INSERT INTO neighborhoods_v2
          SELECT * FROM neighborhoods;
        DROP TABLE neighborhoods;
        ALTER TABLE neighborhoods_v2 RENAME TO neighborhoods;
      `);
    })();
  }
  database.prepare("UPDATE neighborhoods SET regiao = 'Centro' WHERE lower(trim(nome)) = 'centro'").run();
  database.exec(`CREATE INDEX IF NOT EXISTS neighborhoods_status_updated_idx
    ON neighborhoods(status, updated_at DESC)`);
  globalThis.rioBairrosDatabase = database;
  globalThis.rioBairrosSchemaVersion = 2;
  return database;
}

function toBairro(row: BairroRow): AdminBairro {
  return {
    id: row.id,
    slug: row.slug,
    nome: row.nome,
    regiao: row.regiao,
    imagem: row.imagem,
    textoCurto: row.texto_curto,
    texto: row.texto,
    status: row.status,
    author: row.author,
    createdAt: row.created_at,
    publishedAt: row.published_at || undefined,
    updatedAt: row.updated_at,
  };
}

function uniqueSlug(database: Database.Database, value: string, excludedId?: string) {
  const base = slugificarImovel(value) || "bairro";
  const exists = database.prepare("SELECT id FROM neighborhoods WHERE slug = ? AND (? IS NULL OR id <> ?)");
  let slug = base;
  let suffix = 2;
  while (exists.get(slug, excludedId ?? null, excludedId ?? null)) slug = `${base}-${suffix++}`;
  return slug;
}

export async function getAdminBairros(): Promise<AdminBairro[]> {
  await connection();
  return (openDatabase().prepare("SELECT * FROM neighborhoods ORDER BY updated_at DESC").all() as BairroRow[]).map(toBairro);
}

export async function addAdminBairro(input: AdminBairroInput, status: AdminBairro["status"]) {
  const database = openDatabase();
  const now = new Date().toISOString();
  const values = {
    id: randomUUID(), slug: uniqueSlug(database, input.slug || input.nome), nome: input.nome,
    regiao: input.regiao, imagem: input.imagem, texto_curto: input.textoCurto,
    texto: input.texto, status, author: getAdminMasterName(), created_at: now,
    published_at: status === "Publicado" ? now : null, updated_at: now,
  };
  database.prepare(`INSERT INTO neighborhoods (
    id, slug, nome, regiao, imagem, texto_curto, texto, status, author,
    created_at, published_at, updated_at
  ) VALUES (
    @id, @slug, @nome, @regiao, @imagem, @texto_curto, @texto, @status, @author,
    @created_at, @published_at, @updated_at
  )`).run(values);
  return toBairro(database.prepare("SELECT * FROM neighborhoods WHERE id = ?").get(values.id) as BairroRow);
}

export async function saveAdminBairro(id: string, input: AdminBairroInput, status: AdminBairro["status"]) {
  const database = openDatabase();
  const current = database.prepare("SELECT * FROM neighborhoods WHERE id = ?").get(id) as BairroRow | undefined;
  if (!current) return null;
  const now = new Date().toISOString();
  database.prepare(`UPDATE neighborhoods SET
    slug=@slug, nome=@nome, regiao=@regiao, imagem=@imagem, texto_curto=@texto_curto,
    texto=@texto, status=@status, published_at=@published_at, updated_at=@updated_at
    WHERE id=@id
  `).run({
    id, slug: uniqueSlug(database, input.slug || input.nome, id), nome: input.nome,
    regiao: input.regiao, imagem: input.imagem, texto_curto: input.textoCurto,
    texto: input.texto, status,
    published_at: status === "Publicado" ? current.published_at || now : current.published_at,
    updated_at: now,
  });
  return toBairro(database.prepare("SELECT * FROM neighborhoods WHERE id = ?").get(id) as BairroRow);
}
