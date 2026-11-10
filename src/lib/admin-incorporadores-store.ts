import "server-only";

import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import Database from "better-sqlite3";
import { connection } from "next/server";
import { getAdminMasterName } from "@/lib/admin-auth";
import { slugificarImovel } from "@/lib/imoveis";
import { databaseFile, storageRoot } from "@/lib/storage-paths";

export type AdminIncorporador = {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  status: "Rascunho" | "Publicado";
  author: string;
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
};

export type AdminIncorporadorInput = Pick<AdminIncorporador, "nome" | "descricao">;

type IncorporadorRow = {
  id: string; slug: string; nome: string; descricao: string;
  status: AdminIncorporador["status"]; author: string; created_at: string;
  published_at: string | null; updated_at: string;
};

declare global {
  var rioIncorporadoresDatabase: Database.Database | undefined;
  var rioIncorporadoresSchemaReady: boolean | undefined;
}

function openDatabase() {
  mkdirSync(storageRoot(), { recursive: true });
  const database = globalThis.rioIncorporadoresDatabase ?? new Database(databaseFile());
  if (globalThis.rioIncorporadoresSchemaReady) return database;
  database.pragma("journal_mode = WAL");
  database.pragma("busy_timeout = 5000");
  database.exec(`
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
    CREATE INDEX IF NOT EXISTS developers_status_updated_idx ON developers(status, updated_at DESC);
  `);
  globalThis.rioIncorporadoresDatabase = database;
  globalThis.rioIncorporadoresSchemaReady = true;
  return database;
}

function toIncorporador(row: IncorporadorRow): AdminIncorporador {
  return {
    id: row.id, slug: row.slug, nome: row.nome, descricao: row.descricao,
    status: row.status, author: row.author, createdAt: row.created_at,
    publishedAt: row.published_at || undefined, updatedAt: row.updated_at,
  };
}

function uniqueSlug(database: Database.Database, name: string, excludedId?: string) {
  const base = slugificarImovel(name) || "incorporador";
  const exists = database.prepare("SELECT id FROM developers WHERE slug = ? AND (? IS NULL OR id <> ?)");
  let slug = base;
  let suffix = 2;
  while (exists.get(slug, excludedId ?? null, excludedId ?? null)) slug = `${base}-${suffix++}`;
  return slug;
}

export async function getAdminIncorporadores(): Promise<AdminIncorporador[]> {
  await connection();
  return (openDatabase().prepare("SELECT * FROM developers ORDER BY nome ASC").all() as IncorporadorRow[]).map(toIncorporador);
}

export async function addAdminIncorporador(input: AdminIncorporadorInput, status: AdminIncorporador["status"]) {
  const database = openDatabase();
  const now = new Date().toISOString();
  const values = {
    id: randomUUID(), slug: uniqueSlug(database, input.nome), nome: input.nome,
    descricao: input.descricao, status, author: getAdminMasterName(), created_at: now,
    published_at: status === "Publicado" ? now : null, updated_at: now,
  };
  database.prepare(`INSERT INTO developers (
    id, slug, nome, descricao, status, author, created_at, published_at, updated_at
  ) VALUES (
    @id, @slug, @nome, @descricao, @status, @author, @created_at, @published_at, @updated_at
  )`).run(values);
  return toIncorporador(database.prepare("SELECT * FROM developers WHERE id = ?").get(values.id) as IncorporadorRow);
}

export async function saveAdminIncorporador(id: string, input: AdminIncorporadorInput, status: AdminIncorporador["status"]) {
  const database = openDatabase();
  const current = database.prepare("SELECT * FROM developers WHERE id = ?").get(id) as IncorporadorRow | undefined;
  if (!current) return null;
  const now = new Date().toISOString();
  database.prepare(`UPDATE developers SET
    slug=@slug, nome=@nome, descricao=@descricao, status=@status,
    published_at=@published_at, updated_at=@updated_at WHERE id=@id
  `).run({
    id, slug: uniqueSlug(database, input.nome, id), nome: input.nome,
    descricao: input.descricao, status,
    published_at: status === "Publicado" ? current.published_at || now : current.published_at,
    updated_at: now,
  });
  return toIncorporador(database.prepare("SELECT * FROM developers WHERE id = ?").get(id) as IncorporadorRow);
}
