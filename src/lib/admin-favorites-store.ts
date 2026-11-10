import "server-only";

import { mkdirSync } from "node:fs";
import Database from "better-sqlite3";
import { connection } from "next/server";
import { databaseFile, storageRoot } from "@/lib/storage-paths";

declare global {
  var rioFavoritesDatabase: Database.Database | undefined;
  var rioFavoritesSchemaVersion: number | undefined;
}

function openDatabase() {
  mkdirSync(storageRoot(), { recursive: true });
  const database = globalThis.rioFavoritesDatabase ?? new Database(databaseFile());
  if (globalThis.rioFavoritesSchemaVersion === 2) return database;
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  database.pragma("busy_timeout = 5000");
  database.exec(`
    CREATE TABLE IF NOT EXISTS favorite_properties (
      position INTEGER PRIMARY KEY CHECK (position BETWEEN 1 AND 6),
      property_id TEXT NOT NULL UNIQUE REFERENCES properties(id) ON DELETE CASCADE
    );
  `);
  const table = database.prepare(
    "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'favorite_properties'",
  ).get() as { sql: string } | undefined;
  if (table?.sql.includes("BETWEEN 1 AND 5")) {
    database.transaction(() => {
      database.exec(`
        CREATE TABLE favorite_properties_v2 (
          position INTEGER PRIMARY KEY CHECK (position BETWEEN 1 AND 6),
          property_id TEXT NOT NULL UNIQUE REFERENCES properties(id) ON DELETE CASCADE
        );
        INSERT INTO favorite_properties_v2 (position, property_id)
          SELECT position, property_id FROM favorite_properties;
        DROP TABLE favorite_properties;
        ALTER TABLE favorite_properties_v2 RENAME TO favorite_properties;
      `);
    })();
  }
  globalThis.rioFavoritesDatabase = database;
  globalThis.rioFavoritesSchemaVersion = 2;
  return database;
}

export async function getFavoritePropertyIds(): Promise<string[]> {
  await connection();
  return (openDatabase().prepare(
    "SELECT property_id FROM favorite_properties ORDER BY position ASC",
  ).all() as Array<{ property_id: string }>).map((row) => row.property_id);
}

export async function saveFavoritePropertyIds(ids: string[]) {
  const database = openDatabase();
  const existing = database.prepare("SELECT id FROM properties WHERE id = ?");
  if (ids.length !== 6 || new Set(ids).size !== 6 || ids.some((id) => !existing.get(id))) {
    throw new Error("Seleção de favoritos inválida.");
  }
  const insert = database.prepare(
    "INSERT INTO favorite_properties (position, property_id) VALUES (?, ?)",
  );
  database.transaction(() => {
    database.prepare("DELETE FROM favorite_properties").run();
    ids.forEach((id, index) => insert.run(index + 1, id));
  })();
}
