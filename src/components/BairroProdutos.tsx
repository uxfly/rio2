import Link from "next/link";
import type { DestinoBairro } from "@/lib/bairros";
import ProdutoCard, { type Produto } from "./ProdutoCard";
import styles from "./BairroProdutos.module.css";

type BairroProdutosProps = {
  destino: DestinoBairro;
  imoveis: readonly Produto[];
  contexto?: "bairro" | "tipologia";
};

export default function BairroProdutos({
  destino,
  imoveis,
  contexto = "bairro",
}: BairroProdutosProps) {
  const tipologia = contexto === "tipologia";

  return (
    <main className={styles.page}>
      <section
        className={styles.catalog}
        aria-label={`Imóveis disponíveis em ${destino.nome}`}
      >
        <div className={styles.resultBar}>
          <div>
            <span>{destino.tipo === "zona" ? "Região selecionada" : destino.zona}</span>
            <p>
              <strong>{String(imoveis.length).padStart(2, "0")}</strong>
              {imoveis.length === 1
                ? " imóvel selecionado"
                : " imóveis selecionados"}
            </p>
          </div>
          <Link href={tipologia ? "/#curadoria-tipologias" : "/bairros"}>
            <span aria-hidden="true">←</span>
            {tipologia ? "Acessar tipologias" : "Ver todas as regiões e bairros"}
          </Link>
        </div>

        <div className={styles.grid}>
          {imoveis.map((imovel) => (
            <ProdutoCard produto={imovel} key={imovel.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
