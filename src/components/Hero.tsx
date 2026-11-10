"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { encontrarDestino } from "@/lib/bairros";
import { encontrarPost } from "@/lib/blog";
import { encontrarImovel } from "@/lib/imoveis";
import { LUGARES, normalizar } from "@/lib/lugares";

type HeroSection =
  | "home"
  | "lancamentos"
  | "alto-padrao"
  | "refugios"
  | "bairros"
  | "blog"
  | "calculadora"
  | "produto"
  | "contato"
  | "ilha-pura"
  | "construtoras";

const HERO_NAV: Array<{
  label: string;
  href: string;
  section: HeroSection;
  title?: string;
  description?: string;
  image?: string;
  showInNav?: boolean;
}> = [
  { label: "Início", href: "/", section: "home" },
  {
    label: "Lançamentos",
    href: "/lancamentos",
    section: "lancamentos",
    title: "Apartamentos à venda no Rio de Janeiro.",
    description:
      "Compare novos empreendimentos por região, tipologia e faixa de investimento. Informações fictícias para apresentação do projeto.",
    image: "/img/lancamentos.webp",
  },
  {
    label: "Alto Padrão",
    href: "/alto-padrao",
    section: "alto-padrao",
    title: "Imóveis de alto padrão no Rio de Janeiro",
    description:
      "Casas, apartamentos e coberturas singulares nos endereços mais desejados da cidade.",
    image: "/img/alto-padrao-cover-infolio.webp",
  },
  {
    label: "Refúgios",
    href: "/refugios",
    section: "refugios",
    title: "Refúgios para viver o Rio de Janeiro",
    description:
      "Casas e endereços reservados onde arquitetura, natureza e privacidade encontram uma forma mais tranquila de viver.",
    image: "/img/barra-itanhanga.webp",
  },
  {
    label: "Bairros",
    href: "/bairros",
    section: "bairros",
    title: "Imóveis nos melhores bairros do Rio",
    description:
      "Conheça cada endereço pela paisagem, pelo estilo de vida e pelas oportunidades disponíveis.",
    image: "/img/bairros-cover-pink-sunrise.webp",
  },
  {
    label: "Blog",
    href: "/blog",
    section: "blog",
    title: "Arquitetura, mercado e vida no Rio",
    description:
      "Leituras sobre novos projetos, bairros cariocas, investimento e as transformações da cidade.",
    image: "/img/blog-cover-copacabana.webp",
  },
  {
    label: "Calculadora",
    href: "/calculadora-investimento-compra",
    section: "calculadora",
    title: "Calculadora imobiliária para comprar ou investir",
    description:
      "Organize entrada, impostos, FGTS, renda e retorno potencial antes de escolher o próximo endereço.",
    image: "/img/cover.webp",
    showInNav: false,
  },
  {
    label: "Imóvel",
    href: "/imovel",
    section: "produto",
    title: "Imóvel selecionado no Rio de Janeiro",
    description:
      "Arquitetura, localização e os detalhes que fazem deste endereço uma escolha singular.",
    image: "/img/alto-padrao.webp",
    showInNav: false,
  },
  {
    label: "Contato",
    href: "/contato",
    section: "contato",
    title: "Encontre seu próximo endereço no Rio",
    description:
      "Conte o que procura e receba uma curadoria feita para o seu momento, seu estilo e seus planos.",
    image: "/img/contato-vogue-square.jpg",
    showInNav: false,
  },
  {
    label: "Ilha Pura",
    href: "/ilha-pura",
    section: "ilha-pura",
    title: "Ilha Pura",
    image: "/img/ilha-pura-cover.jpg",
    showInNav: false,
  },
  {
    label: "Construtoras",
    href: "/construtoras",
    section: "construtoras",
    title: "Construtoras no Rio de Janeiro",
    description: "Conheça as incorporadoras e construtoras presentes na curadoria Rio Lançamentos.",
    image: "/img/alto-padrao-cover-infolio.webp",
    showInNav: false,
  },
];

const sectionFromPathname = (pathname: string): HeroSection | null => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 4 && segments[0] === "rio-de-janeiro") return "produto";
  if (segments.length === 2 && segments[0] === "rio-de-janeiro") return "bairros";
  if (segments.length === 2 && segments[0] === "regiao") return "bairros";
  if (segments[0] === "construtora" || segments[0] === "construtoras") return "construtoras";
  return HERO_NAV.find(
    ({ href }) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)),
  )?.section ?? null;
};

const TIPOLOGIAS_COM_COVER = new Set([
  "apartamento",
  "casa",
  "cobertura",
  "garden",
  "studio",
]);

const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
  precision highp float;

  uniform vec2  u_res;
  uniform float u_phase;
  uniform vec4  u_box;
  uniform float u_radius;
  uniform float u_type;
  uniform vec2  u_caret;
  uniform float u_pulse;
  uniform float u_spill;
  uniform float u_seed;
  uniform vec3  u_shape;
  uniform vec3  u_c1;
  uniform vec3  u_c2;
  uniform vec3  u_c3;
  uniform vec3  u_c4;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  float sdRoundBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  void main() {
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = frag / u_res;

    float d = sdRoundBox(frag - u_box.xy, u_box.zw, u_radius);
    float pull = exp(-max(d, 0.0) / 190.0);

    vec2  toCaret = frag - u_caret;
    float dc = length(toCaret) / u_res.y;

    float caretGlow = exp(-dc * 5.2) * u_type;

    float r = u_pulse * 0.26;
    float ring = exp(-abs(dc - r) * 26.0) * exp(-u_pulse * 3.0);

    vec2 toBox = (u_box.xy - frag) / u_res.y;
    vec2 p = uv * vec2(1.6, 1.0)
           + toBox * pull * 0.30
           + normalize(toCaret + 0.0001) * ring * 0.06;

    float s = u_phase;
    float k = u_seed;
    float w1 = fbm(p * 1.10 + vec2( s * 0.70, -s * 0.50) + k);
    float w2 = fbm(p * 1.00 + vec2(-s * 0.60,  s * 0.40) +  3.7 + k * 1.7);
    float w3 = fbm(p * 1.30 + vec2( s * 0.35,  s * 0.60) +  8.1 + k * 2.3);
    float w4 = fbm(p * 0.90 + vec2(-s * 0.45, -s * 0.30) + 13.3 + k * 3.1);

    w1 = pow(w1, 6.0); w2 = pow(w2, 6.0);
    w3 = pow(w3, 6.0); w4 = pow(w4, 6.0);

    float sw = w1 + w2 + w3 + w4 + 0.0001;
    vec3 col = (u_c1 * w1 + u_c2 * w2 + u_c3 * w3 + u_c4 * w4) / sw;

    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = clamp(mix(vec3(lum), col, 1.95), 0.0, 1.0);

    float alturaCover = u_res.y - u_spill;
    float yc = (frag.y - u_spill) / alturaCover;
    float doTopo = 1.0 - yc;

    // rosa do pôr do sol — o "sol" aparece mais na parte de cima do bloco (sutil)
    vec3 rosaSol = vec3(1.0, 0.58, 0.62);
    col = mix(col, rosaSol, smoothstep(0.5, 1.0, yc) * 0.28);

    // nuvens: cada uma nasce numa posição X aleatória, com largura e
    // profundidade próprias, atravessa devagar de lado e se dissolve — em
    // momentos/lugares diferentes, sem ponto fixo de nascimento ou fim
    float amb = 0.0;
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float rate = 0.24 + 0.05 * fi;                  // ritmo do ciclo da nuvem
      float t = u_phase * rate + fi * 1.37 + u_seed * 0.15;
      float k = fract(t);                             // 0..1 dentro do ciclo
      float cyc = floor(t);                           // índice do ciclo atual

      // entra suave, tem um platô e some suave — desacoplado da posição
      float life =
        smoothstep(0.0, 0.30, k) *
        (1.0 - smoothstep(0.55, 1.0, k));

      // posição inicial sorteada a cada ciclo + leve deriva lateral
      float startX  = hash(vec2(cyc * 1.7 + fi * 9.1, fi * 3.3 + u_seed));
      float driftDir = hash(vec2(cyc + 41.0, fi)) - 0.5;
      float cxi = startX + driftDir * 0.7 * (k - 0.5);

      // largura e alcance vertical variam por nuvem (mais largas e mais fundas)
      float wid = 0.40 + 0.28 * hash(vec2(cyc + 7.0, fi + 2.0));
      float dxi = (uv.x - cxi) / wid;
      float lobe = exp(-dxi * dxi * 1.4);             // gaussiana horizontal (mais aberta)

      float profi = u_shape.x * (0.85 + 1.05 * hash(vec2(cyc + 19.0, fi + 5.0)));
      float topoi =
        1.0 - smoothstep(0.0, profi, doTopo);         // nasce no topo, desce pouco

      amb += lobe * topoi * life;
    }
    amb = min(amb, 1.6);

    // turbulência interna + fumaça que dissolve as bordas das nuvens
    // (pisos mais altos p/ não apagar tanto — fica mais abrangente)
    amb *= 0.66 + 0.5 * w1;
    float smoke = fbm(vec2(uv.x * 2.4 - u_phase * 0.12, u_phase * 0.34) + u_seed * 3.1);
    amb *= 0.64 + 0.58 * smoothstep(0.15, 0.85, smoke);

    float e = amb + (1.35 * caretGlow + 0.9 * ring) * (0.55 + 0.45 * w1);

    col *= e * 1.16;
    // seguro: apaga suave junto ao rodapé do canvas p/ nenhuma luz do input
    // ser cortada seco pela borda do cover (overflow:hidden)
    col *= smoothstep(0.0, 0.12, yc);
    gl_FragColor = vec4(col, 1.0);
  }
`;

// Desativado temporariamente para comparar a resposta da interface sem a
// camada que acompanha o ponteiro. A luz da busca/WebGL continua independente.
const CUSTOM_CURSOR_ENABLED = false;

const MEGA_EXPLORE = [
  ["Barra e Recreio", "/bairros/barra-e-recreio"],
  ["Zona Sul", "/bairros/zona-sul"],
  ["Apartamentos", "/rio-de-janeiro/apartamento"],
  ["Casas", "/rio-de-janeiro/casa"],
  ["Coberturas", "/rio-de-janeiro/cobertura"],
  ["Studios", "/rio-de-janeiro/studio"],
] as const;

const MEGA_INSTITUCIONAL = [
  ["Sobre o projeto", "#"],
  ["Fale com a curadoria", "/contato"],
  ["Anuncie seu imóvel", "/contato/"],
  ["Seja um parceiro", "/contato/"],
] as const;

type CoverRouteLayer = {
  id: string;
  kind: "home" | "internal";
  position: "center 62%" | "center top";
  ready: boolean;
  src: string;
};

function CoverRouteImage({
  identity,
  kind,
  position = "center top",
  src,
}: {
  identity: string;
  kind: CoverRouteLayer["kind"];
  position?: CoverRouteLayer["position"];
  src: string;
}) {
  const [media, setMedia] = useState<{
    identity: string;
    layers: CoverRouteLayer[];
    position: CoverRouteLayer["position"];
  }>({
    identity,
    layers: [{ id: identity, kind, position, ready: false, src }],
    position,
  });
  const removalTimer = useRef<number | null>(null);

  // Ajusta o estado durante o render quando a rota muda. O React descarta este
  // render e refaz imediatamente, sem o frame intermediário produzido por um
  // effect e sem desmontar a imagem anterior.
  if (media.identity !== identity || media.position !== position) {
    setMedia({
      identity,
      layers:
        media.identity === identity
          ? [{ id: identity, kind, position, ready: true, src }]
          : [
              ...media.layers.slice(-1),
              { id: identity, kind, position, ready: false, src },
            ],
      position,
    });
  }

  useEffect(
    () => () => {
      if (removalTimer.current !== null) {
        window.clearTimeout(removalTimer.current);
      }
    },
    [],
  );

  const layers = media.layers;
  const latest = layers.at(-1);
  const latestReady = latest?.ready ?? false;

  const markReady = (id: string) => {
    setMedia((current) => ({
      ...current,
      layers: current.layers.map((layer) =>
        layer.id === id ? { ...layer, ready: true } : layer,
      ),
    }));

    if (removalTimer.current !== null) {
      window.clearTimeout(removalTimer.current);
    }
    removalTimer.current = window.setTimeout(() => {
      setMedia((current) => ({
        ...current,
        layers: current.layers.slice(-1),
      }));
      removalTimer.current = null;
    }, 1100);
  };

  return (
    <div className="cover-route-media" aria-hidden="true">
      {layers.map((layer, index) => {
        const isLatest = index === layers.length - 1;
        const stateClass = isLatest
          ? layer.ready
            ? "cover-media-ready"
            : ""
          : latestReady
            ? "cover-media-outgoing"
            : "cover-media-ready";

        return (
          <Image
            className={`cover-media-layer ${
              layer.kind === "home" ? "cover-home-foto" : "cover-foto"
            } ${stateClass}`}
            src={layer.src}
            alt=""
            fill
            sizes="100vw"
            preload={isLatest}
            onLoad={() => markReady(layer.id)}
            style={{ objectPosition: layer.position }}
            key={layer.id}
          />
        );
      })}
    </div>
  );
}

function TipologiaCover({ images }: { images: readonly string[] }) {
  const duration = Math.max(images.length, 1) * 6;

  return (
    <div
      className={`tipologia-cover tipologia-cover-${images.length}`}
      aria-hidden="true"
    >
      {images.map((src, index) => (
        <Image
          className="cover-foto tipologia-cover-foto"
          src={src}
          alt=""
          fill
          sizes="100vw"
          preload={index === 0}
          loading={index === 0 ? undefined : "lazy"}
          style={{
            animationDelay: `${index * 6}s`,
            animationDuration: `${duration}s`,
          }}
          key={src}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const pathname = usePathname();
  const router = useRouter();
  const pathnameSection = sectionFromPathname(pathname);
  const pathSegments = pathname.split("/").filter(Boolean);
  const tipologiaSlug =
    pathSegments.length === 2 &&
    pathSegments[0] === "rio-de-janeiro" &&
    TIPOLOGIAS_COM_COVER.has(pathSegments[1])
      ? pathSegments[1]
      : null;
  const bairroSlug = pathname.startsWith("/bairros/")
    ? pathname.split("/")[2]
    : pathSegments.length === 2 && pathSegments[0] === "regiao"
      ? pathSegments[1]
    : pathSegments.length === 2 && pathSegments[0] === "rio-de-janeiro"
      ? pathSegments[1]
      : null;
  const destinoEncontrado = bairroSlug ? encontrarDestino(bairroSlug) : undefined;
  const nomeRegiao = pathSegments[0] === "regiao" && bairroSlug
    ? ({ "barra-e-recreio": "Barra e Recreio", "zona-oeste": "Zona Oeste", "zona-sul": "Zona Sul", "zona-norte": "Zona Norte", "grande-tijuca": "Grande Tijuca", centro: "Centro" } as Record<string, string>)[bairroSlug]
    : undefined;
  const destinoBairro = bairroSlug
    ? destinoEncontrado ?? {
        slug: bairroSlug,
        nome: nomeRegiao ?? bairroSlug.split("-").map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1)).join(" "),
        descricao: "Conheça os imóveis selecionados neste endereço do Rio de Janeiro.",
        imagem: "/img/bairros-cover-pink-sunrise.webp",
      }
    : undefined;
  const postSlug =
    pathname.startsWith("/blog/") ? pathname.split("/")[2] : null;
  const postBlog = postSlug ? encontrarPost(postSlug) : undefined;
  const imovelSlug =
    pathname.startsWith("/imovel/")
      ? pathname.split("/")[2]
      : pathSegments.length === 4 && pathSegments[0] === "rio-de-janeiro"
        ? pathSegments[3]
        : null;
  const imovelAtivo = imovelSlug ? encontrarImovel(imovelSlug) : undefined;
  const construtoraSlug = pathSegments[0] === "construtora" ? pathSegments[1] : null;
  const construtoraNome = construtoraSlug
    ? construtoraSlug.split("-").map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1)).join(" ")
    : null;
  const [query, setQuery] = useState("");
  const [typingPulse, setTypingPulse] = useState(0);
  const [menuAberto, setMenuAberto] = useState(false);
  const [tipologiaCover, setTipologiaCover] = useState<{
    slug: string;
    images: string[];
  }>({ slug: "", images: [] });
  const [produtoCover, setProdutoCover] = useState<{
    slug: string;
    nome: string;
    bairro: string;
    tipologia: string;
    images: string[];
  }>({ slug: "", nome: "", bairro: "", tipologia: "", images: [] });
  const coverRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!tipologiaSlug) return;
    const controller = new AbortController();

    fetch(`/api/tipologia-cover/${encodeURIComponent(tipologiaSlug)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : { images: [] }))
      .then((result: { images?: unknown }) => {
        if (controller.signal.aborted) return;
        const images = Array.isArray(result.images)
          ? result.images.filter((image): image is string => typeof image === "string")
          : [];
        setTipologiaCover({ slug: tipologiaSlug, images: images.slice(0, 3) });
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [tipologiaSlug]);

  useEffect(() => {
    if (!imovelSlug) return;
    const controller = new AbortController();

    fetch(`/api/produto-cover/${encodeURIComponent(imovelSlug)}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : { images: [] }))
      .then((result: {
        slug?: unknown;
        nome?: unknown;
        bairro?: unknown;
        tipologia?: unknown;
        images?: unknown;
      }) => {
        if (controller.signal.aborted) return;
        const images = Array.isArray(result.images)
          ? result.images.filter((image): image is string => typeof image === "string")
          : [];
        setProdutoCover({
          slug: imovelSlug,
          nome: typeof result.nome === "string" ? result.nome : "",
          bairro: typeof result.bairro === "string" ? result.bairro : "",
          tipologia: typeof result.tipologia === "string" ? result.tipologia : "",
          images: images.slice(0, 5),
        });
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [imovelSlug]);

  const resultados = useMemo(() => {
    const termo = normalizar(query.trim());
    if (!termo) return [];
    return LUGARES.filter((d) =>
      normalizar(d.nome + " " + d.meta).includes(termo),
    ).slice(0, 7);
  }, [query]);

  const temTexto = query.length > 0;

  const menuRef = useRef<HTMLElement>(null);
  const [ativo, setAtivo] = useState(() =>
    HERO_NAV.findIndex(({ section }) => section === pathnameSection),
  );
  const [pilula, setPilula] = useState({ left: "0rem", width: "0rem" });
  const [pilulaPronta, setPilulaPronta] = useState(false);
  const menuAtivoVisivel = Boolean(
    HERO_NAV[ativo] && HERO_NAV[ativo].showInNav !== false,
  );

  useEffect(() => {
    if (!menuAberto) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuAberto(false);
    };
    window.addEventListener("keydown", fecharComEscape);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", fecharComEscape);
    };
  }, [menuAberto]);

  // pílula deslizante: posiciona sob o item ativo (reposiciona no resize/fontes)
  useEffect(() => {
    const nav = menuRef.current;
    if (!nav) return;
    const medir = () => {
      const el = nav.querySelector<HTMLAnchorElement>(":scope > a.ativo");
      if (el) {
        const remBase =
          Number.parseFloat(getComputedStyle(document.documentElement).fontSize) ||
          14;
        setPilula({
          left: `${el.offsetLeft / remBase}rem`,
          width: `${el.offsetWidth / remBase}rem`,
        });
      } else {
        setPilula({ left: "0rem", width: "0rem" });
      }
    };
    medir();
    window.addEventListener("resize", medir);
    document.fonts?.ready.then(medir).catch(() => {});
    return () => window.removeEventListener("resize", medir);
  }, [ativo]);

  // só revela a pílula depois de posicionada (evita o "tracinho" crescendo do 0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setPilulaPronta(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!pathnameSection) return;
    const index = HERO_NAV.findIndex(({ section }) => section === pathnameSection);
    const frameId = requestAnimationFrame(() => {
      setAtivo(index);
    });
    return () => cancelAnimationFrame(frameId);
  }, [pathnameSection]);

  const aoClicarItem = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    i: number,
  ) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    const destination = HERO_NAV[i];
    if (destination.href === pathname) return;

    setAtivo(i);
    router.push(destination.href);
  };

  // divide um texto em palavras animáveis (para o "morph" do título)
  const palavras = (texto: string, base = 0) =>
    texto.split(" ").flatMap((w, i) => [
      <span
        key={`${base}-${i}`}
        className="palavra"
        style={{ "--i": base + i } as CSSProperties}
      >
        {w}
      </span>,
      " ",
    ]);

  // ----- cursor + WebGL (imperativo, uma vez) -----
  useEffect(() => {
    const canvas = canvasRef.current;
    const cover = coverRef.current;
    const q = inputRef.current;
    const results = resultsRef.current;
    if (!canvas || !cover || !q || !results) return;

    const cleanups: Array<() => void> = [];

    /* ---- cursor ---- */
    document.documentElement.classList.toggle(
      "custom-cursor-enabled",
      CUSTOM_CURSOR_ENABLED,
    );
    cleanups.push(() =>
      document.documentElement.classList.remove("custom-cursor-enabled"),
    );

    if (
      CUSTOM_CURSOR_ENABLED &&
      matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      const anel = document.createElement("div");
      const ponto = document.createElement("div");
      const luz = document.createElement("div");
      const mao = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const maoPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      anel.className = "cursor cursor-anel";
      ponto.className = "cursor cursor-ponto";
      luz.className = "cursor-luz";
      mao.classList.add("cursor-arraste-icon");
      mao.setAttribute("viewBox", "0 0 32 32");
      mao.setAttribute("aria-hidden", "true");
      maoPath.setAttribute(
        "d",
        "M15 6c-1.063 0-1.996.563-2.531 1.406A2.98 2.98 0 0 0 11 7c-1.645 0-3 1.355-3 3v3.656l-2.094 2.688a4.49 4.49 0 0 0 .188 5.593l2.375 2.688A6.99 6.99 0 0 0 13.719 27H19c3.855 0 7-3.145 7-7v-9c0-1.645-1.355-3-3-3-.535 0-1.031.156-1.469.406A2.99 2.99 0 0 0 19 7c-.535 0-1.031.156-1.469.406A2.99 2.99 0 0 0 15 6Zm0 2c.566 0 1 .434 1 1v3h2v-2c0-.566.434-1 1-1s1 .434 1 1v2h2v-1c0-.566.434-1 1-1s1 .434 1 1v9c0 2.773-2.227 5-5 5h-5.281a4.99 4.99 0 0 1-3.75-1.688l-2.375-2.718a2.48 2.48 0 0 1-.094-3L8 16.937V18h2v-8c0-.566.434-1 1-1s1 .434 1 1v2h2V9c0-.566.434-1 1-1Z",
      );
      mao.append(maoPath);
      anel.append(mao);
      document.body.append(luz, anel, ponto);

      const CAMPO = 'input, textarea, [contenteditable="true"]';
      const CLICAVEL = 'a, button, .result, [role="button"]';
      const ARRASTAVEL = "[data-drag-carousel]";
      const TRILHO_ARRASTAVEL = `${ARRASTAVEL} .splide__track`;
      const remBase =
        Number.parseFloat(getComputedStyle(document.documentElement).fontSize) ||
        14;
      let visivel = false;

      const pos = (el: HTMLElement, x: number, y: number) => {
        el.style.transform = `translate3d(${x / remBase}rem, ${y / remBase}rem, 0) translate(-50%, -50%)`;
      };
      const atualizarFormato = (alvo: Element | null) => {
        const campo = !!alvo?.closest(CAMPO);
        // Dentro do trilho, o gesto principal é arrastar — inclusive quando o
        // card também é um link. Setas e dots ficam fora do track e continuam
        // usando o cursor compacto de link.
        const arraste = !!alvo?.closest(TRILHO_ARRASTAVEL) && !campo;
        const clicavel = !!alvo?.closest(CLICAVEL) && !arraste;

        ponto.classList.toggle("texto", campo);
        anel.classList.toggle("texto", campo);
        ponto.classList.toggle("arraste", arraste);
        anel.classList.toggle("arraste", arraste);
        anel.classList.toggle("perto", !campo && clicavel);

        if (!arraste) anel.classList.remove("arrastando");
      };
      const onMove = (e: MouseEvent) => {
        const alvo =
          document.elementFromPoint(e.clientX, e.clientY) ??
          (e.target as Element | null);
        pos(ponto, e.clientX, e.clientY);
        pos(anel, e.clientX, e.clientY);
        pos(luz, e.clientX, e.clientY);
        luz.classList.toggle("ativo", !alvo?.closest(".cover"));
        // `elementFromPoint` continua correto mesmo quando o Splide mantém
        // pointer capture durante/depois de um arraste.
        atualizarFormato(alvo);
        if (!visivel) {
          visivel = true;
          anel.classList.add("ativo");
          ponto.classList.add("ativo");
        }
      };
      const onOut = (e: MouseEvent) => {
        if (e.relatedTarget === null) {
          visivel = false;
          anel.classList.remove("ativo");
          ponto.classList.remove("ativo");
          luz.classList.remove("ativo");
        }
      };
      const onOver = (e: MouseEvent) => {
        atualizarFormato(e.target as Element);
      };
      const onDown = (e: MouseEvent) => {
        const t = e.target as Element;
        if (t.closest(TRILHO_ARRASTAVEL) && !t.closest(CAMPO)) {
          anel.classList.add("arrastando");
        }
      };
      const onUp = (e: MouseEvent) => {
        anel.classList.remove("arrastando");
        atualizarFormato(document.elementFromPoint(e.clientX, e.clientY));
      };
      const onBlur = () => anel.classList.remove("arrastando");
      addEventListener("mousemove", onMove, { passive: true });
      addEventListener("mouseout", onOut);
      addEventListener("mouseover", onOver, { passive: true });
      addEventListener("mousedown", onDown);
      addEventListener("mouseup", onUp);
      addEventListener("blur", onBlur);
      cleanups.push(() => {
        removeEventListener("mousemove", onMove);
        removeEventListener("mouseout", onOut);
        removeEventListener("mouseover", onOver);
        removeEventListener("mousedown", onDown);
        removeEventListener("mouseup", onUp);
        removeEventListener("blur", onBlur);
        anel.remove();
        ponto.remove();
        luz.remove();
      });
    }

    /* ---- campo de luz (WebGL) ---- */
    // O contexto WebGL é usado na home e nas rotas editoriais que compartilham
    // a atmosfera sunrise. Nas demais internas ele continua dormente.
    let webglMontado = false;
    const efeitoSunriseAtivo = () =>
      !cover.classList.contains("interna") ||
      cover.classList.contains("sunrise-interno");
    const iniciarWebGL = () => {
      if (webglMontado || !efeitoSunriseAtivo()) return;
      const gl = canvas.getContext("webgl", {
        antialias: false,
        alpha: false,
        powerPreference: "low-power",
      });
      if (!gl) return;
      webglMontado = true;
      montarWebGL(gl, canvas, cover, q, results);
    };
    const observarHome = new MutationObserver(iniciarWebGL);
    observarHome.observe(cover, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const webglStartId = window.setTimeout(iniciarWebGL, 320);
    cleanups.push(() => window.clearTimeout(webglStartId));
    cleanups.push(() => observarHome.disconnect());

    function montarWebGL(
      gl: WebGLRenderingContext,
      canvas: HTMLCanvasElement,
      cover: HTMLDivElement,
      q: HTMLInputElement,
      results: HTMLUListElement,
    ) {
      const compile = (type: number, src: string) => {
        const sh = gl.createShader(type)!;
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
          console.error(gl.getShaderInfoLog(sh));
          return null;
        }
        return sh;
      };

      const vs = compile(gl.VERTEX_SHADER, VERT);
      const fs = compile(gl.FRAGMENT_SHADER, FRAG);

      if (vs && fs) {
        const prog = gl.createProgram()!;
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);

        if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          gl.useProgram(prog);

          const buf = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW,
          );
          const aPos = gl.getAttribLocation(prog, "a_pos");
          gl.enableVertexAttribArray(aPos);
          gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

          const u = (n: string) => gl.getUniformLocation(prog, n);
          const uRes = u("u_res");
          const uPhase = u("u_phase");
          const uBox = u("u_box");
          const uRadius = u("u_radius");
          const uType = u("u_type");
          const uCaret = u("u_caret");
          const uPulse = u("u_pulse");
          const uSpill = u("u_spill");

          /* ---- sorteio desta abertura ---- */
          const R = (a: number, b: number) => a + Math.random() * (b - a);
          const hsl = (h: number, s: number, l: number): [number, number, number] => {
            h = ((((h % 360) + 360) % 360) / 360);
            const f = (n: number) => {
              const kk = (n + h * 12) % 12;
              return (
                l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(kk - 3, 9 - kk, 1))
              );
            };
            return [f(0), f(8), f(4)];
          };

          // paleta do pôr do sol: rosé suave (~ -8) → vermelho → laranja → dourado (~28)
          const hBase = R(-10, -5);
          const faixa = R(34, 40);
          const hues = [0, 1, 2, 3].map(
            (i) => hBase + faixa * (i / 3) + R(-3, 3),
          );
          const cores = hues.map((h, i) =>
            hsl(h, R(0.82, 1.0), 0.62 + 0.035 * i + R(-0.03, 0.03)),
          );
          for (let i = cores.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cores[i], cores[j]] = [cores[j], cores[i]];
          }

          gl.uniform1f(u("u_seed"), R(0, 40));
          gl.uniform3f(u("u_shape"), R(0.24, 0.34), 0, R(0, 6.28));
          (["u_c1", "u_c2", "u_c3", "u_c4"] as const).forEach((nome, i) => {
            gl.uniform3f(u(nome), cores[i][0], cores[i][1], cores[i][2]);
          });

          let escala = 1;
          let vazamento = 0;
          const meas = document.createElement("canvas").getContext("2d")!;

          let dirty = true;
          // preenchida mais abaixo; no-op até lá (usada já no resize inicial)
          let desenhar: () => void = () => {};

          const resize = () => {
            escala = 0.6;
            canvas.width = Math.round(canvas.clientWidth * escala);
            canvas.height = Math.round(canvas.clientHeight * escala);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.uniform1f(uRadius, 25 * escala);
            vazamento = (canvas.clientHeight - cover.clientHeight) * escala;
            gl.uniform1f(uSpill, vazamento);
            // redesenha na hora — o canvas foi limpo ao mudar de tamanho,
            // sem isto ele pisca/some até o próximo frame (throttle de 30fps)
            dirty = true;
            desenhar();
          };
          const ro = new ResizeObserver(resize);
          ro.observe(cover);
          resize();

          const marcar = () => {
            dirty = true;
          };
          addEventListener("resize", marcar);
          q.addEventListener("input", marcar);
          q.addEventListener("keyup", marcar);
          q.addEventListener("click", marcar);
          const mo = new MutationObserver(marcar);
          mo.observe(results, { childList: true });

          const syncGeometry = () => {
            const c = cover.getBoundingClientRect();
            const i = q.getBoundingClientRect();
            const yCentro = (c.bottom - i.bottom + i.height / 2) * escala + vazamento;

            let base = i.bottom;
            if (results.firstChild)
              base = results.getBoundingClientRect().bottom;
            const alturaBloco = base - i.top;

            gl.uniform4f(
              uBox,
              (i.left - c.left + i.width / 2) * escala,
              (c.bottom - base + alturaBloco / 2) * escala + vazamento,
              (i.width / 2) * escala,
              (alturaBloco / 2) * escala,
            );

            const cs = getComputedStyle(q);
            meas.font = cs.fontSize + " " + cs.fontFamily;
            const pad = parseFloat(cs.paddingLeft) || 0;
            let upto = q.value.slice(0, q.selectionStart ?? q.value.length);
            if (cs.textTransform === "uppercase") upto = upto.toUpperCase();
            const ls = parseFloat(cs.letterSpacing) || 0;
            const largura = meas.measureText(upto).width + ls * upto.length;
            const x = Math.min(pad + largura, i.width - pad);
            gl.uniform2f(uCaret, (i.left - c.left + x) * escala, yCentro);
          };

          let typing = 0;
          let lastKey = -999;
          let phase = 0;
          const onInputEnergy = () => {
            typing = 1;
            lastKey = performance.now() / 1000;
          };
          q.addEventListener("input", onInputEnergy);

          desenhar = () => {
            if (dirty) {
              syncGeometry();
              dirty = false;
            }
            gl.uniform1f(uPhase, phase);
            gl.uniform1f(uType, typing);
            gl.uniform1f(uPulse, performance.now() / 1000 - lastKey);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
          };

          const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
          const INTERVALO = 1000 / 30;
          let prev = performance.now();
          let desde = INTERVALO;
          let raf = 0;
          let rodando = false;
          let coverVisivel = true;

          const podeRenderizar = () =>
            !still &&
            coverVisivel &&
            !document.hidden &&
            efeitoSunriseAtivo();

          const frame = (now: number) => {
            if (!podeRenderizar()) {
              rodando = false;
              return;
            }

            raf = requestAnimationFrame(frame);
            const dtMs = now - prev;
            prev = now;
            const dt = Math.min(dtMs / 1000, 0.05);

            // Cada tecla dispara o pulso completo. Depois, a luz não some de
            // uma vez: permanece respirando junto ao cursor enquanto o campo
            // tiver conteúdo e recolhe suavemente quando ele for limpo.
            const repouso = q.value.length > 0 ? 0.16 : 0;
            typing +=
              (repouso - typing) *
              Math.min(1, dt * (typing > repouso ? 2.15 : 3.4));
            phase += dt * (0.19 + 0.1 * typing);

            desde += dtMs;
            if (desde < INTERVALO) return;
            desde = 0;

            desenhar();
          };

          const iniciarLoop = () => {
            if (still) {
              desenhar();
              return;
            }
            if (rodando || !podeRenderizar()) return;
            rodando = true;
            prev = performance.now();
            desde = INTERVALO;
            raf = requestAnimationFrame(frame);
          };

          const observarVisibilidade = new IntersectionObserver(
            ([entrada]) => {
              coverVisivel = entrada?.isIntersecting ?? false;
              iniciarLoop();
            },
            { threshold: 0.01 },
          );
          observarVisibilidade.observe(cover);

          const observarEstado = new MutationObserver(iniciarLoop);
          observarEstado.observe(cover, {
            attributes: true,
            attributeFilter: ["class"],
          });
          document.addEventListener("visibilitychange", iniciarLoop);
          iniciarLoop();

          cleanups.push(() => {
            cancelAnimationFrame(raf);
            observarVisibilidade.disconnect();
            observarEstado.disconnect();
            document.removeEventListener("visibilitychange", iniciarLoop);
            ro.disconnect();
            mo.disconnect();
            removeEventListener("resize", marcar);
            q.removeEventListener("input", marcar);
            q.removeEventListener("keyup", marcar);
            q.removeEventListener("click", marcar);
            q.removeEventListener("input", onInputEnergy);
          });
        }
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  if (!pathnameSection) return null;

  const secao = pathnameSection;
  const temSunriseInterno =
    secao === "refugios" || secao === "bairros" || secao === "blog";
  const HomeTagline = pathnameSection === "home" ? "p" : "div";
  const HomeDescription = pathnameSection === "home" ? "h1" : "p";
  const visualAtivo = HERO_NAV.find(({ section }) => section === secao);
  const imagemAtiva =
    visualAtivo?.section === "home"
      ? "/img/home-rio-sunset.png"
      : visualAtivo?.section === "bairros" && destinoBairro
      ? destinoBairro.imagem
      : visualAtivo?.section === "blog" && postBlog
        ? postBlog.imagem
        : visualAtivo?.image;
  const imagensDaTipologia =
    tipologiaCover.slug === tipologiaSlug ? tipologiaCover.images : [];
  const produtoCoverAtivo =
    produtoCover.slug === imovelSlug ? produtoCover : undefined;
  const imagensDoProduto = produtoCoverAtivo?.images ?? [];

  return (
    <div
      className={
        "cover" +
        (secao === "home" ? "" : ` interna ${secao}`) +
        (temSunriseInterno ? " sunrise-interno" : "") +
        (menuAberto ? " menu-aberto" : "")
      }
      ref={coverRef}
    >
      {tipologiaSlug && imagensDaTipologia.length > 0 ? (
        <TipologiaCover images={imagensDaTipologia} />
      ) : visualAtivo?.section === "produto" && imagensDoProduto.length > 0 ? (
        <div
          className={`produto-cover-galeria produto-cover-galeria-${imagensDoProduto.length}`}
          aria-hidden="true"
          key={produtoCoverAtivo?.slug}
        >
          {imagensDoProduto.map((imagem, index) => (
            <Image
              className="cover-foto produto-cover-foto"
              src={imagem}
              alt=""
              fill
              sizes="100vw"
              preload={index === 0}
              loading={index === 0 ? undefined : "lazy"}
              style={{
                animationDelay: `${index * 6}s`,
                animationDuration: `${Math.max(imagensDoProduto.length, 1) * 6}s`,
              }}
              key={`${produtoCoverAtivo?.slug}-${imagem}`}
            />
          ))}
          <div className="produto-cover-indicadores">
            <span>01</span>
            <i />
            <span>{String(imagensDoProduto.length).padStart(2, "0")}</span>
          </div>
        </div>
      ) : visualAtivo?.section === "produto" ? null : visualAtivo && imagemAtiva ? (
        <CoverRouteImage
          src={imagemAtiva}
          kind={visualAtivo.section === "home" ? "home" : "internal"}
          identity={`${visualAtivo.section}-${imagemAtiva}`}
          position={
            visualAtivo.section === "home" ||
            (visualAtivo.section === "bairros" && !destinoBairro) ||
            (visualAtivo.section === "blog" && !postBlog)
              ? "center 62%"
              : "center top"
          }
        />
      ) : null}

      <canvas className="fx" ref={canvasRef} />
      <div className="cover-nevoa" aria-hidden="true" />
      <div className="cover-sombra-interna" aria-hidden="true" />

      <Link
        href="/"
        className="logo"
        aria-label="Rio — página inicial"
        onClick={(event) => aoClicarItem(event, 0)}
      >
        <Image
          className="logo-svg"
          src="/img/logo.svg"
          alt=""
          width={1534}
          height={285}
          preload
        />
      </Link>

      <nav className="menu" aria-label="Principal" ref={menuRef}>
        {/* pílula que desliza até o item ativo */}
        <span
          className="menu-pilula"
          aria-hidden="true"
          style={{
            transform: `translateX(${pilula.left})`,
            width: pilula.width,
            opacity: pilulaPronta && menuAtivoVisivel ? 1 : 0,
            transition: pilulaPronta ? undefined : "none",
          }}
        />
        {HERO_NAV.map((item, i) =>
          item.showInNav === false ? null : (
          <Link
            key={item.label}
            href={item.href}
            className={i === ativo ? "ativo" : undefined}
            aria-current={i === ativo ? "page" : undefined}
            onClick={(event) => aoClicarItem(event, i)}
          >
            {/* duas cópias empilhadas p/ o efeito de "roll" no hover */}
            <span className="roll">
              <span>{item.label}</span>
              <span aria-hidden="true">{item.label}</span>
            </span>
          </Link>
          ),
        )}
      </nav>

      <button
        type="button"
        className={`menu-btn${menuAberto ? " aberto" : ""}`}
        aria-expanded={menuAberto}
        aria-controls="mega-menu"
        onClick={() => setMenuAberto((aberto) => !aberto)}
      >
        <span className={menuAberto ? "menu-escape" : undefined}>
          {menuAberto ? "esc" : "Menu"}
        </span>
        {menuAberto ? (
          <svg
            className="menu-close-icon"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M5 5 19 19M19 5 5 19" />
          </svg>
        ) : (
          <svg
            className="menu-btn-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path className="linha linha-top" d="M4 7H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path className="linha linha-mid" d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path className="linha linha-bot" d="M4 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <div
        id="mega-menu"
        className={`mega-menu${menuAberto ? " aberto" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu completo"
        aria-hidden={!menuAberto}
      >
        <div className="mega-menu-grid">
          <nav className="mega-menu-principal" aria-label="Menu principal">
            <p>Navegue</p>
            {HERO_NAV.map((item, index) =>
              item.showInNav === false ? null : (
                <Link
                  href={item.href}
                  onClick={(event) => {
                    setMenuAberto(false);
                    aoClicarItem(event, index);
                  }}
                  key={item.label}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.label}</strong>
                  <i aria-hidden="true">↗</i>
                </Link>
              ),
            )}
          </nav>

          <div className="mega-menu-coluna">
            <section>
              <p>Explore o Rio</p>
              {MEGA_EXPLORE.map(([label, href]) => (
                <Link
                  href={href}
                  onClick={() => setMenuAberto(false)}
                  key={label}
                >
                  {label} <span>→</span>
                </Link>
              ))}
            </section>

            <section>
              <p>Rio Lançamentos</p>
              {MEGA_INSTITUCIONAL.map(([label, href]) => (
                <Link
                  href={href}
                  onClick={() => setMenuAberto(false)}
                  key={label}
                >
                  {label} <span>→</span>
                </Link>
              ))}
            </section>
          </div>

          <aside className="mega-menu-contato">
            <p>Atendimento pessoal</p>
            <h2>Vamos encontrar seu próximo endereço?</h2>
            <span>
              Conte o que procura. A curadoria organiza bairros, imóveis e
              oportunidades para o seu momento.
            </span>
            <Link href="/contato" onClick={() => setMenuAberto(false)}>
              Começar uma conversa <b>→</b>
            </Link>
            <div>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                Instagram ↗
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noreferrer">
                YouTube ↗
              </a>
            </div>
          </aside>
        </div>

        <div className="mega-menu-rodape">
          <span>CRECI: 9007</span>
          <span>CNPJ: 40.724.844/0001-08</span>
          <Link href="/politica-de-privacidade" onClick={() => setMenuAberto(false)}>
            Privacidade
          </Link>
          <Link href="/termos-de-uso" onClick={() => setMenuAberto(false)}>
            Termos
          </Link>
          <span>© 2026 Rio Lançamentos</span>
        </div>
      </div>

      <div className={"wrap" + (temTexto ? " tem-texto" : "")}>
        <HomeTagline className="titulo">
          <span className="quebra">{palavras("Não existe pôr do sol", 0)}</span>
          <span className="quebra">{palavras("mais bonito que o Rio", 5)}</span>
        </HomeTagline>
        <HomeDescription className="home-descricao">
          Imóveis exclusivos e lançamentos no Rio de Janeiro para morar ou
          investir.
        </HomeDescription>
        <div className="campo">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.25 4.25" />
          </svg>
          <input
            ref={inputRef}
            className="search glass"
            type="text"
            placeholder="Onde deseja morar?"
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setTypingPulse((pulse) => pulse + 1);
            }}
          />
          {typingPulse > 0 && (
            <span
              key={typingPulse}
              className="typing-bloom"
              style={
                {
                  "--typing-x": `${Math.min(88, 5.5 + query.length * 1.7)}%`,
                } as CSSProperties
              }
              aria-hidden="true"
            />
          )}
          <span className="dica" aria-hidden="true">
            Onde deseja morar?
          </span>
          <svg className="contorno" aria-hidden="true">
            <rect className="rastro" x="0" y="0" width="100%" height="100%" rx="10" ry="10" pathLength="100" />
            <rect className="faisca" x="0" y="0" width="100%" height="100%" rx="10" ry="10" pathLength="100" />
          </svg>
        </div>
        <ul className="results" ref={resultsRef}>
          {resultados.map((d, i) => (
            <li
              key={d.nome}
              className="result"
              style={{ animationDelay: Math.min(i * 35, 300) + "ms" }}
            >
              <span>{d.nome}</span>
              <span className="meta">{d.meta}</span>
            </li>
          ))}
          {temTexto && resultados.length === 0 && (
            <li className="empty">Nenhum resultado para &quot;{query.trim()}&quot;</li>
          )}
        </ul>
      </div>

      {HERO_NAV.filter(({ section }) => section !== "home").map((item) => {
        const InternalTitle =
          pathnameSection === item.section ? "h1" : "div";
        const titulo =
          item.section === "bairros" && destinoBairro
            ? destinoBairro.nome
            : item.section === "blog" && postBlog
              ? postBlog.titulo
            : item.section === "produto" && (produtoCoverAtivo?.nome || imovelAtivo)
              ? produtoCoverAtivo?.nome || imovelAtivo!.nome
            : item.section === "construtoras" && construtoraNome
              ? construtoraNome
            : item.title ?? "";
        const descricao =
          item.section === "bairros" && destinoBairro
            ? destinoBairro.descricao
            : item.section === "blog" && postBlog
              ? postBlog.resumo
            : item.section === "produto" &&
                (produtoCoverAtivo?.bairro || imovelAtivo)
              ? `${produtoCoverAtivo?.bairro || imovelAtivo!.bairro} · ${produtoCoverAtivo?.tipologia || imovelAtivo!.tipologia}`
            : item.section === "construtoras" && construtoraNome
              ? `Conheça os imóveis da ${construtoraNome} selecionados pela curadoria Rio Lançamentos.`
            : item.description;

        return (
          <section
            className={`lanc lanc-${item.section}`}
            aria-hidden={secao !== item.section}
            key={item.section}
          >
            <div
              className="lanc-motion"
              key={pathnameSection === item.section ? pathname : item.section}
            >
              <div className="poeira-titulo" aria-hidden="true" />
              <InternalTitle className="lanc-titulo">
                {item.section === "refugios" ? (
                  <>
                    <span className="quebra">
                      {palavras("Refúgios para viver o", 0)}
                    </span>
                    <span className="quebra">
                      {palavras("Rio de Janeiro", 4)}
                    </span>
                  </>
                ) : item.section === "bairros" && !destinoBairro ? (
                  <>
                    <span className="quebra">
                      {palavras("Imóveis nos melhores", 0)}
                    </span>
                    <span className="quebra">
                      {palavras("bairros do Rio", 3)}
                    </span>
                  </>
                ) : item.section === "blog" && !postBlog ? (
                  <>
                    <span className="quebra">
                      {palavras("Arquitetura, mercado", 0)}
                    </span>
                    <span className="quebra">
                      {palavras("e vida no Rio", 2)}
                    </span>
                  </>
                ) : (
                  palavras(titulo, 0)
                )}
              </InternalTitle>
              <p className="lanc-descricao">{descricao}</p>
            </div>
          </section>
        );
      })}
    </div>
  );
}
