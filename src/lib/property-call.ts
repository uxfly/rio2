export type PropertyCallFields = {
  tipoImovel?: string;
  metragem?: string;
  quartos?: string;
  bairro?: string;
};

function areaLabel(value: string) {
  const area = value.trim().replace(/\s*m²\s*$/i, "");
  return area ? `${area} m²` : "";
}

function roomsLabel(value: string) {
  if (!value) return "";
  if (value === "1") return "1 quarto";
  if (value === "5+") return "5 ou mais quartos";
  return `${value} quartos`;
}

export function gerarChamadaImovel({
  tipoImovel = "",
  metragem = "",
  quartos = "",
  bairro = "",
}: PropertyCallFields) {
  const tipo = tipoImovel.trim();
  const local = bairro.trim() || "Rio de Janeiro";
  if (!tipo) return `Lançamento em ${local}`;

  const area = areaLabel(metragem);
  if (!area) return `${tipo} em ${local}`;

  const quartosTexto = roomsLabel(quartos.trim());
  return quartosTexto
    ? `${tipo} de ${area} com ${quartosTexto} em ${local}`
    : `${tipo} de ${area} em ${local}`;
}
