import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AdminAccess } from "@/lib/admin-access-store";

export const ADMIN_COOKIE = "rio_admin_session";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8;

export function getAdminMasterName() {
  return process.env.ADMIN_MASTER_NAME?.trim() || "Rafael";
}

type AdminSession = {
  id: string;
  name: string;
  email: string;
  role: "master" | "admin";
  expiresAt: number;
};

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET não foi configurado.");
  return secret;
}

function sign(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function createAdminSessionToken(access: Pick<AdminAccess, "id" | "name" | "email" | "role">) {
  const session: AdminSession = {
    ...access,
    expiresAt: Date.now() + ADMIN_SESSION_SECONDS * 1000,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token?: string): AdminSession | null {
  if (!token) return null;
  const [payload, providedSignature] = token.split(".");
  if (!payload || !providedSignature) return null;

  const expectedSignature = sign(payload);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as AdminSession;
    if (
      !["master", "admin"].includes(session.role) ||
      session.expiresAt <= Date.now()
    ) {
      return null;
    }
    return {
      ...session,
      name: session.name || getAdminMasterName(),
    };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/painel/login");
  return session;
}

export async function requireAdminMaster() {
  const session = await requireAdmin();
  if (session.role !== "master") redirect("/painel");
  return session;
}
