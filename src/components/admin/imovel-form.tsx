"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowLeftIcon, CalendarDaysIcon, Clock3Icon, FilePenLineIcon, MoreHorizontalIcon, SendIcon, UserRoundIcon } from "lucide-react";
import {
  createImovelDraft,
  type ImovelFormState,
  updateImovelDraft,
} from "@/app/painel/actions";
import { AddressFields, type AddressValues } from "@/components/admin/address-fields";
import { AdminSlugField } from "@/components/admin/admin-slug-field";
import { CurrencyInput } from "@/components/admin/currency-input";
import { IncorporadoraCombobox } from "@/components/admin/incorporadora-combobox";
import { MediaMultiSelect } from "@/components/admin/media-multi-select";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SegmentedSelect } from "@/components/admin/segmented-select";
import { SmartPropertyCall } from "@/components/admin/smart-property-call";
import { PriceTableEditor } from "@/components/admin/price-table-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialState: ImovelFormState = {};

export type ImovelFormValues = AddressValues & {
  nome: string;
  slug: string;
  categoria: "Lançamento" | "Alto padrão";
  segmento: "imovel" | "refugio";
  incorporadora: string;
  tipoImovel: string;
  quartos: string;
  garagem: string;
  banheiros: string;
  suites: string;
  metragem: string;
  terreno: string;
  chamada: string;
  descricao: string;
  valor: string;
  tabelaPreco: string;
  galeria: string[];
  plantas: string[];
};

export type PublicationMetadata = {
  author: string;
  publishedAt?: string;
  updatedAt?: string;
};

function formatPublicationDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function PublicationActions() {
  const { pending } = useFormStatus();
  return (
    <div className="flex gap-2">
      <Button className="h-11 flex-1" disabled={pending} name="intent" type="submit" value="publish">
        <SendIcon /> {pending ? "Salvando…" : "Publicar"}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Mais opções de publicação" className="size-11 shrink-0" disabled={pending} size="icon" type="button" variant="secondary">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="admin-theme dark min-w-52">
          <DropdownMenuItem asChild>
            <button className="w-full" form="imovel-form" name="intent" type="submit" value="draft">
              <FilePenLineIcon /> Salvar rascunho
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ErrorMessage({ messages }: { messages?: string[] }) {
  return messages?.[0] ? <p className="text-xs text-destructive">{messages[0]}</p> : null;
}

function categoryFromValue(value = "") {
  const numericValue = Number(value.replace(/[^\d,]/g, "").replace(",", "."));
  return numericValue > 5_000_000 ? "Alto padrão" : "Lançamento";
}

export function ImovelForm({
  editId,
  incorporadoras = [],
  publication,
  segmento = "imovel",
  values,
}: {
  editId?: string;
  incorporadoras?: string[];
  publication: PublicationMetadata;
  segmento?: "imovel" | "refugio";
  values?: ImovelFormValues;
}) {
  const activeSegment = values?.segmento ?? segmento;
  const [category, setCategory] = useState<"Lançamento" | "Alto padrão">(
    activeSegment === "imovel" ? categoryFromValue(values?.valor) : "Lançamento",
  );
  const formAction = editId ? updateImovelDraft.bind(null, editId) : createImovelDraft;
  const [state, action] = useActionState(formAction, initialState);

  return (
    <form action={action} id="imovel-form">
      <input name="categoria" type="hidden" value={category} />
      <input name="segmento" type="hidden" value={activeSegment} />
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <Card className="min-w-0">
          <Tabs defaultValue="principal">
            <CardHeader className="border-b pb-4">
              <TabsList className="h-10 w-full justify-start overflow-x-auto rounded-xl bg-muted/60 p-1">
                <TabsTrigger className="h-full min-w-max rounded-lg px-4 py-0 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm dark:data-active:bg-primary dark:data-active:text-primary-foreground" value="principal">Principal</TabsTrigger>
                <TabsTrigger className="h-full min-w-max rounded-lg px-4 py-0 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm dark:data-active:bg-primary dark:data-active:text-primary-foreground" value="endereco">Endereço</TabsTrigger>
                <TabsTrigger className="h-full min-w-max rounded-lg px-4 py-0 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm dark:data-active:bg-primary dark:data-active:text-primary-foreground" value="texto">Texto</TabsTrigger>
                <TabsTrigger className="h-full min-w-max rounded-lg px-4 py-0 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm dark:data-active:bg-primary dark:data-active:text-primary-foreground" value="valor">Valor</TabsTrigger>
                <TabsTrigger className="h-full min-w-max rounded-lg px-4 py-0 data-active:bg-primary data-active:text-primary-foreground data-active:shadow-sm dark:data-active:bg-primary dark:data-active:text-primary-foreground" value="midia">Mídia</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="pt-2">
              <TabsContent className="space-y-7 data-[state=inactive]:hidden" forceMount value="principal">
                <Field>
                  <FieldLabel htmlFor="nome">Nome do imóvel</FieldLabel>
                  <Input defaultValue={values?.nome} id="nome" name="nome" required />
                  <ErrorMessage messages={state.fields?.nome} />
                </Field>

                <div className={activeSegment === "refugio"
                  ? "grid gap-5 md:grid-cols-2 2xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(9rem,0.55fr)_minmax(9rem,0.55fr)]"
                  : "grid gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(10rem,0.55fr)]"}>
                  <Field>
                    <FieldLabel>Incorporadora</FieldLabel>
                    <IncorporadoraCombobox defaultValue={values?.incorporadora} options={incorporadoras} />
                    <ErrorMessage messages={state.fields?.incorporadora} />
                  </Field>
                  <Field>
                    <FieldLabel>Tipologia</FieldLabel>
                    <Select defaultValue={values?.tipoImovel || undefined} name="tipoImovel">
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Selecionar tipologia" />
                      </SelectTrigger>
                      <SelectContent className="admin-theme dark">
                        <SelectItem value="Apartamento">Apartamento</SelectItem>
                        <SelectItem value="Casa">Casa</SelectItem>
                        <SelectItem value="Garden">Garden</SelectItem>
                        <SelectItem value="Studio">Studio</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage messages={state.fields?.tipoImovel} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="metragem">Metragem</FieldLabel>
                    <InputGroup>
                      <InputGroupInput defaultValue={values?.metragem} id="metragem" inputMode="decimal" name="metragem" required />
                      <InputGroupAddon align="inline-end"><InputGroupText>m²</InputGroupText></InputGroupAddon>
                    </InputGroup>
                    <ErrorMessage messages={state.fields?.metragem} />
                  </Field>
                  {activeSegment === "refugio" ? (
                    <Field>
                      <FieldLabel htmlFor="terreno">Terreno</FieldLabel>
                      <InputGroup>
                        <InputGroupInput defaultValue={values?.terreno} id="terreno" inputMode="decimal" name="terreno" />
                        <InputGroupAddon align="inline-end"><InputGroupText>m²</InputGroupText></InputGroupAddon>
                      </InputGroup>
                      <ErrorMessage messages={state.fields?.terreno} />
                    </Field>
                  ) : <input name="terreno" type="hidden" value="" />}
                </div>

                <div className="grid gap-7 sm:grid-cols-2 2xl:grid-cols-4">
                  <Field>
                    <FieldLabel>Quarto</FieldLabel>
                    <SegmentedSelect defaultValue={values?.quartos} name="quartos" />
                  </Field>
                  <Field>
                    <FieldLabel>Garagem</FieldLabel>
                    <SegmentedSelect defaultValue={values?.garagem} name="garagem" />
                  </Field>
                  <Field>
                    <FieldLabel>Banheiro</FieldLabel>
                    <SegmentedSelect defaultValue={values?.banheiros} name="banheiros" />
                  </Field>
                  <Field>
                    <FieldLabel>Suíte</FieldLabel>
                    <SegmentedSelect defaultValue={values?.suites} name="suites" />
                  </Field>
                </div>
              </TabsContent>

              <TabsContent className="data-[state=inactive]:hidden" forceMount value="endereco">
                <AddressFields values={values} />
                <ErrorMessage messages={state.fields?.cep} />
              </TabsContent>

              <TabsContent className="space-y-6 data-[state=inactive]:hidden" forceMount value="texto">
                <Field>
                  <FieldLabel htmlFor="chamada">Chamada</FieldLabel>
                  <SmartPropertyCall defaultValue={values?.chamada} />
                  <ErrorMessage messages={state.fields?.chamada} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="descricao">Texto completo</FieldLabel>
                  <RichTextEditor defaultValue={values?.descricao} name="descricao" />
                  <ErrorMessage messages={state.fields?.descricao} />
                </Field>
              </TabsContent>

              <TabsContent className="space-y-6 data-[state=inactive]:hidden" forceMount value="valor">
                <Field className="w-full md:w-1/2">
                  <FieldLabel htmlFor="valor">Valor do produto</FieldLabel>
                  <CurrencyInput
                    defaultValue={values?.valor}
                    onValueChange={(value) => {
                      if (activeSegment === "imovel") setCategory(categoryFromValue(value));
                    }}
                  />
                  <ErrorMessage messages={state.fields?.valor} />
                </Field>
                <Field>
                  <FieldLabel>Tabela de preço</FieldLabel>
                  <PriceTableEditor defaultValue={values?.tabelaPreco} />
                </Field>
              </TabsContent>

              <TabsContent className="space-y-8 data-[state=inactive]:hidden" forceMount value="midia">
                <Field>
                  <FieldLabel>Galeria de imagens</FieldLabel>
                  <MediaMultiSelect defaultValue={values?.galeria} label="Adicionar imagens" name="galeria" />
                </Field>
                <Field>
                  <FieldLabel>Plantas</FieldLabel>
                  <MediaMultiSelect defaultValue={values?.plantas} label="Adicionar plantas" name="plantas" />
                </Field>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <aside className="space-y-4 xl:sticky xl:top-5">
          <Card>
            <CardHeader><CardTitle>Slug</CardTitle></CardHeader>
            <CardContent>
              <AdminSlugField
                defaultValue={values?.slug}
              />
              <ErrorMessage messages={state.fields?.slug} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Publicação</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="divide-y divide-border rounded-xl border border-border bg-muted/20 text-sm">
                <div className="flex items-start gap-3 px-3 py-3">
                  <UserRoundIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div><p className="text-xs text-muted-foreground">Autor</p><p className="mt-0.5 font-medium text-foreground">{publication.author}</p></div>
                </div>
                {publication.publishedAt ? (
                  <div className="flex items-start gap-3 px-3 py-3">
                    <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div><p className="text-xs text-muted-foreground">Publicado em</p><p className="mt-0.5 font-medium text-foreground">{formatPublicationDate(publication.publishedAt)}</p></div>
                  </div>
                ) : null}
                {publication.publishedAt && publication.updatedAt ? (
                  <div className="flex items-start gap-3 px-3 py-3">
                    <Clock3Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div><p className="text-xs text-muted-foreground">Atualizado em</p><p className="mt-0.5 font-medium text-foreground">{formatPublicationDate(publication.updatedAt)}</p></div>
                  </div>
                ) : null}
              </div>

              {state.error ? (
                <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                  {state.error}
                </p>
              ) : null}

              <PublicationActions />
              <Button asChild className="w-full" variant="ghost">
                <Link href={`/painel/${activeSegment === "refugio" ? "refugios" : "imoveis"}`}><ArrowLeftIcon /> Cancelar</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </form>
  );
}
