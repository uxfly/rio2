"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LockKeyholeIcon } from "lucide-react";
import { loginAdmin, type LoginState } from "@/app/painel/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="h-10 w-full" disabled={pending} type="submit">
      {pending ? "Entrando…" : "Entrar no painel"}
    </Button>
  );
}

export function AdminLoginForm() {
  const [state, action] = useActionState(loginAdmin, initialState);

  return (
    <Card className="w-full max-w-md border border-white/10 bg-card/95 shadow-2xl shadow-black/40 backdrop-blur">
      <CardContent className="p-7 sm:p-9">
        <form action={action}>
          <FieldGroup>
            <div className="space-y-3 text-center">
              <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/15">
                <LockKeyholeIcon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Painel administrativo</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Acesso exclusivo da Rio Lançamentos
                </p>
              </div>
            </div>

            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </Field>

            {state.error ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {state.error}
              </p>
            ) : null}

            <Field>
              <SubmitButton />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
