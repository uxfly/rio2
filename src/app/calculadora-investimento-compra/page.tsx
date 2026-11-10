import { Suspense } from "react";
import type { Metadata } from "next";
import CalculadoraInvestimentoClient from "@/components/CalculadoraInvestimentoClient";
import InvestimentoCuradoria from "@/components/InvestimentoCuradoria";

export const metadata: Metadata = {
  title: "Calculadora imobiliária de compra e investimento no Rio",
  description:
    "Simule entrada, ITBI, FGTS, financiamento, renda familiar, yield e valorização para planejar a compra ou o investimento em um imóvel no Rio de Janeiro.",
};

export default function CalculatorPage() {
  return (
    <main>
      <Suspense fallback={<InvestimentoCuradoria />}>
        <CalculadoraInvestimentoClient />
      </Suspense>
    </main>
  );
}
