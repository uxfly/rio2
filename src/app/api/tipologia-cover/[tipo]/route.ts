import { getPublishedProperties } from "@/lib/admin-imoveis-store";
import { slugDoTipo } from "@/lib/site-urls";

const TIPOLOGIAS = new Set([
  "apartamento",
  "casa",
  "cobertura",
  "garden",
  "studio",
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tipo: string }> },
) {
  const { tipo } = await params;
  if (!TIPOLOGIAS.has(tipo)) {
    return Response.json({ images: [] }, { status: 404 });
  }

  const properties = await getPublishedProperties();
  const images = properties
    .filter(
      (property) =>
        property.segmento === "imovel" &&
        slugDoTipo(property.tipoImovel, property.tipologia) === tipo,
    )
    .map((property) => property.galeria[0])
    .filter((image): image is string => Boolean(image))
    .filter((image, index, all) => all.indexOf(image) === index)
    .slice(0, 3);

  return Response.json(
    { images },
    { headers: { "Cache-Control": "no-store" } },
  );
}
