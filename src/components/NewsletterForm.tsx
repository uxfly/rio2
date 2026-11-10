"use client";

import { FormEvent, useState } from "react";
import styles from "./Newsletter.module.css";

export default function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
  }

  if (subscribed) {
    return (
      <div className={styles.success} role="status">
        <span className={styles.successIcon}>✓</span>
        <p>Cadastro recebido</p>
        <h3>Nos encontramos na próxima seleção.</h3>
        <button type="button" onClick={() => setSubscribed(false)}>
          Cadastrar outro e-mail
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeading}>
        <p>Entre para a Newsletter Rio.</p>
        <span>Uma vez por semana. Sem excesso. Cancele quando quiser.</span>
      </div>

      <div className={styles.fields}>
        <label>
          <span>Seu nome</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Como podemos chamar você?"
            required
          />
        </label>

        <label>
          <span>Seu melhor e-mail</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="voce@email.com"
            required
          />
        </label>

        <label>
          <span>WhatsApp (opcional)</span>
          <input
            type="tel"
            name="whatsapp"
            autoComplete="tel"
            inputMode="tel"
            placeholder="(21) 99999-9999"
          />
        </label>
      </div>

      <div className={styles.action}>
        <label className={styles.consent}>
          <input type="checkbox" required />
          <span>Concordo em receber a curadoria semanal.</span>
        </label>

        <button className={styles.submit} type="submit">
          <span>Quero receber</span>
          <ArrowIcon />
        </button>
      </div>

      <p className={styles.demoNote}>
        Formulário demonstrativo, pronto para integração ao CRM.
      </p>
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
