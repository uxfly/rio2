> V2 — site preto em Next.js. Código-fonte; configure as variáveis de ambiente antes de executar. Dados do banco e arquivos locais não estão incluídos.

# Rio Imóveis

Site do mercado imobiliário de alto padrão no Rio de Janeiro + painel de gestão.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Nunito** via `next/font` (auto-hospedada)
- **Lenis** — scroll suave
- **WebGL** — hero "sunrise" (shader próprio) + câmera Ken Burns na foto de fundo
- Planejado: **Supabase**, **shadcn/ui**, **Mapbox**, **Vercel**

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
```

Outros: `npm run build` (produção), `npm run lint`, `npx tsc --noEmit` (typecheck).

## Estrutura

```
src/
  app/
    layout.tsx      # fonte Nunito, metadados/SEO, lang pt-BR
    page.tsx        # renderiza <Hero/>
    globals.css     # Tailwind + CSS do hero (global — ver nota abaixo)
  components/
    Hero.tsx        # hero client: WebGL sunrise, câmera, cursor, Lenis, busca
  lib/
    lugares.ts      # dados PLACEHOLDER da busca (trocar por imóveis do Supabase)
public/
  img/cover.jpg     # foto do Rio (fundo do hero)
  fonts/            # Nunito/Mulish/Akkurat (Nunito é a em uso)
_legacy/            # versão estática original (HTML/WebGL) — só referência
```

### Notas de arquitetura (dívidas conhecidas)

- **CSS do hero é global** (não CSS Module) de propósito: o WebGL e o cursor
  leem os nós via `getComputedStyle`/`classList`, e nomes de classe com hash
  quebrariam isso. Ao criar o painel, isolar o CSS do hero por rota.
- **`html { font-size: 75% }`** deixa `1rem = 12px` (base do design do hero).
  Isso encolhe componentes do shadcn (que usam rem) — dar ao painel seu próprio
  contexto de base (ex.: layout do `/painel` com `font-size: 16px`).

---

## TODO — próximos passos (a fazer depois)

Decisões já tomadas: **Supabase** (dados/auth/storage), painel de **imóveis
(CRUD + fotos)**, **shadcn/ui** no painel (tudo branco), deploy na **Vercel**.

### 1. Supabase
- [ ] Criar projeto no Supabase; guardar URL e anon key em `.env.local`
      (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- [ ] Instalar `@supabase/supabase-js` e `@supabase/ssr`; criar clients
      server/browser em `src/lib/supabase/`.
- [ ] Tabela `imoveis`: id, titulo, slug, descricao, bairro, tipo
      (apartamento/casa/cobertura…), finalidade (venda/locacao), preco,
      area_m2, quartos, suites, vagas, endereco, lat, lng, destaque (bool),
      status (rascunho/publicado), created_at, updated_at.
- [ ] Tabela `imovel_fotos` (id, imovel_id, url, ordem, capa) OU array de urls.
- [ ] Storage bucket `imoveis` para as fotos + políticas (RLS): leitura
      pública, escrita só autenticado.
- [ ] RLS nas tabelas: leitura pública dos `publicado`; escrita só autenticado.

### 2. Painel (`/painel`) — shadcn, branco
- [ ] `npx shadcn@latest init` + componentes (button, input, table, dialog,
      form, sonner, dropdown-menu, card, badge, sidebar).
- [ ] Auth do painel (Supabase Auth): tela de login, middleware protegendo
      `/painel/*`.
- [ ] Listagem de imóveis (tabela) com busca/filtro/paginação.
- [ ] Form de criar/editar imóvel (react-hook-form + zod) com upload de fotos
      (arrastar-e-soltar, reordenar, definir capa) para o Storage.
- [ ] Publicar/despublicar; excluir (com confirmação).
- [ ] Resolver a base de fonte do painel (ver dívida do `font-size: 75%`).

### 3. Site público
- [ ] Ligar a busca do hero aos imóveis reais (hoje usa `src/lib/lugares.ts`).
- [ ] Página de listagem `/imoveis` com filtros (bairro, preço, quartos…).
- [ ] Página do imóvel `/imoveis/[slug]` (galeria, mapa Mapbox, contato) com
      SSG/ISR e metadados/JSON-LD para SEO.
- [ ] Páginas de bairros `/bairros/[bairro]`; blog `/blog`; contato.
- [ ] `next/image` em todas as fotos; sitemap; Open Graph por imóvel.

### 4. Extras
- [ ] Mapbox (localização do imóvel e mapa de bairros).
- [ ] Formulário de contato/lead → tabela `leads` + notificação.
- [ ] Deploy na Vercel (env vars do Supabase; domínio).
# Persistência do catálogo

O painel usa SQLite e armazenamento local de mídia. Em produção, configure
`RIO_STORAGE_DIR` para um diretório persistente fora da pasta de cada deploy,
por exemplo `/var/lib/rio`. O diretório contém `rio.sqlite` e a pasta `media/`;
ambos devem entrar na rotina de backup do servidor.
