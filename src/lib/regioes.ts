export const REGIOES_DO_RIO = ["Zona Oeste", "Zona Sul", "Zona Norte", "Centro"] as const;

export type RegiaoDoRio = (typeof REGIOES_DO_RIO)[number];

const BAIRROS_DO_CENTRO = [
  "centro",
  "bairro de fátima",
  "catumbi",
  "cidade nova",
  "estácio",
  "gamboa",
  "glória",
  "lapa",
  "mangueira",
  "paquetá",
  "rio comprido",
  "santa teresa",
  "santo cristo",
  "saúde",
] as const;

export function bairroEhDoCentro(bairro: string) {
  const normalizado = bairro.trim().toLocaleLowerCase("pt-BR");
  return BAIRROS_DO_CENTRO.some(
    (nome) => normalizado === nome || normalizado.includes(`${nome},`),
  );
}
