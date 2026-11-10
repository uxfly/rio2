import { IMOVEIS_BAIRROS } from "./bairros";
import { gerarChamadaImovel } from "./property-call";

export type PlantaImovel = {
  nome: string;
  resumo: string;
  imagem: string;
};

export type ImovelDetalhe = {
  id: string;
  slug: string;
  nome: string;
  bairro: string;
  tipologia: string;
  valor: string;
  categoria: "Lançamento" | "Alto padrão";
  segmento?: "refugio";
  incorporadora: string;
  imagem: string;
  alt: string;
  galeria: readonly string[];
  plantas: readonly PlantaImovel[];
  chamada: string;
  descricao: string;
  descricaoHtml?: string;
  endereco: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  cidade?: string;
  latitude?: number;
  longitude?: number;
  area: string;
  configuracao: string;
  vagas: string;
  entrega: string;
  diferenciais: readonly string[];
};

export function slugificarImovel(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const EXTRAS = [
  {
    id: "extra-01",
    nome: "Quinta das Amoras",
    bairro: "Vargem Grande",
    tipologia: "Casa com 5 suítes · 1.180 m²",
    valor: "R$ 12.800.000",
    categoria: "Alto padrão" as const,
    segmento: "refugio" as const,
    imagem: "/img/barra-itanhanga.webp",
    alt: "Casa contemporânea cercada por vegetação em Vargem Grande",
  },
  {
    id: "extra-02",
    nome: "Villa Leblon",
    bairro: "Leblon",
    tipologia: "Apartamento de 4 suítes · 312 m²",
    valor: "R$ 12.800.000",
    categoria: "Alto padrão" as const,
    imagem: "/img/destaque-leblon.webp",
    alt: "Apartamento de alto padrão com varanda no Leblon",
  },
  {
    id: "extra-03",
    nome: "Atlântica Garden",
    bairro: "Barra da Tijuca",
    tipologia: "Apartamentos de 3 e 4 suítes · 186 a 312 m²",
    valor: "R$ 4.850.000",
    categoria: "Lançamento" as const,
    imagem: "/img/barra-atlantica.webp",
    alt: "Condomínio contemporâneo na Barra da Tijuca",
  },
  {
    id: "extra-04",
    nome: "Jardim Oceânico 360",
    bairro: "Jardim Oceânico",
    tipologia: "Cobertura duplex · 4 suítes · 420 m²",
    valor: "R$ 8.900.000",
    categoria: "Alto padrão" as const,
    imagem: "/img/barra-jardim-oceanico.webp",
    alt: "Cobertura duplex com piscina no Jardim Oceânico",
  },
  {
    id: "extra-05",
    nome: "Península Vista Lagoa",
    bairro: "Península",
    tipologia: "Apartamento de 4 suítes · 298 m²",
    valor: "R$ 6.200.000",
    categoria: "Alto padrão" as const,
    imagem: "/img/barra-vista-lagoa.webp",
    alt: "Apartamento com varanda e vista para a lagoa",
  },
  {
    id: "extra-06",
    nome: "Casa Suspensa do Joá",
    bairro: "Joá",
    tipologia: "Casa com 4 suítes · 720 m²",
    valor: "R$ 24.500.000",
    categoria: "Alto padrão" as const,
    segmento: "refugio" as const,
    imagem: "/img/barra-vista-lagoa.webp",
    alt: "Residência elevada com vista para montanhas e mar no Joá",
  },
  {
    id: "extra-07",
    nome: "Reserva Itanhangá",
    bairro: "Itanhangá",
    tipologia: "Casa com 5 suítes · 860 m²",
    valor: "R$ 16.900.000",
    categoria: "Alto padrão" as const,
    segmento: "refugio" as const,
    imagem: "/img/barra-clube.webp",
    alt: "Casa de alto padrão integrada à mata no Itanhangá",
  },
  {
    id: "extra-08",
    nome: "Alto da Floresta",
    bairro: "Alto da Boa Vista",
    tipologia: "Casa com 6 suítes · 940 m²",
    valor: "R$ 14.600.000",
    categoria: "Alto padrão" as const,
    segmento: "refugio" as const,
    imagem: "/img/destaque-jardim-botanico.webp",
    alt: "Residência ampla em jardim arborizado no Alto da Boa Vista",
  },
  {
    id: "extra-09",
    nome: "Horizonte São Conrado",
    bairro: "São Conrado",
    tipologia: "Casa com 5 suítes · 810 m²",
    valor: "R$ 21.300.000",
    categoria: "Alto padrão" as const,
    segmento: "refugio" as const,
    imagem: "/img/barra-jardim-oceanico.webp",
    alt: "Casa panorâmica com piscina e vista preservada em São Conrado",
  },
  {
    id: "extra-10",
    nome: "Cobertura com vista para o mar em Ipanema",
    bairro: "Ipanema",
    tipologia: "Cobertura com 4 suítes · 412 m²",
    valor: "R$ 18.900.000",
    categoria: "Alto padrão" as const,
    imagem: "/img/destaque-ipanema.webp",
    alt: "Cobertura contemporânea em Ipanema com vista para o mar",
  },
  {
    id: "extra-11",
    nome: "Apartamento de alto padrão no Leblon",
    bairro: "Leblon",
    tipologia: "Apartamento com 3 suítes · 286 m²",
    valor: "R$ 11.600.000",
    categoria: "Alto padrão" as const,
    imagem: "/img/destaque-leblon.webp",
    alt: "Apartamento amplo com varanda no Leblon",
  },
  {
    id: "extra-12",
    nome: "Casa contemporânea no Jardim Botânico",
    bairro: "Jardim Botânico",
    tipologia: "Casa com 4 suítes · 538 m²",
    valor: "R$ 13.400.000",
    categoria: "Alto padrão" as const,
    imagem: "/img/destaque-jardim-botanico.webp",
    alt: "Casa contemporânea integrada ao jardim no Jardim Botânico",
  },
  {
    id: "extra-13",
    nome: "Lançamento residencial na Gávea",
    bairro: "Gávea",
    tipologia: "Apartamentos de 3 e 4 suítes · 185 a 312 m²",
    valor: "R$ 7.800.000",
    categoria: "Lançamento" as const,
    imagem: "/img/destaque-gavea.webp",
    alt: "Residencial contemporâneo com paisagismo na Gávea",
  },
  {
    id: "extra-14",
    nome: "Oro Ilha Pura",
    bairro: "Barra da Tijuca",
    tipologia: "Apartamentos de 3 e 4 suítes · 171 a 461 m²",
    valor: "R$ 4.200.000",
    categoria: "Lançamento" as const,
    imagem: "/img/colecao-ilha-pura.webp",
    alt: "Apartamento em bairro planejado na Barra da Tijuca",
  },
  {
    id: "extra-15",
    nome: "Astra",
    bairro: "Barra da Tijuca",
    tipologia: "Apartamentos de 2 quartos · 86 a 93 m²",
    valor: "R$ 1.980.000",
    categoria: "Lançamento" as const,
    imagem: "/img/colecao-ilha-pura.webp",
    alt: "Apartamento contemporâneo no Ilha Pura",
  },
] as const;

const IMAGENS_GALERIA = [
  "/img/destaque-ipanema.webp",
  "/img/destaque-leblon.webp",
  "/img/destaque-gavea.webp",
  "/img/barra-vista-lagoa.webp",
  "/img/destaque-jardim-botanico.webp",
  "/img/barra-jardim-oceanico.webp",
] as const;

function criarGaleria(principal: string) {
  return [
    principal,
    ...IMAGENS_GALERIA.filter((imagem) => imagem !== principal).slice(0, 4),
  ];
}

function areaDaTipologia(tipologia: string) {
  const areas = [...tipologia.matchAll(/(\d[\d.]*)\s*m²/g)];
  if (areas.length === 0) return "Sob consulta";
  if (areas.length === 1) return `${areas[0][1]} m²`;
  return `${areas[0][1]} a ${areas.at(-1)?.[1]} m²`;
}

function configuracaoDaTipologia(tipologia: string) {
  const suites = tipologia.match(/(\d+)(?:\s+e\s+\d+)?\s+suítes?/i);
  const quartos = tipologia.match(/(\d+)(?:\s+e\s+\d+)?\s+quartos?/i);
  if (suites) return `${suites[1]} suítes`;
  if (quartos) return `${quartos[1]} quartos`;
  return "Configuração flexível";
}

function criarPlantas(
  area: string,
  configuracao: string,
  segmento?: "refugio",
): PlantaImovel[] {
  if (segmento === "refugio") {
    return [
      {
        nome: "Implantação principal",
        resumo: `${area} · setores integrados`,
        imagem: "/img/planta-tipo.webp",
      },
      {
        nome: "Pavimento jardim",
        resumo: "Área social conectada à paisagem",
        imagem: "/img/planta-garden.webp",
      },
      {
        nome: "Área de lazer",
        resumo: "Terraço, convivência e piscina",
        imagem: "/img/planta-cobertura.webp",
      },
    ];
  }

  return [
    {
      nome: "Planta tipo",
      resumo: `${area} · ${configuracao}`,
      imagem: "/img/planta-tipo.webp",
    },
    {
      nome: "Opção garden",
      resumo: "Configuração com área externa privativa",
      imagem: "/img/planta-garden.webp",
    },
    {
      nome: "Cobertura",
      resumo: "Duplex com terraço e área de lazer",
      imagem: "/img/planta-cobertura.webp",
    },
  ];
}

const BASE = [...IMOVEIS_BAIRROS, ...EXTRAS];
const INCORPORADORAS = ["Opportunity", "Mozak", "SIG", "Balassiano"] as const;

export const IMOVEIS_DETALHES: readonly ImovelDetalhe[] = BASE.map(
  (produto, index) => {
    const segmento =
      "segmento" in produto ? produto.segmento : undefined;
    const selecao =
      segmento === "refugio"
        ? "Refúgio selecionado pela curadoria"
        : produto.categoria === "Lançamento"
          ? "Lançamento selecionado pela curadoria"
          : "Imóvel de alto padrão selecionado";

    const area = areaDaTipologia(produto.tipologia);
    const configuracao = configuracaoDaTipologia(produto.tipologia);
    const tipoImovel = produto.tipologia.match(
      /apartamento|casa|cobertura|garden|studio/i,
    )?.[0];
    const quartos = produto.tipologia.match(/(\d+)\s+quartos?/i)?.[1];

    return {
      ...produto,
      incorporadora:
        segmento === "refugio"
          ? "Autoria reservada"
          : INCORPORADORAS[index % INCORPORADORAS.length],
      slug: slugificarImovel(produto.nome),
      galeria: criarGaleria(produto.imagem),
      plantas: criarPlantas(area, configuracao, segmento),
      chamada: gerarChamadaImovel({
        tipoImovel: tipoImovel
          ? tipoImovel.charAt(0).toUpperCase() + tipoImovel.slice(1).toLowerCase()
          : "",
        metragem: area === "Sob consulta" ? "" : area,
        quartos,
        bairro: produto.bairro,
      }),
      descricao:
        produto.categoria === "Lançamento"
          ? `Um novo endereço em ${produto.bairro}, selecionado por arquitetura, localização e uma planta pensada para acompanhar diferentes momentos da vida.`
          : `Uma residência singular em ${produto.bairro}, onde privacidade, proporção e relação com a paisagem constroem uma experiência de morar mais exclusiva.`,
      endereco: `${produto.bairro}, Rio de Janeiro — RJ`,
      area,
      configuracao,
      vagas:
        index % 3 === 0 ? "3 vagas" : index % 2 === 0 ? "2 vagas" : "Até 4 vagas",
      entrega:
        produto.categoria === "Lançamento"
          ? "Previsão 2028"
          : "Pronto para morar",
      diferenciais: [
        selecao,
        "Informações organizadas pela curadoria",
        "Disponibilidade confirmada sob consulta",
        "Atendimento personalizado",
        "Documentação apresentada com transparência",
        "Visita acompanhada pela equipe Rio",
      ],
    };
  },
);

function nomeDoSlug(slug: string) {
  return slug
    .split("-")
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(" ");
}

export function encontrarImovel(slug: string): ImovelDetalhe {
  const encontrado = IMOVEIS_DETALHES.find((imovel) => imovel.slug === slug);
  if (encontrado) return encontrado;

  const nome = nomeDoSlug(slug);
  const imagem = "/img/alto-padrao.webp";
  return {
    id: `fallback-${slug}`,
    slug,
    nome,
    bairro: "Rio de Janeiro",
    tipologia: "Residência com configuração personalizada",
    valor: "Valor sob consulta",
    categoria: "Alto padrão",
    incorporadora: "Incorporadora sob consulta",
    imagem,
    alt: `${nome}, imóvel selecionado no Rio de Janeiro`,
    galeria: criarGaleria(imagem),
    plantas: criarPlantas("Sob consulta", "Configuração personalizada"),
    chamada: "Lançamento no Rio de Janeiro",
    descricao:
      "Um imóvel selecionado pela curadoria Rio, com informações detalhadas disponibilizadas de forma personalizada.",
    endereco: "Rio de Janeiro — RJ",
    area: "Sob consulta",
    configuracao: "Sob consulta",
    vagas: "Sob consulta",
    entrega: "Disponibilidade atual",
    diferenciais: [
      "Imóvel selecionado pela curadoria",
      "Informações organizadas pela curadoria",
      "Disponibilidade confirmada sob consulta",
      "Atendimento personalizado",
      "Documentação apresentada com transparência",
      "Visita acompanhada pela equipe Rio",
    ],
  };
}

export function relacionadosAoImovel(imovel: ImovelDetalhe) {
  const relacionados = IMOVEIS_DETALHES.filter(
    (item) =>
      item.slug !== imovel.slug &&
      (item.bairro === imovel.bairro || item.categoria === imovel.categoria),
  );
  const complemento = IMOVEIS_DETALHES.filter(
    (item) =>
      item.slug !== imovel.slug &&
      !relacionados.some((relacionado) => relacionado.slug === item.slug),
  );
  return [...relacionados, ...complemento].slice(0, 3);
}
