import { getPublishedProperties } from "@/lib/admin-imoveis-store";
import { IMOVEIS_DETALHES } from "@/lib/imoveis";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const properties = await getPublishedProperties();
  const property = properties.find(
    (item) => item.status === "Publicado" && item.slug === slug,
  );

  if (property) {
    return Response.json(
      {
        slug: property.slug,
        nome: property.nome,
        bairro: property.bairro,
        tipologia: property.tipologia,
        images: property.galeria.filter(Boolean).slice(0, 5),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const fallback = IMOVEIS_DETALHES.find((item) => item.slug === slug);
  if (!fallback) {
    return Response.json({ images: [] }, { status: 404 });
  }

  return Response.json(
    {
      slug: fallback.slug,
      nome: fallback.nome,
      bairro: fallback.bairro,
      tipologia: fallback.tipologia,
      images: fallback.galeria.filter(Boolean).slice(0, 5),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
