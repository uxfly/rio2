import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getAdminSession } from "@/lib/admin-auth";
import { mediaDirectory } from "@/lib/storage-paths";

export const runtime = "nodejs";

const extensions: Record<string, string> = {
  "image/avif": "avif",
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const maximumFileSize = 15 * 1024 * 1024;
const maximumFiles = 20;

export async function POST(request: Request) {
  if (!await getAdminSession()) {
    return Response.json({ error: "Sessão expirada. Entre novamente no painel." }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files").filter((item): item is File => item instanceof File);
  if (!files.length) return Response.json({ error: "Nenhuma imagem recebida." }, { status: 400 });
  if (files.length > maximumFiles) return Response.json({ error: `Envie no máximo ${maximumFiles} imagens por vez.` }, { status: 400 });

  for (const file of files) {
    if (!extensions[file.type]) return Response.json({ error: `Formato não permitido: ${file.name}` }, { status: 415 });
    if (file.size > maximumFileSize) return Response.json({ error: `${file.name} ultrapassa o limite de 15 MB.` }, { status: 413 });
  }

  const uploadDirectory = mediaDirectory();
  await mkdir(uploadDirectory, { recursive: true });

  const uploaded: string[] = [];
  for (const file of files) {
    const filename = `${randomUUID()}.${extensions[file.type]}`;
    await writeFile(path.join(uploadDirectory, filename), Buffer.from(await file.arrayBuffer()));
    uploaded.push(`/media/${filename}`);
  }

  return Response.json({ files: uploaded });
}
