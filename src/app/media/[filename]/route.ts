import { readFile } from "node:fs/promises";
import path from "node:path";
import { mediaDirectory } from "@/lib/storage-paths";

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  if (!/^[a-f0-9-]+\.(?:avif|gif|jpg|png|webp)$/i.test(filename)) {
    return new Response("Arquivo inválido.", { status: 400 });
  }

  try {
    const file = await readFile(path.join(mediaDirectory(), filename));
    return new Response(file, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentTypes[path.extname(filename).toLowerCase()] || "application/octet-stream",
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return new Response("Mídia não encontrada.", { status: 404 });
    }
    throw error;
  }
}
