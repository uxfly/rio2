import "server-only";

import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import Database from "better-sqlite3";
import { connection } from "next/server";
import { databaseFile, storageRoot } from "@/lib/storage-paths";

export type AdminAccess = {
  id: string;
  name: string;
  email: string;
  role: "master" | "admin";
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type AccessRow = {
  id: string; name: string; email: string; password_hash: string;
  role: AdminAccess["role"]; active: number; created_at: string; updated_at: string;
};

declare global {
  var rioAccessDatabase: Database.Database | undefined;
  var rioAccessSchemaReady: boolean | undefined;
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
}

function verifyHash(password: string, stored: string) {
  const [algorithm, salt, expectedHex] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;
  try {
    const expected = Buffer.from(expectedHex, "hex");
    const received = scryptSync(password, salt, expected.length);
    return expected.length === received.length && timingSafeEqual(expected, received);
  } catch { return false; }
}

function openDatabase() {
  mkdirSync(storageRoot(), { recursive: true });
  const database = globalThis.rioAccessDatabase ?? new Database(databaseFile());
  if (globalThis.rioAccessSchemaReady) return database;
  database.pragma("journal_mode = WAL");
  database.pragma("busy_timeout = 5000");
  database.exec(`CREATE TABLE IF NOT EXISTS admin_accesses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('master', 'admin')),
    active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`);
  const email = process.env.ADMIN_MASTER_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_MASTER_PASSWORD_HASH;
  if (email && passwordHash) {
    const now = new Date().toISOString();
    database.prepare(`INSERT OR IGNORE INTO admin_accesses
      (id, name, email, password_hash, role, active, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'master', 1, ?, ?)`)
      .run(randomUUID(), process.env.ADMIN_MASTER_NAME?.trim() || "Rafael", email, passwordHash, now, now);
  }
  globalThis.rioAccessDatabase = database;
  globalThis.rioAccessSchemaReady = true;
  return database;
}

function toAccess(row: AccessRow): AdminAccess {
  return { id: row.id, name: row.name, email: row.email, role: row.role, active: Boolean(row.active), createdAt: row.created_at, updatedAt: row.updated_at };
}

export async function getAdminAccesses() {
  await connection();
  return (openDatabase().prepare("SELECT * FROM admin_accesses ORDER BY role DESC, name ASC").all() as AccessRow[]).map(toAccess);
}

export function authenticateAdminAccess(email: string, password: string): AdminAccess | null {
  const row = openDatabase().prepare("SELECT * FROM admin_accesses WHERE email = ? AND active = 1").get(email.trim().toLowerCase()) as AccessRow | undefined;
  return row && verifyHash(password, row.password_hash) ? toAccess(row) : null;
}

export function findAdminAccessByEmail(email: string): AdminAccess | null {
  const row = openDatabase().prepare("SELECT * FROM admin_accesses WHERE email = ?").get(email.trim().toLowerCase()) as AccessRow | undefined;
  return row ? toAccess(row) : null;
}

export function addAdminAccess(input: { name: string; email: string; password: string; role: AdminAccess["role"]; active: boolean }) {
  const database = openDatabase(); const now = new Date().toISOString(); const id = randomUUID();
  database.prepare(`INSERT INTO admin_accesses (id,name,email,password_hash,role,active,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)`)
    .run(id, input.name, input.email.trim().toLowerCase(), hashPassword(input.password), input.role, input.active ? 1 : 0, now, now);
  return id;
}

export function updateAdminAccess(id: string, input: { name: string; email: string; password?: string; role: AdminAccess["role"]; active: boolean }) {
  const database = openDatabase();
  const current = database.prepare("SELECT * FROM admin_accesses WHERE id = ?").get(id) as AccessRow | undefined;
  if (!current) return false;
  if (current.role === "master" && (input.role !== "master" || !input.active)) {
    const masters = database.prepare("SELECT COUNT(*) total FROM admin_accesses WHERE role='master' AND active=1").get() as { total: number };
    if (masters.total <= 1) throw new Error("O painel precisa manter ao menos um Admin master ativo.");
  }
  const passwordHash = input.password ? hashPassword(input.password) : current.password_hash;
  database.prepare(`UPDATE admin_accesses SET name=?,email=?,password_hash=?,role=?,active=?,updated_at=? WHERE id=?`)
    .run(input.name, input.email.trim().toLowerCase(), passwordHash, input.role, input.active ? 1 : 0, new Date().toISOString(), id);
  return true;
}
