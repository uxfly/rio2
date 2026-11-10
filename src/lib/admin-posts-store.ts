import "server-only";

import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import Database from "better-sqlite3";
import { connection } from "next/server";
import { getAdminMasterName } from "@/lib/admin-auth";
import { slugificarImovel } from "@/lib/imoveis";
import { databaseFile, storageRoot } from "@/lib/storage-paths";

export type AdminPost = {
  id: string;
  slug: string;
  titulo: string;
  subtitulo: string;
  imagemCapa: string;
  texto: string;
  categoria: "Bairros" | "Arquitetura" | "Imóveis" | "Investimento";
  status: "Rascunho" | "Publicado";
  author: string;
  createdAt: string;
  publishedAt?: string;
  updatedAt: string;
};

export type AdminPostInput = Pick<
  AdminPost,
  "titulo" | "subtitulo" | "imagemCapa" | "texto" | "categoria"
>;

type PostRow = {
  id: string;
  slug: string;
  titulo: string;
  subtitulo: string;
  imagem_capa: string;
  texto: string;
  categoria: AdminPost["categoria"];
  status: AdminPost["status"];
  author: string;
  created_at: string;
  published_at: string | null;
  updated_at: string;
};

declare global {
  var rioPostsDatabase: Database.Database | undefined;
  var rioPostsSchemaReady: boolean | undefined;
}

function openDatabase() {
  mkdirSync(storageRoot(), { recursive: true });
  const database = globalThis.rioPostsDatabase ?? new Database(databaseFile());
  if (globalThis.rioPostsSchemaReady) return database;

  database.pragma("journal_mode = WAL");
  database.pragma("busy_timeout = 5000");
  database.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      titulo TEXT NOT NULL,
      subtitulo TEXT NOT NULL,
      imagem_capa TEXT NOT NULL DEFAULT '',
      texto TEXT NOT NULL,
      categoria TEXT NOT NULL CHECK (categoria IN ('Bairros', 'Arquitetura', 'Imóveis', 'Investimento')),
      status TEXT NOT NULL CHECK (status IN ('Rascunho', 'Publicado')),
      author TEXT NOT NULL,
      created_at TEXT NOT NULL,
      published_at TEXT,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS posts_status_updated_idx ON posts(status, updated_at DESC);
  `);
  globalThis.rioPostsDatabase = database;
  globalThis.rioPostsSchemaReady = true;
  return database;
}

function toPost(row: PostRow): AdminPost {
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    subtitulo: row.subtitulo,
    imagemCapa: row.imagem_capa,
    texto: row.texto,
    categoria: row.categoria,
    status: row.status,
    author: row.author,
    createdAt: row.created_at,
    publishedAt: row.published_at || undefined,
    updatedAt: row.updated_at,
  };
}

function uniqueSlug(database: Database.Database, title: string, excludedId?: string) {
  const base = slugificarImovel(title) || "post";
  const exists = database.prepare("SELECT id FROM posts WHERE slug = ? AND (? IS NULL OR id <> ?)");
  let slug = base;
  let suffix = 2;
  while (exists.get(slug, excludedId ?? null, excludedId ?? null)) slug = `${base}-${suffix++}`;
  return slug;
}

export async function getAdminPosts(): Promise<AdminPost[]> {
  await connection();
  return (openDatabase().prepare("SELECT * FROM posts ORDER BY updated_at DESC").all() as PostRow[]).map(toPost);
}

export async function addAdminPost(input: AdminPostInput, status: AdminPost["status"]) {
  const database = openDatabase();
  const now = new Date().toISOString();
  const values = {
    id: randomUUID(),
    slug: uniqueSlug(database, input.titulo),
    titulo: input.titulo,
    subtitulo: input.subtitulo,
    imagem_capa: input.imagemCapa,
    texto: input.texto,
    categoria: input.categoria,
    status,
    author: getAdminMasterName(),
    created_at: now,
    published_at: status === "Publicado" ? now : null,
    updated_at: now,
  };
  database.prepare(`INSERT INTO posts (
    id, slug, titulo, subtitulo, imagem_capa, texto, categoria, status,
    author, created_at, published_at, updated_at
  ) VALUES (
    @id, @slug, @titulo, @subtitulo, @imagem_capa, @texto, @categoria, @status,
    @author, @created_at, @published_at, @updated_at
  )`).run(values);
  return toPost(database.prepare("SELECT * FROM posts WHERE id = ?").get(values.id) as PostRow);
}

export async function saveAdminPost(id: string, input: AdminPostInput, status: AdminPost["status"]) {
  const database = openDatabase();
  const current = database.prepare("SELECT * FROM posts WHERE id = ?").get(id) as PostRow | undefined;
  if (!current) return null;
  const now = new Date().toISOString();
  database.prepare(`UPDATE posts SET
    slug=@slug, titulo=@titulo, subtitulo=@subtitulo, imagem_capa=@imagem_capa,
    texto=@texto, categoria=@categoria, status=@status, published_at=@published_at,
    updated_at=@updated_at
    WHERE id=@id
  `).run({
    id,
    slug: uniqueSlug(database, input.titulo, id),
    titulo: input.titulo,
    subtitulo: input.subtitulo,
    imagem_capa: input.imagemCapa,
    texto: input.texto,
    categoria: input.categoria,
    status,
    published_at: status === "Publicado" ? current.published_at || now : current.published_at,
    updated_at: now,
  });
  return toPost(database.prepare("SELECT * FROM posts WHERE id = ?").get(id) as PostRow);
}
