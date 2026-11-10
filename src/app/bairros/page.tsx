import type { Metadata } from "next";
import BairrosHub from "@/components/BairrosHub";

export const metadata: Metadata = {
  title: "Imóveis por bairros e regiões do Rio de Janeiro — Rio Imóveis",
  description:
    "Explore imóveis na Barra e Recreio, Zona Sul, Centro e nos bairros mais desejados do Rio de Janeiro.",
};

export default function Page() {
  return <BairrosHub />;
}
