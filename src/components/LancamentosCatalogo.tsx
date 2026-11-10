"use client";

import dynamic from "next/dynamic";
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ProdutoCard, { type Produto } from "./ProdutoCard";
import styles from "./LancamentosCatalogo.module.css";

const CatalogoMapa = dynamic(() => import("./CatalogoMapa"), {
  ssr: false,
  loading: () => (
    <div className={styles.mapComponentLoading} role="status">
      Carregando mapa
    </div>
  ),
});

type Regiao = "Todas" | "Zona Sul" | "Barra e Recreio" | "Grande Tijuca" | "Centro";
type Tipologia = "Apartamento" | "Studio" | "Cobertura" | "Casa" | "Garden";

export type ImovelCatalogo = Produto & {
  incorporadora?: string;
  regiao: Exclude<Regiao, "Todas">;
  tipo: Tipologia;
  quartos: number;
  preco: number;
  latitude?: number;
  longitude?: number;
};

type FiltroRapido =
  | { id: string; label: string; categoria: "regiao"; valor: ImovelCatalogo["regiao"] }
  | { id: string; label: string; categoria: "bairro"; valor: string }
  | { id: string; label: string; categoria: "faixa"; valor: string }
  | { id: string; label: string; categoria: "tipo"; valor: Tipologia };

type VarianteCatalogo = "lancamentos" | "alto-padrao";

const COORDENADAS_BAIRROS: Record<string, readonly [number, number]> = {
  Centro: [-43.1729, -22.9068],
  Glória: [-43.1753, -22.9216],
  Ipanema: [-43.2056, -22.9838],
  Leblon: [-43.2232, -22.9848],
  "Jardim Botânico": [-43.2244, -22.9665],
  Gávea: [-43.2312, -22.979],
  Botafogo: [-43.1823, -22.9519],
  Arpoador: [-43.191, -22.9871],
  "Barra da Tijuca": [-43.3659, -23.0004],
  "Jardim Oceânico": [-43.3105, -23.011],
  Recreio: [-43.458, -23.019],
  Tijuca: [-43.236, -22.924],
  Usina: [-43.254, -22.932],
  "São Conrado": [-43.267, -22.999],
  Joá: [-43.289, -23.014],
  Lagoa: [-43.211, -22.971],
  Itanhangá: [-43.303, -22.987],
};

function coordenadasDoImovel(
  imovel: ImovelCatalogo,
): [number, number] {
  if (Number.isFinite(imovel.latitude) && Number.isFinite(imovel.longitude)) {
    return [imovel.longitude!, imovel.latitude!];
  }
  const base = COORDENADAS_BAIRROS[imovel.bairro] ?? [-43.255, -22.965];
  const seed = Array.from(imovel.id).reduce(
    (total, caractere) => total + caractere.charCodeAt(0),
    0,
  );
  const angulo = ((seed * 47) % 360) * (Math.PI / 180);
  const distancia = 0.0012 + (seed % 5) * 0.00032;

  return [
    base[0] + Math.cos(angulo) * distancia,
    base[1] + Math.sin(angulo) * distancia * 0.76,
  ];
}

const LANCAMENTOS: readonly ImovelCatalogo[] = [
  {
    id: "01",
    nome: "Parque Studios Ipanema",
    bairro: "Ipanema",
    regiao: "Zona Sul",
    tipo: "Studio",
    quartos: 1,
    tipologia: "Studios e double studios · 38 a 89 m²",
    preco: 1450000,
    valor: "R$ 1.450.000",
    categoria: "Lançamento",
    imagem: "/img/destaque-ipanema.webp",
    alt: "Fachada contemporânea de lançamento residencial em Ipanema",
  },
  {
    id: "02",
    nome: "Essência Leblon",
    bairro: "Leblon",
    regiao: "Zona Sul",
    tipo: "Apartamento",
    quartos: 4,
    tipologia: "Apartamentos de 4 suítes · 185 a 312 m²",
    preco: 8200000,
    valor: "R$ 8.200.000",
    categoria: "Lançamento",
    imagem: "/img/destaque-leblon.webp",
    alt: "Apartamento amplo com varanda e vista para o verde no Leblon",
  },
  {
    id: "03",
    nome: "Jardim Botânico Reserva",
    bairro: "Jardim Botânico",
    regiao: "Zona Sul",
    tipo: "Garden",
    quartos: 3,
    tipologia: "Gardens e apartamentos · 142 a 260 m²",
    preco: 4650000,
    valor: "R$ 4.650.000",
    categoria: "Lançamento",
    imagem: "/img/destaque-jardim-botanico.webp",
    alt: "Residência garden integrada à vegetação do Jardim Botânico",
  },
  {
    id: "04",
    nome: "Gávea Contemporânea",
    bairro: "Gávea",
    regiao: "Zona Sul",
    tipo: "Cobertura",
    quartos: 4,
    tipologia: "Coberturas e apartamentos · 178 a 390 m²",
    preco: 6900000,
    valor: "R$ 6.900.000",
    categoria: "Lançamento",
    imagem: "/img/destaque-gavea.webp",
    alt: "Cobertura contemporânea cercada pelo verde da Gávea",
  },
  {
    id: "05",
    nome: "Botafogo Vista 360",
    bairro: "Botafogo",
    regiao: "Zona Sul",
    tipo: "Apartamento",
    quartos: 2,
    tipologia: "Apartamentos de 2 e 3 quartos · 78 a 156 m²",
    preco: 2250000,
    valor: "R$ 2.250.000",
    categoria: "Lançamento",
    imagem: "/img/bairro-botafogo.webp",
    alt: "Vista da Enseada de Botafogo próxima a novo empreendimento",
  },
  {
    id: "06",
    nome: "Be.in.Rio Arpoador",
    bairro: "Arpoador",
    regiao: "Zona Sul",
    tipo: "Studio",
    quartos: 1,
    tipologia: "Studios, gardens e coberturas · 42 a 148 m²",
    preco: 1780000,
    valor: "R$ 1.780.000",
    categoria: "Lançamento",
    imagem: "/img/colecao-be-in-rio.webp",
    alt: "Edifício boutique em rua arborizada próxima ao Arpoador",
  },
  {
    id: "07",
    nome: "Pura Artefacto",
    bairro: "Barra da Tijuca",
    regiao: "Barra e Recreio",
    tipo: "Apartamento",
    quartos: 4,
    tipologia: "Apartamentos de 3 e 4 suítes · 117 a 264 m²",
    preco: 3150000,
    valor: "R$ 3.150.000",
    categoria: "Lançamento",
    imagem: "/img/colecao-ilha-pura.webp",
    alt: "Condomínio residencial em bairro planejado na Barra da Tijuca",
  },
  {
    id: "08",
    nome: "Jardim Oceânico 360",
    bairro: "Jardim Oceânico",
    regiao: "Barra e Recreio",
    tipo: "Cobertura",
    quartos: 4,
    tipologia: "Coberturas lineares · 280 a 420 m²",
    preco: 5950000,
    valor: "R$ 5.950.000",
    categoria: "Lançamento",
    imagem: "/img/barra-jardim-oceanico.webp",
    alt: "Cobertura contemporânea próxima à praia no Jardim Oceânico",
  },
  {
    id: "09",
    nome: "Atlântica Barra",
    bairro: "Barra da Tijuca",
    regiao: "Barra e Recreio",
    tipo: "Apartamento",
    quartos: 3,
    tipologia: "Apartamentos de 3 e 4 quartos · 126 a 218 m²",
    preco: 2780000,
    valor: "R$ 2.780.000",
    categoria: "Lançamento",
    imagem: "/img/barra-atlantica.webp",
    alt: "Empreendimento residencial de frente para o mar na Barra",
  },
  {
    id: "10",
    nome: "Recreio Orla",
    bairro: "Recreio",
    regiao: "Barra e Recreio",
    tipo: "Garden",
    quartos: 3,
    tipologia: "Gardens e apartamentos · 98 a 204 m²",
    preco: 1680000,
    valor: "R$ 1.680.000",
    categoria: "Lançamento",
    imagem: "/img/barra-orla.webp",
    alt: "Lançamento residencial próximo à orla do Recreio",
  },
  {
    id: "11",
    nome: "Tijuca Parque",
    bairro: "Tijuca",
    regiao: "Grande Tijuca",
    tipo: "Apartamento",
    quartos: 3,
    tipologia: "Apartamentos de 2 e 3 quartos · 74 a 138 m²",
    preco: 1190000,
    valor: "R$ 1.190.000",
    categoria: "Lançamento",
    imagem: "/img/barra-clube.webp",
    alt: "Condomínio residencial com paisagismo e lazer completo",
  },
  {
    id: "12",
    nome: "Alto Usina",
    bairro: "Usina",
    regiao: "Grande Tijuca",
    tipo: "Casa",
    quartos: 4,
    tipologia: "Casas de 4 quartos · 290 a 480 m²",
    preco: 3400000,
    valor: "R$ 3.400.000",
    categoria: "Lançamento",
    imagem: "/img/barra-itanhanga.webp",
    alt: "Casa contemporânea integrada à mata e com piscina",
  },
] as const;

const IMOVEIS_ALTO_PADRAO: readonly ImovelCatalogo[] = [
  {
    id: "ap-01",
    nome: "Villa Leblon",
    bairro: "Leblon",
    regiao: "Zona Sul",
    tipo: "Apartamento",
    quartos: 4,
    tipologia: "Apartamento de 4 suítes · 312 m²",
    preco: 12800000,
    valor: "R$ 12.800.000",
    categoria: "Alto padrão",
    imagem: "/img/destaque-leblon.webp",
    alt: "Apartamento de alto padrão com varanda no Leblon",
  },
  {
    id: "ap-02",
    nome: "Vieira Souto Penthouse",
    bairro: "Ipanema",
    regiao: "Zona Sul",
    tipo: "Cobertura",
    quartos: 4,
    tipologia: "Cobertura duplex · 486 m²",
    preco: 18500000,
    valor: "R$ 18.500.000",
    categoria: "Alto padrão",
    imagem: "/img/destaque-ipanema.webp",
    alt: "Cobertura exclusiva próxima à praia de Ipanema",
  },
  {
    id: "ap-03",
    nome: "Reserva Gávea",
    bairro: "Gávea",
    regiao: "Zona Sul",
    tipo: "Apartamento",
    quartos: 4,
    tipologia: "Apartamento de 4 suítes · 268 m²",
    preco: 9800000,
    valor: "R$ 9.800.000",
    categoria: "Alto padrão",
    imagem: "/img/destaque-gavea.webp",
    alt: "Apartamento sofisticado cercado pelo verde da Gávea",
  },
  {
    id: "ap-04",
    nome: "Casa Jardim Imperial",
    bairro: "Jardim Botânico",
    regiao: "Zona Sul",
    tipo: "Casa",
    quartos: 4,
    tipologia: "Casa com 4 suítes e jardim · 540 m²",
    preco: 14200000,
    valor: "R$ 14.200.000",
    categoria: "Alto padrão",
    imagem: "/img/destaque-jardim-botanico.webp",
    alt: "Casa de alto padrão integrada à natureza no Jardim Botânico",
  },
  {
    id: "ap-05",
    nome: "Cliff São Conrado",
    bairro: "São Conrado",
    regiao: "Zona Sul",
    tipo: "Cobertura",
    quartos: 5,
    tipologia: "Cobertura panorâmica · 620 m²",
    preco: 21000000,
    valor: "R$ 21.000.000",
    categoria: "Alto padrão",
    imagem: "/img/barra-vista-lagoa.webp",
    alt: "Cobertura panorâmica entre o mar e a montanha em São Conrado",
  },
  {
    id: "ap-06",
    nome: "Joá Private House",
    bairro: "Joá",
    regiao: "Zona Sul",
    tipo: "Casa",
    quartos: 5,
    tipologia: "Casa suspensa com 5 suítes · 780 m²",
    preco: 28000000,
    valor: "R$ 28.000.000",
    categoria: "Alto padrão",
    imagem: "/img/barra-itanhanga.webp",
    alt: "Casa contemporânea com vista para o mar no Joá",
  },
  {
    id: "ap-07",
    nome: "Arpoador One",
    bairro: "Arpoador",
    regiao: "Zona Sul",
    tipo: "Apartamento",
    quartos: 4,
    tipologia: "Apartamento de 4 suítes · 335 m²",
    preco: 16400000,
    valor: "R$ 16.400.000",
    categoria: "Alto padrão",
    imagem: "/img/colecao-be-in-rio.webp",
    alt: "Residência boutique de alto padrão no Arpoador",
  },
  {
    id: "ap-08",
    nome: "Lagoa 360",
    bairro: "Lagoa",
    regiao: "Zona Sul",
    tipo: "Cobertura",
    quartos: 4,
    tipologia: "Cobertura linear · 398 m²",
    preco: 11700000,
    valor: "R$ 11.700.000",
    categoria: "Alto padrão",
    imagem: "/img/colecao-soul-rio.webp",
    alt: "Cobertura de alto padrão com vista para a Lagoa",
  },
  {
    id: "ap-09",
    nome: "Itanhangá Reserve",
    bairro: "Itanhangá",
    regiao: "Barra e Recreio",
    tipo: "Casa",
    quartos: 4,
    tipologia: "Casa em condomínio · 510 m²",
    preco: 7500000,
    valor: "R$ 7.500.000",
    categoria: "Alto padrão",
    imagem: "/img/barra-clube.webp",
    alt: "Casa de alto padrão em condomínio no Itanhangá",
  },
  {
    id: "ap-10",
    nome: "Oceânico Signature",
    bairro: "Jardim Oceânico",
    regiao: "Barra e Recreio",
    tipo: "Cobertura",
    quartos: 4,
    tipologia: "Cobertura duplex · 430 m²",
    preco: 8900000,
    valor: "R$ 8.900.000",
    categoria: "Alto padrão",
    imagem: "/img/barra-jardim-oceanico.webp",
    alt: "Cobertura duplex próxima à praia no Jardim Oceânico",
  },
  {
    id: "ap-11",
    nome: "Barra Golf Estate",
    bairro: "Barra da Tijuca",
    regiao: "Barra e Recreio",
    tipo: "Casa",
    quartos: 5,
    tipologia: "Casa de 5 suítes · 690 m²",
    preco: 13600000,
    valor: "R$ 13.600.000",
    categoria: "Alto padrão",
    imagem: "/img/barra-atlantica.webp",
    alt: "Casa de alto padrão próxima ao campo de golfe na Barra",
  },
  {
    id: "ap-12",
    nome: "Leblon Garden Residence",
    bairro: "Leblon",
    regiao: "Zona Sul",
    tipo: "Garden",
    quartos: 3,
    tipologia: "Garden de 3 suítes · 224 m²",
    preco: 6400000,
    valor: "R$ 6.400.000",
    categoria: "Alto padrão",
    imagem: "/img/bairro-leblon.webp",
    alt: "Apartamento garden de alto padrão no Leblon",
  },
] as const;

const CHIPS_LANCAMENTOS: readonly FiltroRapido[] = [
  {
    id: "centro",
    label: "Centro",
    categoria: "regiao",
    valor: "Centro",
  },
  {
    id: "zona-sul",
    label: "Zona Sul",
    categoria: "regiao",
    valor: "Zona Sul",
  },
  {
    id: "barra-recreio",
    label: "Barra e Recreio",
    categoria: "regiao",
    valor: "Barra e Recreio",
  },
  { id: "ipanema", label: "Ipanema", categoria: "bairro", valor: "Ipanema" },
  { id: "leblon", label: "Leblon", categoria: "bairro", valor: "Leblon" },
  { id: "botafogo", label: "Botafogo", categoria: "bairro", valor: "Botafogo" },
  {
    id: "barra",
    label: "Barra da Tijuca",
    categoria: "bairro",
    valor: "Barra da Tijuca",
  },
  { id: "ate-2", label: "Até R$ 2 mi", categoria: "faixa", valor: "ate-2" },
  { id: "2-5", label: "R$ 2 a 5 mi", categoria: "faixa", valor: "2-5" },
  {
    id: "acima-5",
    label: "Acima de R$ 5 mi",
    categoria: "faixa",
    valor: "acima-5",
  },
  {
    id: "apartamentos",
    label: "Apartamentos",
    categoria: "tipo",
    valor: "Apartamento",
  },
  { id: "studios", label: "Studios", categoria: "tipo", valor: "Studio" },
  {
    id: "coberturas",
    label: "Coberturas",
    categoria: "tipo",
    valor: "Cobertura",
  },
  { id: "gardens", label: "Gardens", categoria: "tipo", valor: "Garden" },
  { id: "casas", label: "Casas", categoria: "tipo", valor: "Casa" },
];

const CHIPS_ALTO_PADRAO: readonly FiltroRapido[] = [
  {
    id: "centro",
    label: "Centro",
    categoria: "regiao",
    valor: "Centro",
  },
  {
    id: "zona-sul",
    label: "Zona Sul",
    categoria: "regiao",
    valor: "Zona Sul",
  },
  {
    id: "barra-recreio",
    label: "Barra e Recreio",
    categoria: "regiao",
    valor: "Barra e Recreio",
  },
  { id: "leblon", label: "Leblon", categoria: "bairro", valor: "Leblon" },
  { id: "ipanema", label: "Ipanema", categoria: "bairro", valor: "Ipanema" },
  { id: "gavea", label: "Gávea", categoria: "bairro", valor: "Gávea" },
  {
    id: "jardim-botanico",
    label: "Jardim Botânico",
    categoria: "bairro",
    valor: "Jardim Botânico",
  },
  {
    id: "sao-conrado",
    label: "São Conrado",
    categoria: "bairro",
    valor: "São Conrado",
  },
  { id: "joa", label: "Joá", categoria: "bairro", valor: "Joá" },
  { id: "5-8", label: "R$ 5 a 8 mi", categoria: "faixa", valor: "5-8" },
  { id: "8-12", label: "R$ 8 a 12 mi", categoria: "faixa", valor: "8-12" },
  {
    id: "12-20",
    label: "R$ 12 a 20 mi",
    categoria: "faixa",
    valor: "12-20",
  },
  {
    id: "acima-20",
    label: "Acima de R$ 20 mi",
    categoria: "faixa",
    valor: "acima-20",
  },
  {
    id: "apartamentos",
    label: "Apartamentos",
    categoria: "tipo",
    valor: "Apartamento",
  },
  {
    id: "coberturas",
    label: "Coberturas",
    categoria: "tipo",
    valor: "Cobertura",
  },
  { id: "casas", label: "Casas", categoria: "tipo", valor: "Casa" },
];

const FAIXAS = {
  lancamentos: [
    { valor: "Todas", label: "Todas" },
    { valor: "ate-2", label: "Até R$ 2 milhões" },
    { valor: "2-5", label: "R$ 2 a 5 milhões" },
    { valor: "acima-5", label: "Acima de R$ 5 milhões" },
  ],
  "alto-padrao": [
    { valor: "Todas", label: "Todas acima de R$ 5 milhões" },
    { valor: "5-8", label: "R$ 5 a 8 milhões" },
    { valor: "8-12", label: "R$ 8 a 12 milhões" },
    { valor: "12-20", label: "R$ 12 a 20 milhões" },
    { valor: "acima-20", label: "Acima de R$ 20 milhões" },
  ],
} as const;

function precoNaFaixa(preco: number, faixa: string) {
  if (faixa === "Todas") return true;
  if (faixa === "ate-2") return preco <= 2000000;
  if (faixa === "2-5") return preco > 2000000 && preco <= 5000000;
  if (faixa === "acima-5") return preco > 5000000;
  if (faixa === "5-8") return preco >= 5000000 && preco <= 8000000;
  if (faixa === "8-12") return preco > 8000000 && preco <= 12000000;
  if (faixa === "12-20") return preco > 12000000 && preco <= 20000000;
  if (faixa === "acima-20") return preco > 20000000;
  return true;
}

type LancamentosCatalogoProps = {
  items?: readonly ImovelCatalogo[];
  variante?: VarianteCatalogo;
  initialFilters?: {
    tipologia?: Tipologia;
    quartos?: string;
    bairro?: string;
    faixa?: string;
    selecaoRapida?: string;
  };
};

export default function LancamentosCatalogo({
  items,
  variante = "lancamentos",
  initialFilters,
}: LancamentosCatalogoProps) {
  const imoveis =
    items ?? (variante === "alto-padrao" ? IMOVEIS_ALTO_PADRAO : LANCAMENTOS);
  const chips =
    variante === "alto-padrao" ? CHIPS_ALTO_PADRAO : CHIPS_LANCAMENTOS;
  const faixas = FAIXAS[variante];
  const bairros = useMemo(
    () =>
      Array.from(new Set(imoveis.map((imovel) => imovel.bairro))).sort((a, b) =>
        a.localeCompare(b, "pt-BR"),
      ),
    [imoveis],
  );
  const [selecaoRapida, setSelecaoRapida] = useState(initialFilters?.selecaoRapida ?? "todos");
  const [tipologia, setTipologia] = useState(initialFilters?.tipologia ?? "Todas");
  const [quartos, setQuartos] = useState(initialFilters?.quartos ?? "Todos");
  const [bairro, setBairro] = useState(initialFilters?.bairro ?? "Todos");
  const [faixa, setFaixa] = useState(initialFilters?.faixa ?? "Todas");
  const [mapaAberto, setMapaAberto] = useState(false);
  const chipsRef = useRef<HTMLDivElement>(null);
  const chipsDragRef = useRef({
    ativo: false,
    moveu: false,
    inicioX: 0,
    inicioScroll: 0,
    ultimoX: 0,
    ultimoTempo: 0,
    velocidade: 0,
    animacao: 0,
  });
  const [podeVoltarChips, setPodeVoltarChips] = useState(false);
  const [podeAvancarChips, setPodeAvancarChips] = useState(true);
  const [chipsEmMovimento, setChipsEmMovimento] = useState(false);

  useEffect(() => {
    if (!mapaAberto) return;

    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMapaAberto(false);
    };

    window.addEventListener("keydown", fecharComEscape);
    return () => window.removeEventListener("keydown", fecharComEscape);
  }, [mapaAberto]);

  useEffect(() => {
    const trilho = chipsRef.current;
    const estadoArraste = chipsDragRef.current;
    if (!trilho) return;

    const atualizarSetas = () => {
      const limite = Math.max(0, trilho.scrollWidth - trilho.clientWidth);
      setPodeVoltarChips(trilho.scrollLeft > 2);
      setPodeAvancarChips(trilho.scrollLeft < limite - 2);
    };

    atualizarSetas();
    trilho.addEventListener("scroll", atualizarSetas, { passive: true });
    const observador = new ResizeObserver(atualizarSetas);
    observador.observe(trilho);

    return () => {
      trilho.removeEventListener("scroll", atualizarSetas);
      observador.disconnect();
      cancelAnimationFrame(estadoArraste.animacao);
    };
  }, []);

  const resultados = useMemo(() => {
    const filtroRapido = chips.find((item) => item.id === selecaoRapida);

    return imoveis.filter((imovel) => {
      const correspondeSelecaoRapida =
        !filtroRapido ||
        (filtroRapido.categoria === "regiao" &&
          imovel.regiao === filtroRapido.valor) ||
        (filtroRapido.categoria === "bairro" &&
          imovel.bairro === filtroRapido.valor) ||
        (filtroRapido.categoria === "tipo" &&
          imovel.tipo === filtroRapido.valor) ||
        (filtroRapido.categoria === "faixa" &&
          precoNaFaixa(imovel.preco, filtroRapido.valor));

      return (
        correspondeSelecaoRapida &&
        (tipologia === "Todas" || imovel.tipo === tipologia) &&
        (quartos === "Todos" ||
          (quartos === "4+"
            ? imovel.quartos >= 4
            : imovel.quartos === Number(quartos))) &&
        (bairro === "Todos" || imovel.bairro === bairro) &&
        precoNaFaixa(imovel.preco, faixa)
      );
    });
  }, [bairro, chips, faixa, imoveis, quartos, selecaoRapida, tipologia]);

  const resultadosMapa = useMemo(
    () =>
      resultados.map((imovel) => ({
        id: imovel.id,
        slug: imovel.slug,
        segmento: imovel.segmento,
        tipoImovel: imovel.tipoImovel,
        nome: imovel.nome,
        bairro: imovel.bairro,
        tipologia: imovel.tipologia,
        valor: imovel.valor,
        imagem: imovel.imagem,
        coordenadas: coordenadasDoImovel(imovel),
      })),
    [resultados],
  );

  const filtrosAtivos =
    selecaoRapida !== "todos" ||
    tipologia !== "Todas" ||
    quartos !== "Todos" ||
    bairro !== "Todos" ||
    faixa !== "Todas";

  function limparFiltros() {
    setSelecaoRapida("todos");
    setTipologia("Todas");
    setQuartos("Todos");
    setBairro("Todos");
    setFaixa("Todas");
  }

  function moverChips(direcao: -1 | 1) {
    cancelAnimationFrame(chipsDragRef.current.animacao);
    setChipsEmMovimento(false);
    chipsRef.current?.scrollBy({
      left: direcao * Math.min(560, window.innerWidth * 0.62),
      behavior: "smooth",
    });
  }

  function iniciarArrasteChips(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const estado = chipsDragRef.current;
    cancelAnimationFrame(estado.animacao);
    estado.ativo = true;
    estado.moveu = false;
    estado.inicioX = event.clientX;
    estado.inicioScroll = event.currentTarget.scrollLeft;
    estado.ultimoX = event.clientX;
    estado.ultimoTempo = performance.now();
    estado.velocidade = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
    setChipsEmMovimento(true);
  }

  function arrastarChips(event: ReactPointerEvent<HTMLDivElement>) {
    const estado = chipsDragRef.current;
    if (!estado.ativo) return;

    const deslocamento = event.clientX - estado.inicioX;
    if (Math.abs(deslocamento) > 4) estado.moveu = true;

    event.currentTarget.scrollLeft = estado.inicioScroll - deslocamento;

    const agora = performance.now();
    const intervalo = Math.max(1, agora - estado.ultimoTempo);
    estado.velocidade = (estado.ultimoX - event.clientX) / intervalo;
    estado.ultimoX = event.clientX;
    estado.ultimoTempo = agora;
  }

  function encerrarArrasteChips(event: ReactPointerEvent<HTMLDivElement>) {
    const estado = chipsDragRef.current;
    if (!estado.ativo) return;
    estado.ativo = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const trilho = event.currentTarget;
    let ultimoFrame = performance.now();

    const aplicarInercia = (agora: number) => {
      const intervalo = Math.min(32, agora - ultimoFrame);
      ultimoFrame = agora;
      const antes = trilho.scrollLeft;
      trilho.scrollLeft += estado.velocidade * intervalo;
      estado.velocidade *= Math.pow(0.91, intervalo / 16.67);

      const chegouAoLimite = Math.abs(trilho.scrollLeft - antes) < 0.1;
      if (Math.abs(estado.velocidade) > 0.015 && !chegouAoLimite) {
        estado.animacao = requestAnimationFrame(aplicarInercia);
      } else {
        estado.animacao = 0;
        setChipsEmMovimento(false);
      }
    };

    if (estado.moveu && Math.abs(estado.velocidade) > 0.015) {
      estado.animacao = requestAnimationFrame(aplicarInercia);
    } else {
      setChipsEmMovimento(false);
    }
  }

  return (
    <main
      className={`${styles.page} ${
        variante === "alto-padrao" ? styles.altoPadrao : ""
      }`}
    >
      <section
        className={styles.catalog}
        aria-label={
          variante === "alto-padrao"
            ? "Catálogo de imóveis de alto padrão no Rio de Janeiro"
            : "Catálogo de apartamentos à venda no Rio de Janeiro"
        }
      >
        <div className={styles.filterPanel}>
          <div
            className={[
              styles.chipsBar,
              !podeVoltarChips ? styles.chipsBarAtStart : "",
              !podeAvancarChips ? styles.chipsBarAtEnd : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {podeVoltarChips && (
              <button
                type="button"
                className={`${styles.chipArrow} ${styles.chipArrowPrevious}`}
                aria-label="Ver opções anteriores"
                onClick={() => moverChips(-1)}
              >
                <span aria-hidden="true">←</span>
              </button>
            )}

            <div
              className={`${styles.chips} ${
                chipsEmMovimento ? styles.chipsDragging : ""
              }`}
              aria-label="Filtrar por região ou bairro"
              ref={chipsRef}
              onPointerDown={iniciarArrasteChips}
              onPointerMove={arrastarChips}
              onPointerUp={encerrarArrasteChips}
              onPointerCancel={encerrarArrasteChips}
            >
              {chips.map((item) => (
                <button
                  type="button"
                  className={
                    selecaoRapida === item.id ? styles.activeChip : undefined
                  }
                  aria-pressed={selecaoRapida === item.id}
                  onClick={(event) => {
                    if (chipsDragRef.current.moveu) {
                      event.preventDefault();
                      chipsDragRef.current.moveu = false;
                      return;
                    }
                    setSelecaoRapida((current) => current === item.id ? "todos" : item.id);
                  }}
                  key={item.id}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {podeAvancarChips && (
              <button
                type="button"
                className={`${styles.chipArrow} ${styles.chipArrowNext}`}
                aria-label="Ver próximas opções"
                onClick={() => moverChips(1)}
              >
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>

          <div className={styles.filters}>
            <FilterSelect
              label="Tipologia"
              value={tipologia}
              onChange={setTipologia}
              options={["Todas", "Apartamento", "Studio", "Cobertura", "Casa", "Garden"]}
            />
            <FilterSelect
              label="Quartos"
              value={quartos}
              onChange={setQuartos}
              options={["Todos", "1", "2", "3", "4+"]}
            />
            <FilterSelect
              label="Bairro"
              value={bairro}
              onChange={setBairro}
              options={["Todos", ...bairros]}
            />
            <label className={styles.selectField}>
              <span>Faixa de valor</span>
              <select value={faixa} onChange={(event) => setFaixa(event.target.value)}>
                {faixas.map((opcao) => (
                  <option value={opcao.valor} key={opcao.valor}>
                    {opcao.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className={styles.clear}
              disabled={!filtrosAtivos}
              onClick={limparFiltros}
            >
              Limpar filtros
            </button>
          </div>
        </div>

        <div className={styles.resultBar}>
          <p aria-live="polite">
            <strong>{String(resultados.length).padStart(2, "0")}</strong>
            <span>
              {resultados.length === 1
                ? "imóvel encontrado"
                : "imóveis encontrados"}
            </span>
          </p>

          <button
            type="button"
            className={`${styles.mapButton} ${
              mapaAberto ? styles.mapButtonActive : ""
            }`}
            aria-controls="catalogo-map-panel"
            aria-expanded={mapaAberto}
            disabled={resultados.length === 0}
            onClick={() => setMapaAberto((aberto) => !aberto)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Zm0 0V3m6 18V6" />
            </svg>
            {mapaAberto ? "Ocultar mapa" : "Ver mapa"}
          </button>
        </div>

        <div
          className={`${styles.resultsLayout} ${
            mapaAberto ? styles.resultsLayoutMapOpen : ""
          }`}
        >
          <div className={styles.gridPane}>
            {resultados.length > 0 ? (
              <div className={styles.grid}>
                {resultados.map((imovel) => (
                  <ProdutoCard produto={imovel} key={imovel.id} />
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <span>0 resultados</span>
                <h3>
                  Nenhum {variante === "alto-padrao" ? "imóvel" : "lançamento"}{" "}
                  combina com estes filtros.
                </h3>
                <p>Amplie a região ou remova uma das seleções para continuar.</p>
                <button type="button" onClick={limparFiltros}>
                  Ver todos os imóveis
                </button>
              </div>
            )}
          </div>

          {mapaAberto && (
            <aside
              className={styles.mapPanel}
              id="catalogo-map-panel"
              aria-label="Mapa dos imóveis encontrados"
            >
              <header className={styles.mapPanelHeader}>
                <div>
                  <span>Mapa interativo</span>
                  <p>
                    <strong>{String(resultados.length).padStart(2, "0")}</strong>{" "}
                    pontos no Rio
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.mapClose}
                  aria-label="Fechar mapa"
                  onClick={() => setMapaAberto(false)}
                >
                  <span aria-hidden="true" />
                  <span aria-hidden="true" />
                </button>
              </header>

              <div className={styles.mapViewport}>
                <CatalogoMapa
                  imoveis={resultadosMapa}
                  monocromatico={variante === "alto-padrao"}
                />
              </div>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <label className={styles.selectField}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
