"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { REGIOES_DO_RIO } from "@/lib/regioes";
import { gerarChamadaImovel } from "@/lib/property-call";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  createAdminSessionToken,
  requireAdmin,
  requireAdminMaster,
} from "@/lib/admin-auth";
import { addAdminAccess, authenticateAdminAccess, updateAdminAccess } from "@/lib/admin-access-store";
import {
  type AdminImovelDraft,
  addAdminImovelDraft,
  removeAdminImovelDraft,
  saveAdminImovelDraft,
} from "@/lib/admin-imoveis-store";
import { addAdminPost, saveAdminPost } from "@/lib/admin-posts-store";
import { addAdminBairro, saveAdminBairro } from "@/lib/admin-bairros-store";
import { addAdminIncorporador, saveAdminIncorporador } from "@/lib/admin-incorporadores-store";
import { saveFavoritePropertyIds } from "@/lib/admin-favorites-store";

export type LoginState = { error?: string };

export async function loginAdmin(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const access = authenticateAdminAccess(email, password);
  if (!access) {
    return { error: "E-mail ou senha inválidos." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, createAdminSessionToken(access), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/painel",
    maxAge: ADMIN_SESSION_SECONDS,
  });
  redirect("/painel");
}

const accessSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome."),
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().optional().default(""),
  role: z.enum(["master", "admin"]),
  active: z.boolean(),
});

function accessData(formData: FormData) {
  return { name: formData.get("name"), email: formData.get("email"), password: formData.get("password") ?? "", role: formData.get("role"), active: formData.get("active") === "true" };
}

export type AccessFormState = { error?: string; fields?: Record<string, string[]> };

export async function createAccess(_state: AccessFormState, formData: FormData): Promise<AccessFormState> {
  await requireAdminMaster();
  const parsed = accessSchema.extend({ password: z.string().min(8, "Use ao menos 8 caracteres.") }).safeParse(accessData(formData));
  if (!parsed.success) return { error: "Revise os campos destacados.", fields: parsed.error.flatten().fieldErrors };
  try { addAdminAccess(parsed.data); } catch { return { error: "Não foi possível salvar. Verifique se o e-mail já está cadastrado." }; }
  revalidatePath("/painel/acessos");
  redirect("/painel/acessos?criado=1");
}

export async function updateAccess(id: string, _state: AccessFormState, formData: FormData): Promise<AccessFormState> {
  await requireAdminMaster();
  const parsed = accessSchema.refine((data) => !data.password || data.password.length >= 8, { path: ["password"], message: "Use ao menos 8 caracteres." }).safeParse(accessData(formData));
  if (!parsed.success) return { error: "Revise os campos destacados.", fields: parsed.error.flatten().fieldErrors };
  try { updateAdminAccess(id, parsed.data); } catch (error) { return { error: error instanceof Error ? error.message : "Não foi possível atualizar o acesso." }; }
  revalidatePath("/painel/acessos");
  redirect("/painel/acessos?atualizado=1");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/painel",
    maxAge: 0,
  });
  redirect("/painel/login");
}

const imovelSchema = z.object({
  nome: z.string().trim().min(3, "Informe o nome do imóvel."),
  slug: z.string().trim().optional().default(""),
  categoria: z.enum(["Lançamento", "Alto padrão"]),
  segmento: z.enum(["imovel", "refugio"]),
  incorporadora: z.string().trim().optional().default(""),
  tipoImovel: z.enum(["", "Apartamento", "Casa", "Garden", "Studio"]),
  quartos: z.enum(["", "1", "2", "3", "4", "5+"]),
  garagem: z.enum(["", "1", "2", "3", "4", "5+"]),
  banheiros: z.enum(["", "1", "2", "3", "4", "5+"]),
  suites: z.enum(["", "1", "2", "3", "4", "5+"]),
  metragem: z.string().trim().min(1, "Informe a metragem."),
  terreno: z.string().trim().optional().default(""),
  cep: z.string().trim().min(8, "Informe o CEP."),
  logradouro: z.string().trim().min(3, "Informe o logradouro."),
  numero: z.string().trim().min(1, "Informe o número."),
  complemento: z.string().trim().optional().default(""),
  bairro: z.string().trim().min(2, "Informe o bairro."),
  cidade: z.string().trim().min(2, "Informe a cidade."),
  latitude: z.string().trim().optional().default(""),
  longitude: z.string().trim().optional().default(""),
  chamada: z.string().trim().optional().default(""),
  descricao: z.string().trim().refine(
    (value) => value.replace(/<[^>]*>/g, "").trim().length >= 20,
    "O texto completo deve ter pelo menos 20 caracteres.",
  ),
  valor: z.string().trim().transform((value) => value || "Sob consulta"),
  tabelaPreco: z.string().trim().optional().default(""),
  galeria: z.string().transform(parseMediaList),
  plantas: z.string().transform(parseMediaList),
});

function parseMediaList(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function imovelData(formData: FormData) {
  return {
    nome: formData.get("nome"),
    slug: formData.get("slug"),
    categoria: formData.get("categoria"),
    segmento: formData.get("segmento"),
    incorporadora: formData.get("incorporadora"),
    tipoImovel: formData.get("tipoImovel") ?? "",
    quartos: formData.get("quartos"),
    garagem: formData.get("garagem"),
    banheiros: formData.get("banheiros"),
    suites: formData.get("suites"),
    metragem: formData.get("metragem"),
    terreno: formData.get("terreno"),
    cep: formData.get("cep"),
    logradouro: formData.get("logradouro"),
    numero: formData.get("numero"),
    complemento: formData.get("complemento"),
    bairro: formData.get("bairro"),
    cidade: formData.get("cidade"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    chamada: formData.get("chamada"),
    descricao: formData.get("descricao"),
    valor: formData.get("valor"),
    tabelaPreco: formData.get("tabelaPreco"),
    galeria: formData.get("galeria"),
    plantas: formData.get("plantas"),
  };
}

function publicationStatus(formData: FormData): AdminImovelDraft["status"] {
  const intent = formData.get("intent");
  if (intent === "publish") return "Publicado";
  if (intent === "schedule") return "Agendado";
  return "Rascunho";
}

function draftInput(data: z.infer<typeof imovelSchema>) {
  const numericValue = Number(
    data.valor.replace(/[^\d,]/g, "").replace(",", "."),
  );
  const tipologia = [
    data.tipoImovel,
    data.quartos
      ? data.quartos === "5+"
        ? "5 ou mais quartos"
        : `${data.quartos} quartos`
      : "",
    data.suites
      ? data.suites === "5+"
        ? "5 ou mais suítes"
        : `${data.suites} suíte${data.suites === "1" ? "" : "s"}`
      : "",
    `${data.metragem} m²`,
  ].filter(Boolean).join(" · ");
  return {
    ...data,
    chamada: gerarChamadaImovel(data),
    categoria: data.segmento === "imovel" && numericValue > 5_000_000
      ? "Alto padrão" as const
      : "Lançamento" as const,
    incorporadora: data.incorporadora || "Não definida",
    tipologia,
    endereco: [data.logradouro, data.numero, data.complemento, data.bairro, data.cidade]
      .filter(Boolean)
      .join(", "),
  };
}

export type ImovelFormState = {
  error?: string;
  fields?: Record<string, string[]>;
};

export async function createImovelDraft(
  _previousState: ImovelFormState,
  formData: FormData,
): Promise<ImovelFormState> {
  await requireAdmin();

  const parsed = imovelSchema.safeParse(imovelData(formData));

  if (!parsed.success) {
    return {
      error: "Revise os campos destacados.",
      fields: parsed.error.flatten().fieldErrors,
    };
  }

  const status = publicationStatus(formData);
  await addAdminImovelDraft(draftInput(parsed.data), status);
  const section = parsed.data.segmento === "refugio" ? "refugios" : "imoveis";
  revalidatePath(`/painel/${section}`);
  redirect(`/painel/${section}?criado=${status.toLocaleLowerCase("pt-BR")}`);
}

export async function deleteImovelDraft(id: string) {
  await requireAdmin();
  await removeAdminImovelDraft(id);
  revalidatePath("/painel/imoveis");
}

export async function updateImovelDraft(
  referenceId: string,
  _previousState: ImovelFormState,
  formData: FormData,
): Promise<ImovelFormState> {
  await requireAdmin();

  const parsed = imovelSchema.safeParse(imovelData(formData));

  if (!parsed.success) {
    return {
      error: "Revise os campos destacados.",
      fields: parsed.error.flatten().fieldErrors,
    };
  }

  const status = publicationStatus(formData);
  await saveAdminImovelDraft(referenceId, draftInput(parsed.data), status);
  const section = parsed.data.segmento === "refugio" ? "refugios" : "imoveis";
  revalidatePath(`/painel/${section}`);
  redirect(`/painel/${section}?atualizado=${status.toLocaleLowerCase("pt-BR")}`);
}

const postSchema = z.object({
  titulo: z.string().trim().min(3, "Informe o título."),
  subtitulo: z.string().trim().min(3, "Informe o subtítulo."),
  imagemCapa: z.string()
    .transform((value) => parseMediaList(value)[0] ?? "")
    .pipe(z.string().min(1, "Adicione uma imagem de capa.")),
  texto: z.string().trim().refine(
    (value) => value.replace(/<[^>]*>/g, "").trim().length >= 20,
    "O texto deve ter pelo menos 20 caracteres.",
  ),
  categoria: z.enum(["Bairros", "Arquitetura", "Imóveis", "Investimento"]),
});

function postData(formData: FormData) {
  return {
    titulo: formData.get("titulo"),
    subtitulo: formData.get("subtitulo"),
    imagemCapa: formData.get("imagemCapa"),
    texto: formData.get("texto"),
    categoria: formData.get("categoria"),
  };
}

export type PostFormState = {
  error?: string;
  fields?: Record<string, string[]>;
};

export async function createPost(
  _previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await requireAdmin();
  const parsed = postSchema.safeParse(postData(formData));
  if (!parsed.success) {
    return { error: "Revise os campos destacados.", fields: parsed.error.flatten().fieldErrors };
  }
  const status = formData.get("intent") === "publish" ? "Publicado" : "Rascunho";
  await addAdminPost(parsed.data, status);
  revalidatePath("/painel/posts");
  redirect(`/painel/posts?criado=${status.toLocaleLowerCase("pt-BR")}`);
}

export async function updatePost(
  id: string,
  _previousState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await requireAdmin();
  const parsed = postSchema.safeParse(postData(formData));
  if (!parsed.success) {
    return { error: "Revise os campos destacados.", fields: parsed.error.flatten().fieldErrors };
  }
  const status = formData.get("intent") === "publish" ? "Publicado" : "Rascunho";
  await saveAdminPost(id, parsed.data, status);
  revalidatePath("/painel/posts");
  redirect(`/painel/posts?atualizado=${status.toLocaleLowerCase("pt-BR")}`);
}

const bairroSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome do bairro."),
  slug: z.string().trim().optional().default(""),
  regiao: z.enum(REGIOES_DO_RIO),
  imagem: z.string()
    .transform((value) => parseMediaList(value)[0] ?? "")
    .pipe(z.string().min(1, "Adicione uma imagem do bairro.")),
  textoCurto: z.string().trim().min(10, "O texto curto deve ter pelo menos 10 caracteres."),
  texto: z.string().trim().refine(
    (value) => value.replace(/<[^>]*>/g, "").trim().length >= 20,
    "O texto deve ter pelo menos 20 caracteres.",
  ),
});

function bairroData(formData: FormData) {
  return {
    nome: formData.get("nome"),
    slug: formData.get("slug"),
    regiao: formData.get("regiao"),
    imagem: formData.get("imagem"),
    textoCurto: formData.get("textoCurto"),
    texto: formData.get("texto"),
  };
}

export type BairroFormState = {
  error?: string;
  fields?: Record<string, string[]>;
};

export async function createBairro(
  _previousState: BairroFormState,
  formData: FormData,
): Promise<BairroFormState> {
  await requireAdmin();
  const parsed = bairroSchema.safeParse(bairroData(formData));
  if (!parsed.success) {
    return { error: "Revise os campos destacados.", fields: parsed.error.flatten().fieldErrors };
  }
  const status = formData.get("intent") === "publish" ? "Publicado" : "Rascunho";
  await addAdminBairro(parsed.data, status);
  revalidatePath("/painel/bairros");
  redirect(`/painel/bairros?criado=${status.toLocaleLowerCase("pt-BR")}`);
}

export async function updateBairro(
  id: string,
  _previousState: BairroFormState,
  formData: FormData,
): Promise<BairroFormState> {
  await requireAdmin();
  const parsed = bairroSchema.safeParse(bairroData(formData));
  if (!parsed.success) {
    return { error: "Revise os campos destacados.", fields: parsed.error.flatten().fieldErrors };
  }
  const status = formData.get("intent") === "publish" ? "Publicado" : "Rascunho";
  await saveAdminBairro(id, parsed.data, status);
  revalidatePath("/painel/bairros");
  redirect(`/painel/bairros?atualizado=${status.toLocaleLowerCase("pt-BR")}`);
}

const incorporadorSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome do incorporador."),
  descricao: z.string().trim().min(10, "A descrição deve ter pelo menos 10 caracteres."),
});

function incorporadorData(formData: FormData) {
  return { nome: formData.get("nome"), descricao: formData.get("descricao") };
}

export type IncorporadorFormState = {
  error?: string;
  fields?: Record<string, string[]>;
};

export async function createIncorporador(
  _previousState: IncorporadorFormState,
  formData: FormData,
): Promise<IncorporadorFormState> {
  await requireAdmin();
  const parsed = incorporadorSchema.safeParse(incorporadorData(formData));
  if (!parsed.success) {
    return { error: "Revise os campos destacados.", fields: parsed.error.flatten().fieldErrors };
  }
  const status = formData.get("intent") === "publish" ? "Publicado" : "Rascunho";
  await addAdminIncorporador(parsed.data, status);
  revalidatePath("/painel/incorporadores");
  revalidatePath("/painel/imoveis");
  revalidatePath("/painel/refugios");
  redirect(`/painel/incorporadores?criado=${status.toLocaleLowerCase("pt-BR")}`);
}

export async function updateIncorporador(
  id: string,
  _previousState: IncorporadorFormState,
  formData: FormData,
): Promise<IncorporadorFormState> {
  await requireAdmin();
  const parsed = incorporadorSchema.safeParse(incorporadorData(formData));
  if (!parsed.success) {
    return { error: "Revise os campos destacados.", fields: parsed.error.flatten().fieldErrors };
  }
  const status = formData.get("intent") === "publish" ? "Publicado" : "Rascunho";
  await saveAdminIncorporador(id, parsed.data, status);
  revalidatePath("/painel/incorporadores");
  revalidatePath("/painel/imoveis");
  revalidatePath("/painel/refugios");
  redirect(`/painel/incorporadores?atualizado=${status.toLocaleLowerCase("pt-BR")}`);
}

export type FavoritesFormState = { error?: string; success?: boolean };

export async function saveFavorites(
  _previousState: FavoritesFormState,
  formData: FormData,
): Promise<FavoritesFormState> {
  await requireAdmin();
  const ids = Array.from({ length: 6 }, (_, index) =>
    String(formData.get(`favorite_${index + 1}`) ?? ""),
  );
  if (ids.some((id) => !id) || new Set(ids).size !== 6) {
    return { error: "Selecione seis produtos diferentes." };
  }
  try {
    await saveFavoritePropertyIds(ids);
  } catch {
    return { error: "Não foi possível salvar. Revise os produtos selecionados." };
  }
  revalidatePath("/painel/favoritos");
  revalidatePath("/");
  return { success: true };
}
