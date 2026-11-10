import Image from "next/image";
import Link from "next/link";
import { BAIRROS, ZONAS } from "@/lib/bairros";
import styles from "./BairrosHub.module.css";
import { urlDoBairro } from "@/lib/site-urls";

export default function BairrosHub() {
  return (
    <main className={styles.page}>
      <section className={styles.catalog} aria-labelledby="zonas-title">
        <header className={styles.sectionHeader}>
          <div>
            <p>Primeiro, escolha uma região</p>
            <h2 id="zonas-title">Regiões para viver o Rio.</h2>
          </div>
          <span>
            Comece pela escala da cidade e, depois, aproxime a busca até o
            bairro que combina com a sua rotina.
          </span>
        </header>

        <div className={styles.zones}>
          {ZONAS.map((zona, index) => (
            <Link
              href={`/regiao/${zona.slug}`}
              className={styles.zone}
              key={zona.slug}
            >
              <Image
                src={zona.imagem}
                alt={`Paisagem da região ${zona.nome}, Rio de Janeiro`}
                fill
                sizes="(max-width: 58rem) 100vw, 50vw"
              />
              <span className={styles.zoneShade} aria-hidden="true" />
              <div className={styles.zoneTop}>
                <span>0{index + 1}</span>
                <span>{zona.quantidade} imóveis</span>
              </div>
              <div className={styles.zoneContent}>
                <h3>{zona.nome}</h3>
                <p>{zona.descricao}</p>
                <span className={styles.zoneCta}>
                  Explorar região <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <header className={styles.neighborhoodHeader}>
          <p>Ou vá direto ao endereço</p>
          <h2>Explore os bairros.</h2>
        </header>

        <div className={styles.neighborhoods}>
          {BAIRROS.map((bairro, index) => (
            <Link
              href={urlDoBairro(bairro.nome)}
              className={styles.neighborhood}
              key={bairro.slug}
            >
              <span className={styles.neighborhoodIndex}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className={styles.neighborhoodImage}>
                <Image
                  src={bairro.imagem}
                  alt={`Vista do bairro ${bairro.nome}, Rio de Janeiro`}
                  fill
                  sizes="14rem"
                />
              </div>
              <div className={styles.neighborhoodName}>
                <h3>{bairro.nome}</h3>
                <p>{bairro.descricao}</p>
              </div>
              <span className={styles.neighborhoodZone}>{bairro.zona}</span>
              <strong>
                {bairro.quantidade}
                <span> imóveis</span>
              </strong>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
