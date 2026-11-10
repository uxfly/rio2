import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./sobre.module.css";

export const metadata: Metadata = {
  title: "Sobre o Rio Lançamentos | Curadoria imobiliária no Rio",
  description:
    "Conheça o Rio Lançamentos, uma curadoria de imóveis e endereços para viver o Rio de Janeiro com mais contexto e segurança.",
};

export default function SobrePage() {
  return (
    <main className={styles.page}>
      <Image
        src="/img/cta-sobre-rio.webp"
        alt="Família reunida em um apartamento no Rio de Janeiro"
        fill
        sizes="100vw"
      />
      <div className={styles.shade} />
      <div className={styles.content}>
        <p>Rio Lançamentos</p>
        <div className="titulo-com-poeira">
          <div
            className="poeira-titulo poeira-titulo-pagina"
            aria-hidden="true"
          />
          <h1>
            <span>Uma curadoria feita</span>
            <span>para histórias reais.</span>
          </h1>
        </div>
        <div className={styles.text}>
          <p>
            Reunimos imóveis, bairros e projetos que ajudam cada pessoa a
            encontrar uma forma mais consciente de viver o Rio de Janeiro.
          </p>
          <p>
            Nosso trabalho combina leitura de contexto, seleção cuidadosa e uma
            apresentação transparente para tornar cada escolha mais segura.
          </p>
        </div>
        <Link href="/">Voltar ao início</Link>
      </div>
    </main>
  );
}
