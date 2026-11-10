"use client";

import { useSearchParams } from "next/navigation";
import InvestimentoCuradoria from "@/components/InvestimentoCuradoria";

const DEFAULT_AMOUNT = 1_500_000;
const DEFAULT_OWN_CAPITAL = 300_000;
const MAX_QUERY_AMOUNT = 9_999_999_999;

function positiveQueryNumber(value: string | null, fallback: number) {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? Math.min(parsedValue, MAX_QUERY_AMOUNT)
    : fallback;
}

export default function CalculadoraInvestimentoClient() {
  const searchParams = useSearchParams();
  const initialAmount = positiveQueryNumber(
    searchParams.get("valor"),
    DEFAULT_AMOUNT,
  );
  const initialOwnCapital = positiveQueryNumber(
    searchParams.get("capital"),
    DEFAULT_OWN_CAPITAL,
  );
  const initialMode =
    searchParams.get("objetivo") === "investir" ? "investir" : "morar";

  return (
    <InvestimentoCuradoria
      initialAmount={initialAmount}
      initialOwnCapital={initialOwnCapital}
      initialMode={initialMode}
    />
  );
}
