export type DestinoBairro = {
  slug: string;
  nome: string;
  tipo: "zona" | "bairro";
  zona: "Barra e Recreio" | "Zona Sul" | "Centro";
  descricao: string;
  imagem: string;
  quantidade: number;
};

export type ImovelBairro = {
  id: string;
  nome: string;
  bairro: string;
  bairroSlug: string;
  zonaSlug: "barra-e-recreio" | "zona-sul" | "centro";
  tipologia: string;
  valor: string;
  categoria: "Lançamento" | "Alto padrão";
  imagem: string;
  alt: string;
};

export const ZONAS: readonly DestinoBairro[] = [
  {
    slug: "barra-e-recreio",
    nome: "Barra e Recreio",
    tipo: "zona",
    zona: "Barra e Recreio",
    descricao:
      "Condomínios, casas e apartamentos entre praia, lagoas, natureza e uma rotina com mais espaço.",
    imagem: "/img/barra-vista-lagoa.webp",
    quantidade: 34,
  },
  {
    slug: "zona-sul",
    nome: "Zona Sul",
    tipo: "zona",
    zona: "Zona Sul",
    descricao:
      "Endereços conectados à paisagem, à arquitetura e à vida urbana mais desejada do Rio.",
    imagem: "/img/bairro-ipanema.webp",
    quantidade: 48,
  },
  {
    slug: "centro",
    nome: "Centro",
    tipo: "zona",
    zona: "Centro",
    descricao:
      "História, cultura, mobilidade e novos projetos no coração urbano do Rio.",
    imagem: "/img/bairro-centro.jpeg",
    quantidade: 2,
  },
] as const;

export const BAIRROS: readonly DestinoBairro[] = [
  {
    slug: "centro-rio",
    nome: "Centro",
    tipo: "bairro",
    zona: "Centro",
    descricao: "Patrimônio, cultura e uma nova geração de residenciais urbanos.",
    imagem: "/img/bairro-centro.jpeg",
    quantidade: 2,
  },
  {
    slug: "barra-da-tijuca",
    nome: "Barra da Tijuca",
    tipo: "bairro",
    zona: "Barra e Recreio",
    descricao: "Mar, condomínios completos e novos projetos.",
    imagem: "/img/barra-atlantica.webp",
    quantidade: 18,
  },
  {
    slug: "recreio",
    nome: "Recreio",
    tipo: "bairro",
    zona: "Barra e Recreio",
    descricao: "Praia, natureza e uma rotina com mais tranquilidade.",
    imagem: "/img/barra-orla.webp",
    quantidade: 9,
  },
  {
    slug: "jardim-oceanico",
    nome: "Jardim Oceânico",
    tipo: "bairro",
    zona: "Barra e Recreio",
    descricao: "Vida a pé, praia próxima e arquitetura contemporânea.",
    imagem: "/img/barra-jardim-oceanico.webp",
    quantidade: 7,
  },
  {
    slug: "ipanema",
    nome: "Ipanema",
    tipo: "bairro",
    zona: "Zona Sul",
    descricao: "Praia, desenho urbano e endereços icônicos.",
    imagem: "/img/bairro-ipanema.webp",
    quantidade: 12,
  },
  {
    slug: "leblon",
    nome: "Leblon",
    tipo: "bairro",
    zona: "Zona Sul",
    descricao: "Sofisticação discreta entre o mar e a montanha.",
    imagem: "/img/bairro-leblon.webp",
    quantidade: 10,
  },
  {
    slug: "copacabana",
    nome: "Copacabana",
    tipo: "bairro",
    zona: "Zona Sul",
    descricao: "Arquitetura histórica e uma vida urbana intensa.",
    imagem: "/img/colecao-be-in-rio.webp",
    quantidade: 8,
  },
  {
    slug: "botafogo",
    nome: "Botafogo",
    tipo: "bairro",
    zona: "Zona Sul",
    descricao: "Cultura, mobilidade e novas formas de morar.",
    imagem: "/img/bairro-botafogo.webp",
    quantidade: 9,
  },
  {
    slug: "gavea",
    nome: "Gávea",
    tipo: "bairro",
    zona: "Zona Sul",
    descricao: "Verde, cultura e ruas de atmosfera residencial.",
    imagem: "/img/destaque-gavea.webp",
    quantidade: 6,
  },
  {
    slug: "jardim-botanico",
    nome: "Jardim Botânico",
    tipo: "bairro",
    zona: "Zona Sul",
    descricao: "Casas, jardins e arquitetura integrada à natureza.",
    imagem: "/img/destaque-jardim-botanico.webp",
    quantidade: 7,
  },
  {
    slug: "lagoa",
    nome: "Lagoa",
    tipo: "bairro",
    zona: "Zona Sul",
    descricao: "Paisagem aberta e localização central.",
    imagem: "/img/colecao-soul-rio.webp",
    quantidade: 5,
  },
  {
    slug: "flamengo",
    nome: "Flamengo",
    tipo: "bairro",
    zona: "Zona Sul",
    descricao: "Parque, mobilidade e edifícios de identidade carioca.",
    imagem: "/img/cta-sobre-rio.webp",
    quantidade: 4,
  },
  {
    slug: "arpoador",
    nome: "Arpoador",
    tipo: "bairro",
    zona: "Zona Sul",
    descricao: "Um encontro raro entre cidade, pedra e mar.",
    imagem: "/img/destaque-ipanema.webp",
    quantidade: 4,
  },
  {
    slug: "vargem-grande",
    nome: "Vargem Grande",
    tipo: "bairro",
    zona: "Barra e Recreio",
    descricao:
      "Natureza, propriedades reservadas e uma rotina com mais espaço.",
    imagem: "/img/barra-itanhanga.webp",
    quantidade: 5,
  },
  {
    slug: "peninsula",
    nome: "Península",
    tipo: "bairro",
    zona: "Barra e Recreio",
    descricao:
      "Paisagem de lagoa, áreas verdes e condomínios completos na Barra.",
    imagem: "/img/barra-vista-lagoa.webp",
    quantidade: 6,
  },
  {
    slug: "joa",
    nome: "Joá",
    tipo: "bairro",
    zona: "Barra e Recreio",
    descricao:
      "Casas entre o mar e a montanha, com vistas e privacidade raras.",
    imagem: "/img/barra-vista-lagoa.webp",
    quantidade: 4,
  },
  {
    slug: "itanhanga",
    nome: "Itanhangá",
    tipo: "bairro",
    zona: "Barra e Recreio",
    descricao:
      "Condomínios reservados, mata e residências de arquitetura singular.",
    imagem: "/img/barra-clube.webp",
    quantidade: 7,
  },
  {
    slug: "alto-da-boa-vista",
    nome: "Alto da Boa Vista",
    tipo: "bairro",
    zona: "Zona Sul",
    descricao:
      "Clima de serra, jardins históricos e casas cercadas pela floresta.",
    imagem: "/img/destaque-jardim-botanico.webp",
    quantidade: 3,
  },
  {
    slug: "sao-conrado",
    nome: "São Conrado",
    tipo: "bairro",
    zona: "Zona Sul",
    descricao:
      "Praia, montanha e residências panorâmicas em uma paisagem aberta.",
    imagem: "/img/barra-jardim-oceanico.webp",
    quantidade: 6,
  },
] as const;

export const DESTINOS = [...ZONAS, ...BAIRROS] as const;

export const IMOVEIS_BAIRROS: readonly ImovelBairro[] = [
  {
    id: "bairro-01",
    nome: "Atlântica Barra",
    bairro: "Barra da Tijuca",
    bairroSlug: "barra-da-tijuca",
    zonaSlug: "barra-e-recreio",
    tipologia: "Apartamentos de 3 e 4 quartos · 126 a 218 m²",
    valor: "R$ 2.780.000",
    categoria: "Lançamento",
    imagem: "/img/barra-atlantica.webp",
    alt: "Empreendimento residencial próximo ao mar na Barra da Tijuca",
  },
  {
    id: "bairro-02",
    nome: "Pura Artefacto",
    bairro: "Barra da Tijuca",
    bairroSlug: "barra-da-tijuca",
    zonaSlug: "barra-e-recreio",
    tipologia: "Apartamentos de 3 e 4 suítes · 117 a 264 m²",
    valor: "R$ 3.150.000",
    categoria: "Lançamento",
    imagem: "/img/colecao-ilha-pura.webp",
    alt: "Condomínio de apartamentos na Barra da Tijuca",
  },
  {
    id: "bairro-03",
    nome: "Barra Golf Estate",
    bairro: "Barra da Tijuca",
    bairroSlug: "barra-da-tijuca",
    zonaSlug: "barra-e-recreio",
    tipologia: "Casa com 5 suítes · 690 m²",
    valor: "R$ 13.600.000",
    categoria: "Alto padrão",
    imagem: "/img/barra-clube.webp",
    alt: "Casa de alto padrão na Barra da Tijuca",
  },
  {
    id: "bairro-04",
    nome: "Recreio Orla",
    bairro: "Recreio",
    bairroSlug: "recreio",
    zonaSlug: "barra-e-recreio",
    tipologia: "Gardens e apartamentos · 98 a 204 m²",
    valor: "R$ 1.680.000",
    categoria: "Lançamento",
    imagem: "/img/barra-orla.webp",
    alt: "Lançamento residencial próximo à praia no Recreio",
  },
  {
    id: "bairro-05",
    nome: "Oceânico Signature",
    bairro: "Jardim Oceânico",
    bairroSlug: "jardim-oceanico",
    zonaSlug: "barra-e-recreio",
    tipologia: "Cobertura duplex · 430 m²",
    valor: "R$ 8.900.000",
    categoria: "Alto padrão",
    imagem: "/img/barra-jardim-oceanico.webp",
    alt: "Cobertura de alto padrão no Jardim Oceânico",
  },
  {
    id: "bairro-06",
    nome: "Parque Studios Ipanema",
    bairro: "Ipanema",
    bairroSlug: "ipanema",
    zonaSlug: "zona-sul",
    tipologia: "Studios e double studios · 38 a 89 m²",
    valor: "R$ 1.450.000",
    categoria: "Lançamento",
    imagem: "/img/destaque-ipanema.webp",
    alt: "Lançamento residencial em Ipanema",
  },
  {
    id: "bairro-07",
    nome: "Vieira Souto Penthouse",
    bairro: "Ipanema",
    bairroSlug: "ipanema",
    zonaSlug: "zona-sul",
    tipologia: "Cobertura duplex · 486 m²",
    valor: "R$ 18.500.000",
    categoria: "Alto padrão",
    imagem: "/img/bairro-ipanema.webp",
    alt: "Cobertura de alto padrão em Ipanema",
  },
  {
    id: "bairro-08",
    nome: "Essência Leblon",
    bairro: "Leblon",
    bairroSlug: "leblon",
    zonaSlug: "zona-sul",
    tipologia: "Apartamentos de 4 suítes · 185 a 312 m²",
    valor: "R$ 8.200.000",
    categoria: "Lançamento",
    imagem: "/img/destaque-leblon.webp",
    alt: "Apartamento amplo no Leblon",
  },
  {
    id: "bairro-09",
    nome: "Leblon Garden Residence",
    bairro: "Leblon",
    bairroSlug: "leblon",
    zonaSlug: "zona-sul",
    tipologia: "Garden de 3 suítes · 224 m²",
    valor: "R$ 6.400.000",
    categoria: "Alto padrão",
    imagem: "/img/bairro-leblon.webp",
    alt: "Apartamento garden de alto padrão no Leblon",
  },
  {
    id: "bairro-10",
    nome: "Be.in.Rio Copacabana",
    bairro: "Copacabana",
    bairroSlug: "copacabana",
    zonaSlug: "zona-sul",
    tipologia: "Studios, gardens e coberturas · 42 a 148 m²",
    valor: "R$ 1.780.000",
    categoria: "Lançamento",
    imagem: "/img/colecao-be-in-rio.webp",
    alt: "Edifício boutique em Copacabana",
  },
  {
    id: "bairro-11",
    nome: "Botafogo Vista 360",
    bairro: "Botafogo",
    bairroSlug: "botafogo",
    zonaSlug: "zona-sul",
    tipologia: "Apartamentos de 2 e 3 quartos · 78 a 156 m²",
    valor: "R$ 2.250.000",
    categoria: "Lançamento",
    imagem: "/img/bairro-botafogo.webp",
    alt: "Apartamento com vista para a Enseada de Botafogo",
  },
  {
    id: "bairro-12",
    nome: "Reserva Gávea",
    bairro: "Gávea",
    bairroSlug: "gavea",
    zonaSlug: "zona-sul",
    tipologia: "Apartamento de 4 suítes · 268 m²",
    valor: "R$ 9.800.000",
    categoria: "Alto padrão",
    imagem: "/img/destaque-gavea.webp",
    alt: "Apartamento sofisticado na Gávea",
  },
  {
    id: "bairro-13",
    nome: "Jardim Botânico Reserva",
    bairro: "Jardim Botânico",
    bairroSlug: "jardim-botanico",
    zonaSlug: "zona-sul",
    tipologia: "Gardens e apartamentos · 142 a 260 m²",
    valor: "R$ 4.650.000",
    categoria: "Lançamento",
    imagem: "/img/destaque-jardim-botanico.webp",
    alt: "Residência garden no Jardim Botânico",
  },
  {
    id: "bairro-14",
    nome: "Lagoa 360",
    bairro: "Lagoa",
    bairroSlug: "lagoa",
    zonaSlug: "zona-sul",
    tipologia: "Cobertura linear · 398 m²",
    valor: "R$ 11.700.000",
    categoria: "Alto padrão",
    imagem: "/img/colecao-soul-rio.webp",
    alt: "Cobertura com vista para a Lagoa",
  },
  {
    id: "bairro-15",
    nome: "Soul Rio Flamengo",
    bairro: "Flamengo",
    bairroSlug: "flamengo",
    zonaSlug: "zona-sul",
    tipologia: "Apartamentos de 2 e 3 quartos · 84 a 172 m²",
    valor: "R$ 2.980.000",
    categoria: "Lançamento",
    imagem: "/img/cta-sobre-rio.webp",
    alt: "Apartamento contemporâneo no Flamengo",
  },
  {
    id: "bairro-16",
    nome: "Arpoador One",
    bairro: "Arpoador",
    bairroSlug: "arpoador",
    zonaSlug: "zona-sul",
    tipologia: "Apartamento de 4 suítes · 335 m²",
    valor: "R$ 16.400.000",
    categoria: "Alto padrão",
    imagem: "/img/colecao-be-in-rio.webp",
    alt: "Residência boutique de alto padrão no Arpoador",
  },
] as const;

export function encontrarDestino(slug: string) {
  return DESTINOS.find((destino) => destino.slug === slug);
}

export function imoveisPorDestino(destino: DestinoBairro) {
  return IMOVEIS_BAIRROS.filter((imovel) =>
    destino.tipo === "zona"
      ? imovel.zonaSlug === destino.slug
      : imovel.bairroSlug === destino.slug,
  );
}
