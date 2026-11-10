"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./CalculadoraChamada.module.css";

type Objective = "morar" | "investir";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

function parseCurrency(value: string) {
  return Number(value.replace(/\D/g, "").slice(0, 10)) || 0;
}

export default function CalculadoraChamada() {
  const router = useRouter();
  const [amount, setAmount] = useState(300_000);
  const [objective, setObjective] = useState<Objective>("morar");

  useEffect(() => {
    router.prefetch("/calculadora-investimento-compra");
  }, [router]);

  function startSimulation() {
    const params = new URLSearchParams({
      capital: String(amount),
      objetivo: objective,
    });
    router.push(`/calculadora-investimento-compra?${params.toString()}`);
  }

  return (
    <section className={styles.section} aria-labelledby="calculator-call-title">
      <div className={styles.shell}>
        <div className={styles.copy}>
          <p>Calculadora</p>
          <h2 id="calculator-call-title">
            <span>Um imóvel começa</span>
            <span>por uma decisão possível.</span>
          </h2>
          <div className={styles.signals} aria-label="Itens considerados">
            <span>ITBI</span>
            <span>FGTS</span>
            <span>Renda familiar</span>
            <span>Yield</span>
          </div>
        </div>

        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            startSimulation();
          }}
        >
          <div className={styles.formHeading}>
            <span>Comece pelo que está disponível</span>
            <p>
              Informe quanto você pode destinar agora para uma entrada ou
              investimento.
            </p>
          </div>

          <label className={styles.amountField}>
            <span>Capital disponível hoje</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={currencyFormatter.format(amount)}
              onChange={(event) => setAmount(parseCurrency(event.target.value))}
              aria-label="Valor estimado do imóvel"
            />
          </label>

          <div className={styles.objectives} aria-label="Objetivo da simulação">
            <button
              type="button"
              className={objective === "morar" ? styles.selected : ""}
              aria-pressed={objective === "morar"}
              onClick={() => setObjective("morar")}
            >
              Comprar para morar
            </button>
            <button
              type="button"
              className={objective === "investir" ? styles.selected : ""}
              aria-pressed={objective === "investir"}
              onClick={() => setObjective("investir")}
            >
              Analisar investimento
            </button>
          </div>

          <button className={styles.cta} type="submit">
            <span>Iniciar simulação</span>
            <ArrowIcon />
          </button>
        </form>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 7l5 5-5 5" />
    </svg>
  );
}
