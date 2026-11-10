export type BlogArticle = {
  slug: string;
  categoria: string;
  titulo: string;
  resumo: string;
  leitura: string;
  imagem: string;
  alt: string;
  conteudo: readonly {
    titulo: string;
    texto: string;
  }[];
};

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "como-escolher-imovel-alto-padrao-rio",
    categoria: "Curadoria",
    titulo: "Como escolher um imóvel de alto padrão no Rio além da vista.",
    resumo:
      "Arquitetura, incidência de luz, privacidade e relação com o bairro: os critérios que ajudam a reconhecer um endereço realmente especial.",
    leitura: "7 min de leitura",
    imagem: "/img/bairro-ipanema.webp",
    alt: "Rua arborizada em Ipanema com vista para o mar e o Morro Dois Irmãos",
    conteudo: [
      {
        titulo: "A vista é só o começo",
        texto:
          "Um imóvel especial não se sustenta apenas pela paisagem. A relação entre planta, orientação solar, circulação e privacidade determina como aquele endereço será vivido todos os dias.",
      },
      {
        titulo: "Arquitetura que permanece",
        texto:
          "Materiais honestos, proporções equilibradas e soluções coerentes envelhecem melhor do que tendências passageiras. Vale observar tanto a fachada quanto a forma como os ambientes acolhem diferentes momentos da rotina.",
      },
      {
        titulo: "O bairro também faz parte da casa",
        texto:
          "Calçadas, serviços, silêncio, mobilidade e a distância real dos lugares importantes precisam entrar na decisão. No Rio, duas ruas próximas podem oferecer experiências completamente diferentes.",
      },
      {
        titulo: "Escolher com contexto",
        texto:
          "Uma boa curadoria cruza desejo e informação. Visitar em horários distintos, entender o entorno e comparar produtos equivalentes ajuda a reconhecer valor para além da primeira impressão.",
      },
    ],
  },
  {
    slug: "barra-recreio-dois-ritmos",
    categoria: "Bairros",
    titulo: "Barra e Recreio: dois ritmos para viver perto da natureza.",
    resumo:
      "Uma leitura das diferenças de mobilidade, paisagem, serviços e estilo de vida entre os dois bairros.",
    leitura: "5 min de leitura",
    imagem: "/img/barra-orla.webp",
    alt: "Residencial contemporâneo próximo à orla da Barra da Tijuca",
    conteudo: [
      {
        titulo: "Escalas diferentes",
        texto:
          "A Barra combina centralidades, condomínios estruturados e uma oferta ampla de serviços. O Recreio preserva uma sensação mais horizontal e uma relação cotidiana mais direta com a praia e a natureza.",
      },
      {
        titulo: "Mobilidade e rotina",
        texto:
          "Antes de escolher, vale mapear os deslocamentos que realmente importam. Proximidade da escola, do trabalho e dos serviços usados durante a semana pesa mais do que distâncias observadas apenas no mapa.",
      },
      {
        titulo: "Tipologias e espaço",
        texto:
          "Nas duas regiões há apartamentos, gardens, coberturas e casas. A diferença aparece na densidade, no desenho dos condomínios e na forma como áreas livres participam da vida familiar.",
      },
    ],
  },
  {
    slug: "garden-cobertura-ou-casa",
    categoria: "Arquitetura",
    titulo: "Garden, cobertura ou casa: o que realmente muda na rotina?",
    resumo:
      "Mais do que metragem, cada tipologia propõe uma forma diferente de receber, descansar e conviver.",
    leitura: "6 min de leitura",
    imagem: "/img/destaque-jardim-botanico.webp",
    alt: "Casa contemporânea integrada à vegetação do Jardim Botânico",
    conteudo: [
      {
        titulo: "O térreo como extensão da casa",
        texto:
          "O garden aproxima sala, jardim e áreas de convivência. Funciona especialmente bem para quem deseja espaço externo frequente, desde que privacidade, drenagem e insolação tenham sido bem resolvidas.",
      },
      {
        titulo: "A cobertura e o horizonte",
        texto:
          "Coberturas oferecem luz, vista e áreas abertas com maior isolamento. Em contrapartida, manutenção, exposição ao clima e distribuição entre pavimentos precisam ser analisadas com atenção.",
      },
      {
        titulo: "A autonomia de uma casa",
        texto:
          "Casas ampliam liberdade de uso e contato com o terreno, mas trazem decisões próprias de segurança e conservação. A melhor escolha é aquela compatível com a rotina, não apenas com a metragem.",
      },
    ],
  },
  {
    slug: "imovel-para-investir-sinais",
    categoria: "Investimento",
    titulo: "Imóvel para investir: quais sinais observar antes do lançamento?",
    resumo:
      "Localização, vocação do produto e horizonte de demanda em uma análise clara para decisões mais conscientes.",
    leitura: "8 min de leitura",
    imagem: "/img/bairro-botafogo.webp",
    alt: "Enseada de Botafogo com o Pão de Açúcar ao fundo",
    conteudo: [
      {
        titulo: "Vocação antes da promessa",
        texto:
          "Um projeto precisa conversar com a demanda real de sua localização. Tipologia, tamanho, preço e serviços do entorno devem formar uma proposta coerente para moradores ou futuros locatários.",
      },
      {
        titulo: "Oferta comparável",
        texto:
          "Analisar produtos semelhantes lançados e entregues ajuda a entender liquidez e posicionamento. O preço isolado diz pouco sem uma leitura da concorrência e do padrão de acabamento.",
      },
      {
        titulo: "Horizonte de decisão",
        texto:
          "Investimento imobiliário exige clareza de prazo. Renda, valorização e preservação patrimonial respondem a estratégias diferentes e precisam orientar a escolha desde o início.",
      },
    ],
  },
  {
    slug: "luz-natural-arquitetura-carioca",
    categoria: "Arquitetura",
    titulo: "Luz natural: o elemento invisível que transforma uma planta.",
    resumo:
      "Orientação solar, ventilação e profundidade dos ambientes mudam o conforto e a percepção de espaço.",
    leitura: "6 min de leitura",
    imagem: "/img/destaque-leblon.webp",
    alt: "Interior iluminado de apartamento contemporâneo no Rio de Janeiro",
    conteudo: [
      {
        titulo: "Ler a orientação",
        texto:
          "A posição do edifício define a entrada de sol ao longo do dia. Essa informação ajuda a prever temperatura, luminosidade e o uso mais confortável de cada ambiente.",
      },
      {
        titulo: "Ventilação como arquitetura",
        texto:
          "Aberturas em faces diferentes favorecem a ventilação cruzada e reduzem a dependência de climatização. No clima carioca, esse desenho altera profundamente a qualidade da casa.",
      },
      {
        titulo: "Profundidade e proporção",
        texto:
          "Ambientes muito profundos podem perder luz mesmo com grandes janelas. Pé-direito, largura e materiais claros ajudam a distribuir luminosidade sem apagar contrastes.",
      },
    ],
  },
  {
    slug: "ipanema-leblon-onde-morar",
    categoria: "Bairros",
    titulo: "Ipanema ou Leblon: qual endereço acompanha melhor sua rotina?",
    resumo:
      "Dois bairros vizinhos, com atmosferas, fluxos e maneiras distintas de viver a cidade a pé.",
    leitura: "5 min de leitura",
    imagem: "/img/bairro-leblon.webp",
    alt: "Vista urbana e arborizada do Leblon",
    conteudo: [
      {
        titulo: "Vizinhos, não iguais",
        texto:
          "Ipanema tem uma pulsação mais diversa e intensa. O Leblon combina vida de bairro, serviços concentrados e trechos residenciais de atmosfera mais reservada.",
      },
      {
        titulo: "A rua que muda tudo",
        texto:
          "Mais do que escolher um bairro, é preciso escolher uma micro localização. Proximidade da praia, metrô, comércio e vias movimentadas muda silêncio, mobilidade e valor.",
      },
      {
        titulo: "O imóvel e o modo de viver",
        texto:
          "Plantas clássicas, edifícios recentes e projetos boutique coexistem nas duas regiões. A curadoria deve começar pela rotina desejada e só depois chegar ao endereço.",
      },
    ],
  },
  {
    slug: "comprar-na-planta-rio",
    categoria: "Mercado",
    titulo: "Comprar na planta no Rio: um roteiro para analisar o projeto.",
    resumo:
      "Documentação, incorporadora, memorial e cronograma explicados como parte de uma decisão cuidadosa.",
    leitura: "9 min de leitura",
    imagem: "/img/lancamentos.webp",
    alt: "Fachada arquitetônica de novo empreendimento no Rio de Janeiro",
    conteudo: [
      {
        titulo: "Comece pela incorporação",
        texto:
          "Entender responsáveis, registros e histórico de entrega cria uma base objetiva para a análise. Materiais comerciais devem ser lidos junto aos documentos do projeto.",
      },
      {
        titulo: "Memorial e planta",
        texto:
          "O memorial descreve materiais e sistemas; a planta revela proporções e fluxos. Os dois precisam ser avaliados em conjunto para transformar promessa em expectativa concreta.",
      },
      {
        titulo: "Prazo e estratégia",
        texto:
          "Cronograma financeiro, horizonte de entrega e objetivo da compra devem estar alinhados. Uma oportunidade só faz sentido quando cabe no planejamento do comprador.",
      },
    ],
  },
  {
    slug: "paisagismo-condominios-rio",
    categoria: "Paisagismo",
    titulo: "Quando o paisagismo deixa de ser cenário e passa a ser arquitetura.",
    resumo:
      "Áreas verdes bem desenhadas organizam percursos, criam privacidade e melhoram o microclima.",
    leitura: "6 min de leitura",
    imagem: "/img/colecao-ilha-pura.webp",
    alt: "Paisagismo amplo em condomínio residencial carioca",
    conteudo: [
      {
        titulo: "Paisagem em uso",
        texto:
          "Um bom jardim não existe apenas para ser observado. Ele desenha caminhos, cria áreas de permanência e estabelece transições entre espaços coletivos e privados.",
      },
      {
        titulo: "Conforto climático",
        texto:
          "Sombra, permeabilidade e vegetação adequada ajudam a controlar temperatura e umidade. O resultado aparece tanto no conforto quanto na identidade do empreendimento.",
      },
      {
        titulo: "Tempo como matéria",
        texto:
          "Paisagismo amadurece. Espécies, manutenção e espaço para crescimento precisam ser previstos para que o conjunto se torne mais interessante com o passar dos anos.",
      },
    ],
  },
  {
    slug: "refugios-natureza-rio",
    categoria: "Refúgios",
    titulo: "Morar perto da natureza sem sair do Rio.",
    resumo:
      "Joá, Itanhangá, Alto da Boa Vista e Vargem Grande oferecem outros ritmos dentro da cidade.",
    leitura: "7 min de leitura",
    imagem: "/img/barra-itanhanga.webp",
    alt: "Casa contemporânea cercada pela Mata Atlântica no Rio",
    conteudo: [
      {
        titulo: "Outra relação com o tempo",
        texto:
          "Endereços cercados pelo verde propõem silêncio, privacidade e maior contato com áreas externas. Essa escolha também pede uma leitura realista dos deslocamentos cotidianos.",
      },
      {
        titulo: "Arquitetura e terreno",
        texto:
          "Topografia, vegetação e orientação deixam de ser contexto e passam a comandar o projeto. Casas bem implantadas preservam vistas e reduzem intervenções desnecessárias.",
      },
      {
        titulo: "Infraestrutura invisível",
        texto:
          "Acesso, segurança, drenagem e manutenção são decisivos em propriedades maiores. O encanto da paisagem precisa vir acompanhado de uma avaliação técnica consistente.",
      },
    ],
  },
  {
    slug: "valor-metro-quadrado-nao-basta",
    categoria: "Investimento",
    titulo: "Por que o valor do metro quadrado não conta a história inteira.",
    resumo:
      "Andar, vista, planta, conservação e liquidez explicam diferenças que uma média não consegue mostrar.",
    leitura: "8 min de leitura",
    imagem: "/img/alto-padrao.webp",
    alt: "Edifício residencial de alto padrão no Rio de Janeiro",
    conteudo: [
      {
        titulo: "Médias escondem singularidades",
        texto:
          "Dois imóveis no mesmo edifício podem ter valores diferentes por posição, reforma, ruído e vista. O metro quadrado é uma referência, não uma conclusão.",
      },
      {
        titulo: "Planta útil e área anunciada",
        texto:
          "Eficiência de circulação e proporção dos ambientes alteram o valor percebido. Uma área menor bem resolvida pode funcionar melhor do que uma metragem maior fragmentada.",
      },
      {
        titulo: "Liquidez também é valor",
        texto:
          "Produtos fáceis de compreender e alinhados à demanda local tendem a circular melhor. Comparar tempo de oferta e perfil do público amplia a análise de preço.",
      },
    ],
  },
];

export function encontrarPost(slug: string) {
  return BLOG_ARTICLES.find((article) => article.slug === slug);
}
