"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { SaveIcon, XIcon } from "lucide-react";
import { createAccess, type AccessFormState, updateAccess } from "@/app/painel/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Values = { name: string; email: string; role: "master" | "admin"; active: boolean };

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button disabled={pending} type="submit"><SaveIcon /> {pending ? "Salvando…" : "Salvar acesso"}</Button>;
}

export function AccessForm({ editId, values }: { editId?: string; values?: Values }) {
  const action = editId ? updateAccess.bind(null, editId) : createAccess;
  const [state, formAction] = useActionState(action, {} as AccessFormState);
  return (
    <form action={formAction} className="w-full">
      <Card>
        <CardHeader className="border-b"><CardTitle>Dados de acesso</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field><FieldLabel htmlFor="name">Nome</FieldLabel><Input defaultValue={values?.name} id="name" name="name" required />{state.fields?.name?.[0] ? <p className="text-xs text-destructive">{state.fields.name[0]}</p> : null}</Field>
            <Field><FieldLabel htmlFor="email">E-mail</FieldLabel><Input autoComplete="email" defaultValue={values?.email} id="email" name="email" required type="email" />{state.fields?.email?.[0] ? <p className="text-xs text-destructive">{state.fields.email[0]}</p> : null}</Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field><FieldLabel htmlFor="password">Senha</FieldLabel><Input autoComplete="new-password" id="password" minLength={editId ? undefined : 8} name="password" placeholder={editId ? "Deixe em branco para manter" : "Mínimo de 8 caracteres"} required={!editId} type="password" />{state.fields?.password?.[0] ? <p className="text-xs text-destructive">{state.fields.password[0]}</p> : null}</Field>
            <Field><FieldLabel>Perfil</FieldLabel><Select defaultValue={values?.role ?? "admin"} name="role"><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent className="admin-theme dark"><SelectItem value="master">Admin master</SelectItem><SelectItem value="admin">Administrador</SelectItem></SelectContent></Select></Field>
          </div>
          <Field><FieldLabel>Status</FieldLabel><Select defaultValue={values?.active === false ? "false" : "true"} name="active"><SelectTrigger className="w-full sm:w-1/2"><SelectValue /></SelectTrigger><SelectContent className="admin-theme dark"><SelectItem value="true">Ativo</SelectItem><SelectItem value="false">Inativo</SelectItem></SelectContent></Select></Field>
          {state.error ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p> : null}
          <div className="flex flex-wrap gap-3"><SubmitButton /><Button asChild variant="ghost"><Link href="/painel/acessos"><XIcon /> Cancelar</Link></Button></div>
        </CardContent>
      </Card>
    </form>
  );
}
