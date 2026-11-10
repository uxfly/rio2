export type Lugar = { nome: string; meta: string };

// placeholder — será substituído pela busca de imóveis no Supabase
export const LUGARES: Lugar[] = [
  { nome: "Pão de Açúcar", meta: "Urca" },
  { nome: "Cristo Redentor", meta: "Corcovado" },
  { nome: "Praia de Copacabana", meta: "Copacabana" },
  { nome: "Praia do Arpoador", meta: "Ipanema" },
  { nome: "Parque Lage", meta: "Jardim Botânico" },
  { nome: "Escadaria Selarón", meta: "Lapa" },
  { nome: "Mirante Dona Marta", meta: "Santa Teresa" },
  { nome: "Jardim Botânico", meta: "Zona Sul" },
  { nome: "Feira de São Cristóvão", meta: "São Cristóvão" },
  { nome: "Ilha de Paquetá", meta: "Baía de Guanabara" },
];

export const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
