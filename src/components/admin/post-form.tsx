"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowLeftIcon, CalendarDaysIcon, Clock3Icon, FilePenLineIcon, MoreHorizontalIcon, SendIcon, UserRoundIcon } from "lucide-react";
import { createPost, type PostFormState, updatePost } from "@/app/painel/actions";
import { MediaMultiSelect } from "@/components/admin/media-multi-select";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialState: PostFormState = {};

export type PostFormValues = {
  titulo: string;
  subtitulo: string;
  imagemCapa: string;
  texto: string;
  categoria: "Bairros" | "Arquitetura" | "Imóveis" | "Investimento";
};

type Publication = { author: string; publishedAt?: string; updatedAt?: string };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function FormActions() {
  const { pending } = useFormStatus();
  return (
    <div className="flex gap-2">
      <Button className="h-11 flex-1" disabled={pending} name="intent" type="submit" value="publish">
        <SendIcon /> {pending ? "Salvando…" : "Publicar"}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label="Mais opções de publicação" className="size-11" disabled={pending} size="icon" type="button" variant="secondary"><MoreHorizontalIcon /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="admin-theme dark min-w-52">
          <DropdownMenuItem asChild>
            <button className="w-full" form="post-form" name="intent" type="submit" value="draft"><FilePenLineIcon /> Salvar rascunho</button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ErrorMessage({ messages }: { messages?: string[] }) {
  return messages?.[0] ? <p className="text-xs text-destructive">{messages[0]}</p> : null;
}

export function PostForm({ editId, publication, values }: { editId?: string; publication: Publication; values?: PostFormValues }) {
  const formAction = editId ? updatePost.bind(null, editId) : createPost;
  const [state, action] = useActionState(formAction, initialState);

  return (
    <form action={action} id="post-form">
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <Card>
          <CardHeader className="border-b"><CardTitle>Conteúdo do post</CardTitle></CardHeader>
          <CardContent className="space-y-7">
            <Field>
              <FieldLabel htmlFor="titulo">Título</FieldLabel>
              <Input defaultValue={values?.titulo} id="titulo" name="titulo" required />
              <ErrorMessage messages={state.fields?.titulo} />
            </Field>
            <Field>
              <FieldLabel htmlFor="subtitulo">Subtítulo</FieldLabel>
              <Input defaultValue={values?.subtitulo} id="subtitulo" name="subtitulo" required />
              <ErrorMessage messages={state.fields?.subtitulo} />
            </Field>
            <Field>
              <FieldLabel>Imagem de capa</FieldLabel>
              <MediaMultiSelect
                defaultValue={values?.imagemCapa ? [values.imagemCapa] : []}
                label="Adicionar imagem de capa"
                maxItems={1}
                name="imagemCapa"
              />
              <ErrorMessage messages={state.fields?.imagemCapa} />
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
            <CardHeader><CardTitle>Categoria</CardTitle></CardHeader>
            <CardContent>
              <Field>
                <Select defaultValue={values?.categoria} name="categoria" required>
                  <SelectTrigger className="h-10 w-full"><SelectValue placeholder="Selecionar categoria" /></SelectTrigger>
                  <SelectContent className="admin-theme dark">
                    <SelectItem value="Bairros">Bairros</SelectItem>
                    <SelectItem value="Arquitetura">Arquitetura</SelectItem>
                    <SelectItem value="Imóveis">Imóveis</SelectItem>
                    <SelectItem value="Investimento">Investimento</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage messages={state.fields?.categoria} />
              </Field>
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
              <Button asChild className="w-full" variant="ghost"><Link href="/painel/posts"><ArrowLeftIcon /> Cancelar</Link></Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </form>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 px-3 py-3">
      <span className="mt-0.5 size-4 shrink-0 text-primary [&>svg]:size-4">{icon}</span>
      <div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-0.5 font-medium text-foreground">{value}</p></div>
    </div>
  );
}
