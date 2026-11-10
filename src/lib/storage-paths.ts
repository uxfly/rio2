import "server-only";

import path from "node:path";

export function storageRoot() {
  const configured = process.env.RIO_STORAGE_DIR?.trim();
  return configured ? path.resolve(configured) : path.join(process.cwd(), ".data");
}

export function databaseFile() {
  return path.join(storageRoot(), "rio.sqlite");
}

export function mediaDirectory() {
  return path.join(storageRoot(), "media");
}
