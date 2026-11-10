"use client";

import { FormEvent, useState } from "react";
import styles from "@/app/contato/contato.module.css";

const WHATSAPP_NUMBER = "5521973226405";

const ASSUNTOS = [
  ["comprar", "Quero comprar um imóvel"],
  ["investir", "Quero investir no Rio"],
  ["anunciar", "Quero anunciar meu imóvel"],
  ["parceria", "Quero propor uma parceria"],
] as const;

type ContatoFormProps = {
  assuntoInicial?: string;
};

export default function ContatoForm({ assuntoInicial }: ContatoFormProps) {
  const assuntoValido = ASSUNTOS.some(([valor]) => valor === assuntoInicial)
    ? assuntoInicial
    : "comprar";
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const assunto = ASSUNTOS.find(
      ([valor]) => valor === data.get("assunto"),
    )?.[1];
    const nome = String(data.get("nome") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const telefone = String(data.get("telefone") ?? "").trim();
    const mensagem = String(data.get("mensagem") ?? "").trim();

    const texto = [
      `Olá, meu nome é ${nome}.`,
      assunto ? `Assunto: ${assunto}.` : "",
      `E-mail: ${email}.`,
      telefone ? `Telefone: ${telefone}.` : "",
      mensagem,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className={styles.formSuccess} role="status">
        <span aria-hidden="true">✓</span>
        <p>Conversa preparada</p>
        <h3>Seu WhatsApp foi aberto com a mensagem preenchida.</h3>
        <button type="button" onClick={() => setEnviado(false)}>
          Escrever outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldRow}>
        <label>
          <span>Nome</span>
          <input
            type="text"
            name="nome"
            autoComplete="name"
            placeholder="Como podemos chamar você?"
            required
          />
        </label>
        <label>
          <span>E-mail</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="voce@email.com"
            required
          />
        </label>
      </div>

      <div className={styles.fieldRow}>
        <label>
          <span>WhatsApp</span>
          <input
            type="tel"
            name="telefone"
            autoComplete="tel"
            inputMode="tel"
            placeholder="(21) 99999-9999"
          />
        </label>
        <label>
          <span>Assunto</span>
          <select name="assunto" defaultValue={assuntoValido}>
            {ASSUNTOS.map(([valor, label]) => (
              <option value={valor} key={valor}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={styles.messageField}>
        <span>Mensagem</span>
        <textarea
          name="mensagem"
          rows={5}
          placeholder="Conte sobre o imóvel, bairro ou momento que você imagina."
          required
        />
      </label>

      <div className={styles.formAction}>
        <label className={styles.consent}>
          <input type="checkbox" required />
          <span>
            Concordo com o contato da Rio Lançamentos pelos canais informados.
          </span>
        </label>
        <button type="submit">
          <span>Enviar pelo WhatsApp</span>
          <ArrowIcon />
        </button>
      </div>
    </form>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 7l5 5-5 5" />
    </svg>
  );
}
