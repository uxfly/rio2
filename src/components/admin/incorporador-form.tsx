"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowLeftIcon, CalendarDaysIcon, Clock3Icon, FilePenLineIcon, MoreHorizontalIcon, SendIcon, UserRoundIcon } from "lucide-react";
import { createIncorporador, type IncorporadorFormState, updateIncorporador } from "@/app/painel/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: IncorporadorFormState = {};
export type IncorporadorFormValues = { nome: string; descricao: string };
type Publication = { author: string; publishedAt?: string; updatedAt?: string };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(value));
}

function FormActions() {
  const { pending } = useFormStatus();
  return <div className="flex gap-2"><Button className="h-11 flex-1" disabled={pending} name="intent" type="submit" value="publish"><SendIcon /> {pending ? "Salvando…" : "Publicar"}</Button><DropdownMenu><DropdownMenuTrigger asChild><Button aria-label="Mais opções de publicação" className="size-11" disabled={pending} size="icon" type="button" variant="secondary"><MoreHorizontalIcon /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="admin-theme dark min-w-52"><DropdownMenuItem asChild><button className="w-full" form="incorporador-form" name="intent" type="submit" value="draft"><FilePenLineIcon /> Salvar rascunho</button></DropdownMenuItem></DropdownMenuContent></DropdownMenu></div>;
}

function ErrorMessage({ messages }: { messages?: string[] }) {
  return messages?.[0] ? <p className="text-xs text-destructive">{messages[0]}</p> : null;
}

export function IncorporadorForm({ editId, publication, values }: { editId?: string; publication: Publication; values?: IncorporadorFormValues }) {
  const formAction = editId ? updateIncorporador.bind(null, editId) : createIncorporador;
  const [state, action] = useActionState(formAction, initialState);
  return (
    <form action={action} id="incorporador-form">
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <Card>
          <CardHeader className="border-b"><CardTitle>Dados do incorporador</CardTitle></CardHeader>
          <CardContent className="space-y-7">
            <Field><FieldLabel htmlFor="nome">Nome</FieldLabel><Input defaultValue={values?.nome} id="nome" name="nome" required /><ErrorMessage messages={state.fields?.nome} /></Field>
            <Field><FieldLabel htmlFor="descricao">Descrição</FieldLabel><Textarea className="min-h-52 resize-y" defaultValue={values?.descricao} id="descricao" name="descricao" required /><ErrorMessage messages={state.fields?.descricao} /></Field>
          </CardContent>
        </Card>
        <aside className="space-y-4 xl:sticky xl:top-5">
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
              <Button asChild className="w-full" variant="ghost"><Link href="/painel/incorporadores"><ArrowLeftIcon /> Cancelar</Link></Button>
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
