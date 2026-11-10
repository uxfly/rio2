"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./InvestimentoCuradoria.module.css";

type CalculatorMode = "morar" | "investir";

type InvestimentoCuradoriaProps = {
  initialAmount?: number;
  initialOwnCapital?: number;
  initialMode?: CalculatorMode;
};

const ITBI_RATE = 0.03;
const REGISTRY_RESERVE_RATE = 0.012;
const BANK_COST_RESERVE = 3_500;
const MAX_FINANCING_RATE = 0.8;
const MAX_INCOME_COMMITMENT = 0.3;
const FGTS_PROPERTY_LIMIT = 2_250_000;

const OFFICIAL_REFERENCES = [
  {
    label: "ITBI · Prefeitura do Rio",
    href: "https://fazenda.prefeitura.rio/calculo-itbi/",
  },
  {
    label: "Uso do FGTS · CAIXA",
    href: "https://www.caixa.gov.br/voce/habitacao/Paginas/utilizacao-fgts.aspx",
  },
  {
    label: "Crédito imobiliário · CAIXA",
    href: "https://www.caixa.gov.br/voce/habitacao/financiamento/aquisicao-imovel-novo/Paginas/default.aspx",
  },
  {
    label: "Emolumentos · TJRJ",
    href: "https://www3.tjrj.jus.br/portalextrajudicial/emolumentos.aspx",
  },
] as const;

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function parseCurrency(value: string) {
  return Number(value.replace(/\D/g, "").slice(0, 10)) || 0;
}

function calculateSac(
  principal: number,
  annualRate: number,
  months: number,
  elapsedMonths = 0,
) {
  if (principal <= 0 || months <= 0) {
    return { initialPayment: 0, paid: 0, remainingBalance: 0 };
  }

  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  const amortization = principal / months;
  const consideredMonths = Math.min(months, Math.max(0, elapsedMonths));
  const interestPaid =
    monthlyRate *
    (consideredMonths * principal -
      (amortization * consideredMonths * (consideredMonths - 1)) / 2);

  return {
    initialPayment: amortization + principal * monthlyRate,
    paid: amortization * consideredMonths + interestPaid,
    remainingBalance: Math.max(
      0,
      principal - amortization * consideredMonths,
    ),
  };
}

type MoneyFieldProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
};

function MoneyField({
  id,
  label,
  value,
  onChange,
  hint,
}: MoneyFieldProps) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={formatCurrency(value)}
        onChange={(event) => onChange(parseCurrency(event.target.value))}
      />
      {hint && <small>{hint}</small>}
    </label>
  );
}

export default function InvestimentoCuradoria({
  initialAmount = 1_500_000,
  initialOwnCapital = 300_000,
  initialMode = "morar",
}: InvestimentoCuradoriaProps) {
  const [mode, setMode] = useState<CalculatorMode>(initialMode);
  const [propertyValue, setPropertyValue] = useState(initialAmount);
  const [ownCapital, setOwnCapital] = useState(initialOwnCapital);
  const [fgtsBalance, setFgtsBalance] = useState(100_000);
  const [familyIncome, setFamilyIncome] = useState(35_000);
  const [termYears, setTermYears] = useState(35);
  const [annualRate, setAnnualRate] = useState(11.5);
  const [hasFgtsTime, setHasFgtsTime] = useState(true);
  const [hasNoActiveSfh, setHasNoActiveSfh] = useState(true);
  const [hasNoLocalProperty, setHasNoLocalProperty] = useState(true);
  const [monthlyRent, setMonthlyRent] = useState(8_500);
  const [monthlyCosts, setMonthlyCosts] = useState(1_800);
  const [vacancyRate, setVacancyRate] = useState(8);
  const [appreciationRate, setAppreciationRate] = useState(5);
  const [horizonYears, setHorizonYears] = useState(7);

  const simulation = useMemo(() => {
    const itbi = propertyValue * ITBI_RATE;
    const registryReserve = propertyValue * REGISTRY_RESERVE_RATE;
    const acquisitionCosts = itbi + registryReserve + BANK_COST_RESERVE;
    const fgtsEligible =
      mode === "morar" &&
      propertyValue <= FGTS_PROPERTY_LIMIT &&
      hasFgtsTime &&
      hasNoActiveSfh &&
      hasNoLocalProperty;
    const usableFgts = fgtsEligible
      ? Math.min(fgtsBalance, Math.max(0, propertyValue - ownCapital))
      : 0;
    const availableEntry = Math.min(
      propertyValue,
      ownCapital + usableFgts,
    );
    const minimumEntry = propertyValue * (1 - MAX_FINANCING_RATE);
    const financingCap = propertyValue * MAX_FINANCING_RATE;
    const requestedFinancing = Math.max(0, propertyValue - availableEntry);
    const financing = Math.min(requestedFinancing, financingCap);
    const entryGap = Math.max(0, requestedFinancing - financingCap);
    const months = termYears * 12;
    const financingProjection = calculateSac(
      financing,
      annualRate,
      months,
      horizonYears * 12,
    );
    const requiredIncome =
      financingProjection.initialPayment / MAX_INCOME_COMMITMENT;
    const incomeCapacity = familyIncome * MAX_INCOME_COMMITMENT;
    const cashAtPurchase =
      Math.min(ownCapital, Math.max(0, propertyValue - usableFgts)) +
      acquisitionCosts;

    const occupiedMonths = 12 * (1 - vacancyRate / 100);
    const annualGrossRent = monthlyRent * 12;
    const annualNetRent =
      monthlyRent * occupiedMonths - monthlyCosts * 12;
    const grossYield =
      propertyValue > 0 ? (annualGrossRent / propertyValue) * 100 : 0;
    const netYield =
      propertyValue + acquisitionCosts > 0
        ? (annualNetRent / (propertyValue + acquisitionCosts)) * 100
        : 0;
    const futurePropertyValue =
      propertyValue * Math.pow(1 + appreciationRate / 100, horizonYears);
    const accumulatedNetRent = annualNetRent * horizonYears;
    const projectedEquity =
      futurePropertyValue - financingProjection.remainingBalance;
    const capitalDeployed =
      Math.min(ownCapital, propertyValue) + acquisitionCosts;
    const projectedResult =
      projectedEquity +
      accumulatedNetRent -
      financingProjection.paid -
      capitalDeployed;
    const projectedReturn =
      capitalDeployed > 0 ? (projectedResult / capitalDeployed) * 100 : 0;
    const initialMonthlyCashFlow =
      annualNetRent / 12 - financingProjection.initialPayment;

    return {
      acquisitionCosts,
      annualNetRent,
      cashAtPurchase,
      financing,
      financingProjection,
      fgtsEligible,
      futurePropertyValue,
      grossYield,
      incomeCapacity,
      initialMonthlyCashFlow,
      itbi,
      minimumEntry,
      netYield,
      projectedEquity,
      projectedResult,
      projectedReturn,
      registryReserve,
      requiredIncome,
      entryGap,
      usableFgts,
    };
  }, [
    annualRate,
    appreciationRate,
    familyIncome,
    fgtsBalance,
    hasFgtsTime,
    hasNoActiveSfh,
    hasNoLocalProperty,
    horizonYears,
    mode,
    monthlyCosts,
    monthlyRent,
    ownCapital,
    propertyValue,
    termYears,
    vacancyRate,
  ]);

  const incomeFits =
    simulation.financingProjection.initialPayment <= simulation.incomeCapacity;

  return (
    <section className={styles.section} aria-labelledby="calculator-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Inteligência para decidir</p>
          <h2 id="calculator-title">
            <span>Antes do endereço,</span>
            <span>entenda os números.</span>
          </h2>
        </div>
        <p>
          Uma primeira leitura da compra no Rio — entrada, impostos, FGTS,
          renda e potencial de investimento reunidos no mesmo lugar.
        </p>
      </header>

      <div className={styles.calculator}>
        <div className={styles.modeBar}>
          <div>
            <span>Objetivo da simulação</span>
            <strong>
              {mode === "morar"
                ? "Planejar a compra para morar"
                : "Ler o imóvel como investimento"}
            </strong>
          </div>
          <div className={styles.modeSwitch} aria-label="Objetivo da calculadora">
            <button
              type="button"
              className={mode === "morar" ? styles.selected : ""}
              aria-pressed={mode === "morar"}
              onClick={() => setMode("morar")}
            >
              Comprar para morar
            </button>
            <button
              type="button"
              className={mode === "investir" ? styles.selected : ""}
              aria-pressed={mode === "investir"}
              onClick={() => setMode("investir")}
            >
              Analisar investimento
            </button>
          </div>
        </div>

        <div className={styles.experience}>
          <form
            className={styles.form}
            onSubmit={(event) => event.preventDefault()}
          >
            <div className={styles.formHeading}>
              <span>01</span>
              <div>
                <strong>
                  {mode === "morar"
                    ? "Estruture sua compra"
                    : "Desenhe o cenário do ativo"}
                </strong>
                <p>Altere os valores e acompanhe a leitura em tempo real.</p>
              </div>
            </div>

            <div className={styles.fields}>
              <MoneyField
                id="valor-imovel"
                label="Valor do imóvel"
                value={propertyValue}
                onChange={setPropertyValue}
              />
              <MoneyField
                id="capital-proprio"
                label={mode === "morar" ? "Recursos próprios" : "Capital disponível"}
                value={ownCapital}
                onChange={setOwnCapital}
                hint={
                  mode === "morar"
                    ? "Sem considerar o saldo do FGTS"
                    : "Valor que você pretende aportar"
                }
              />

              {mode === "morar" ? (
                <>
                  <MoneyField
                    id="saldo-fgts"
                    label="Saldo de FGTS disponível"
                    value={fgtsBalance}
                    onChange={setFgtsBalance}
                    hint="O enquadramento definitivo é validado pelo agente financeiro"
                  />
                  <MoneyField
                    id="renda-familiar"
                    label="Renda familiar bruta"
                    value={familyIncome}
                    onChange={setFamilyIncome}
                    hint="A prestação pode comprometer até 30% na referência utilizada"
                  />
                </>
              ) : (
                <>
                  <MoneyField
                    id="aluguel-mensal"
                    label="Aluguel mensal esperado"
                    value={monthlyRent}
                    onChange={setMonthlyRent}
                  />
                  <MoneyField
                    id="custos-mensais"
                    label="Custos mensais do ativo"
                    value={monthlyCosts}
                    onChange={setMonthlyCosts}
                    hint="Condomínio, IPTU, manutenção e administração"
                  />
                </>
              )}
            </div>

            <div className={styles.parameters}>
              <label>
                <span>Prazo do financiamento</span>
                <select
                  value={termYears}
                  onChange={(event) => setTermYears(Number(event.target.value))}
                >
                  {[20, 25, 30, 35].map((years) => (
                    <option value={years} key={years}>
                      {years} anos
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Taxa anual indicativa</span>
                <div>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    step="0.1"
                    value={annualRate}
                    onChange={(event) =>
                      setAnnualRate(Number(event.target.value) || 0)
                    }
                  />
                  <i>% a.a.</i>
                </div>
              </label>
              {mode === "investir" && (
                <>
                  <label>
                    <span>Vacância estimada</span>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={vacancyRate}
                        onChange={(event) =>
                          setVacancyRate(Number(event.target.value) || 0)
                        }
                      />
                      <i>%</i>
                    </div>
                  </label>
                  <label>
                    <span>Valorização anual</span>
                    <div>
                      <input
                        type="number"
                        min="-20"
                        max="30"
                        step="0.5"
                        value={appreciationRate}
                        onChange={(event) =>
                          setAppreciationRate(Number(event.target.value) || 0)
                        }
                      />
                      <i>% a.a.</i>
                    </div>
                  </label>
                  <label>
                    <span>Horizonte</span>
                    <select
                      value={horizonYears}
                      onChange={(event) =>
                        setHorizonYears(Number(event.target.value))
                      }
                    >
                      {[3, 5, 7, 10, 15].map((years) => (
                        <option value={years} key={years}>
                          {years} anos
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}
            </div>

            {mode === "morar" ? (
              <fieldset className={styles.fgtsRules}>
                <legend>Pré-checagem de uso do FGTS</legend>
                <label>
                  <input
                    type="checkbox"
                    checked={hasFgtsTime}
                    onChange={(event) => setHasFgtsTime(event.target.checked)}
                  />
                  <span>Tenho ao menos 3 anos de trabalho sob o FGTS</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={hasNoActiveSfh}
                    onChange={(event) => setHasNoActiveSfh(event.target.checked)}
                  />
                  <span>Não possuo financiamento ativo no SFH</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={hasNoLocalProperty}
                    onChange={(event) =>
                      setHasNoLocalProperty(event.target.checked)
                    }
                  />
                  <span>
                    Não possuo imóvel residencial na região de moradia ou trabalho
                  </span>
                </label>
              </fieldset>
            ) : (
              <p className={styles.investmentNote}>
                O FGTS não entra neste cenário: pelas regras atuais, o imóvel
                deve se destinar à moradia do titular.
              </p>
            )}
          </form>

          <div className={styles.result}>
            <Image
              src="/img/cover.webp"
              alt=""
              fill
              sizes="(max-width: 70rem) 100vw, 55vw"
            />
            <div className={styles.resultShade} />

            <div className={styles.resultContent} aria-live="polite">
              <div className={styles.resultHeader}>
                <p className={styles.resultLabel}>
                  {mode === "morar"
                    ? "Raio-x da aquisição"
                    : "Leitura indicativa do investimento"}
                </p>
                <span>Rio de Janeiro · estimativa</span>
              </div>

              {mode === "morar" ? (
                <>
                  <div className={styles.heroResult}>
                    <span>Capital estimado na compra</span>
                    <strong>{formatCurrency(simulation.cashAtPurchase)}</strong>
                    <p>
                      Recursos próprios, ITBI e reservas documentais. O FGTS
                      elegível reduz o saldo a financiar.
                    </p>
                  </div>

                  <div className={styles.resultGrid}>
                    <article>
                      <span>ITBI estimado · 3%</span>
                      <strong>{formatCurrency(simulation.itbi)}</strong>
                    </article>
                    <article>
                      <span>Registro e atos · reserva</span>
                      <strong>{formatCurrency(simulation.registryReserve)}</strong>
                    </article>
                    <article>
                      <span>FGTS considerado</span>
                      <strong>{formatCurrency(simulation.usableFgts)}</strong>
                      <small>
                        {simulation.fgtsEligible
                          ? "Pré-requisitos informados atendidos"
                          : propertyValue > FGTS_PROPERTY_LIMIT
                            ? "Imóvel acima do teto atual de R$ 2,25 mi"
                            : "Revise os critérios de enquadramento"}
                      </small>
                    </article>
                    <article>
                      <span>Saldo a financiar</span>
                      <strong>{formatCurrency(simulation.financing)}</strong>
                    </article>
                    <article>
                      <span>Parcela SAC inicial</span>
                      <strong>
                        {formatCurrency(
                          simulation.financingProjection.initialPayment,
                        )}
                      </strong>
                      <small>Sem seguros, TR e tarifas recorrentes</small>
                    </article>
                    <article className={incomeFits ? styles.positive : styles.warning}>
                      <span>Renda familiar indicativa</span>
                      <strong>{formatCurrency(simulation.requiredIncome)}</strong>
                      <small>
                        {incomeFits
                          ? "Dentro do limite indicativo informado"
                          : `Sua margem de 30% é ${formatCurrency(
                              simulation.incomeCapacity,
                            )}`}
                      </small>
                    </article>
                  </div>

                  {simulation.entryGap > 0 && (
                    <p className={styles.alert}>
                      Para respeitar uma cota de financiamento de até 80%, ainda
                      seriam necessários{" "}
                      <strong>{formatCurrency(simulation.entryGap)}</strong> na
                      entrada.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className={styles.heroResult}>
                    <span>Patrimônio projetado em {horizonYears} anos</span>
                    <strong>
                      {formatCurrency(simulation.futurePropertyValue)}
                    </strong>
                    <p>
                      Cenário construído com as premissas informadas, sem
                      promessa de valorização ou renda.
                    </p>
                  </div>

                  <div className={styles.resultGrid}>
                    <article>
                      <span>Yield bruto anual</span>
                      <strong>
                        {percentFormatter.format(simulation.grossYield)}%
                      </strong>
                    </article>
                    <article>
                      <span>Yield líquido estimado</span>
                      <strong>
                        {percentFormatter.format(simulation.netYield)}%
                      </strong>
                    </article>
                    <article>
                      <span>Renda líquida anual</span>
                      <strong>{formatCurrency(simulation.annualNetRent)}</strong>
                    </article>
                    <article>
                      <span>Fluxo mensal inicial</span>
                      <strong>
                        {formatCurrency(simulation.initialMonthlyCashFlow)}
                      </strong>
                      <small>Após custos e prestação inicial estimada</small>
                    </article>
                    <article>
                      <span>Equity projetado</span>
                      <strong>{formatCurrency(simulation.projectedEquity)}</strong>
                    </article>
                    <article
                      className={
                        simulation.projectedResult >= 0
                          ? styles.positive
                          : styles.warning
                      }
                    >
                      <span>Retorno indicativo sobre capital</span>
                      <strong>
                        {percentFormatter.format(simulation.projectedReturn)}%
                      </strong>
                      <small>
                        Resultado projetado de{" "}
                        {formatCurrency(simulation.projectedResult)}
                      </small>
                    </article>
                  </div>
                </>
              )}

              <Link className={styles.cta} href="/contato">
                <span>Levar esta simulação à curadoria</span>
                <ArrowIcon />
              </Link>

              <p className={styles.disclaimer}>
                Pré-simulação educativa. Não é proposta de crédito, cálculo
                fiscal definitivo ou recomendação de investimento. A aprovação,
                a base do ITBI e os custos reais dependem da análise das
                instituições responsáveis.
              </p>
            </div>
          </div>
        </div>

        <footer className={styles.references}>
          <div>
            <span>Premissas utilizadas</span>
            <p>
              ITBI geral de 3% no Rio, até 80% de financiamento como referência
              SAC, prazo de até 35 anos e comprometimento de até 30% da renda.
            </p>
          </div>
          <nav aria-label="Fontes oficiais da calculadora">
            {OFFICIAL_REFERENCES.map((reference) => (
              <a
                href={reference.href}
                target="_blank"
                rel="noreferrer"
                key={reference.label}
              >
                {reference.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
        </footer>
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
