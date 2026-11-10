"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowLeftIcon, CalendarDaysIcon, Clock3Icon, FilePenLineIcon, MoreHorizontalIcon, SendIcon, UserRoundIcon } from "lucide-react";
import { createBairro, type BairroFormState, updateBairro } from "@/app/painel/actions";
import { MediaMultiSelect } from "@/components/admin/media-multi-select";
import { AdminSlugField } from "@/components/admin/admin-slug-field";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { REGIOES_DO_RIO, type RegiaoDoRio } from "@/lib/regioes";

const initialState: BairroFormState = {};

export type BairroFormValues = {
  nome: string;
  slug: string;
  regiao: RegiaoDoRio;
  imagem: string;
  textoCurto: string;
  texto: string;
};

type Publication = { author: string; publishedAt?: string; updatedAt?: string };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(value));
}

function FormActions() {
  const { pending } = useFormStatus();
  return (
    <div className="flex gap-2">
      <Button className="h-11 flex-1" disabled={pending} name="intent" type="submit" value="publish"><SendIcon /> {pending ? "Salvando…" : "Publicar"}</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button aria-label="Mais opções de publicação" className="size-11" disabled={pending} size="icon" type="button" variant="secondary"><MoreHorizontalIcon /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="admin-theme dark min-w-52">
          <DropdownMenuItem asChild><button className="w-full" form="bairro-form" name="intent" type="submit" value="draft"><FilePenLineIcon /> Salvar rascunho</button></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ErrorMessage({ messages }: { messages?: string[] }) {
  return messages?.[0] ? <p className="text-xs text-destructive">{messages[0]}</p> : null;
}

export function BairroForm({ editId, publication, values }: { editId?: string; publication: Publication; values?: BairroFormValues }) {
  const formAction = editId ? updateBairro.bind(null, editId) : createBairro;
  const [state, action] = useActionState(formAction, initialState);
  return (
    <form action={action} id="bairro-form">
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <Card>
          <CardHeader className="border-b"><CardTitle>Conteúdo do bairro</CardTitle></CardHeader>
          <CardContent className="space-y-7">
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.45fr)]">
              <Field>
                <FieldLabel htmlFor="nome">Nome</FieldLabel>
                <Input defaultValue={values?.nome} id="nome" name="nome" required />
                <ErrorMessage messages={state.fields?.nome} />
              </Field>
              <Field>
                <FieldLabel>Região</FieldLabel>
                <Select defaultValue={values?.regiao} name="regiao" required>
                  <SelectTrigger className="h-10 w-full"><SelectValue placeholder="Selecionar região" /></SelectTrigger>
                  <SelectContent className="admin-theme dark">
                    {REGIOES_DO_RIO.map((regiao) => (
                      <SelectItem key={regiao} value={regiao}>{regiao}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage messages={state.fields?.regiao} />
              </Field>
            </div>
            <Field>
              <FieldLabel>Imagem do bairro</FieldLabel>
              <MediaMultiSelect defaultValue={values?.imagem ? [values.imagem] : []} label="Adicionar imagem do bairro" maxItems={1} name="imagem" />
              <ErrorMessage messages={state.fields?.imagem} />
            </Field>
            <Field>
              <FieldLabel htmlFor="textoCurto">Texto curto</FieldLabel>
              <Textarea className="min-h-28 resize-y" defaultValue={values?.textoCurto} id="textoCurto" name="textoCurto" required />
              <ErrorMessage messages={state.fields?.textoCurto} />
            </Field>
            <Field>
              <FieldLabel htmlFor="texto">Texto</FieldLabel>
              <RichTextEditor defaultValue={values?.texto} name="texto" />
              <ErrorMessage messages={state.fields?.texto} />
            </Field>
          </CardContent>
        </Card>
        <aside className="space-y-4 xl:sticky xl:top-5">
          <Card>
            <CardHeader><CardTitle>Slug</CardTitle></CardHeader>
            <CardContent>
              <AdminSlugField defaultValue={values?.slug} />
              <ErrorMessage messages={state.fields?.slug} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Publicação</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="divide-y divide-border rounded-xl border border-border bg-muted/20 text-sm">
                <Meta icon={<UserRoundIcon />} label="Autor" value={publication.author} />
                {publication.publishedAt ? <Meta icon={<CalendarDaysIcon />} label="Publicado em" value={formatDate(publication.publishedAt)} /> : null}
                {publication.publishedAt && publication.updatedAt ? <Meta icon={<Clock3Icon />} label="Atualizado em" value={formatDate(publication.updatedAt)} /> : null}
              </div>
              {state.error ? <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{state.error}</p> : null}
              <FormActions />
              <Button asChild className="w-full" variant="ghost"><Link href="/painel/bairros"><ArrowLeftIcon /> Cancelar</Link></Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </form>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-start gap-3 px-3 py-3"><span className="mt-0.5 size-4 shrink-0 text-primary [&>svg]:size-4">{icon}</span><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-0.5 font-medium text-foreground">{value}</p></div></div>;
}
