import Image from "next/image";
import Link from "next/link";
import styles from "./SobreCta.module.css";

export default function SobreCta() {
  return (
    <section className={styles.section} aria-labelledby="sobre-cta-title">
      <div className={styles.banner}>
        <Image
          src="/img/cta-sobre-rio.webp"
          alt="Família reunida em um apartamento carioca no fim da tarde"
          fill
          sizes="100vw"
        />
        <div className={styles.shade} />

        <div className={styles.content}>
          <p className={styles.eyebrow}>Sobre o Rio Lançamentos</p>
          <h2 id="sobre-cta-title">
            <span>Imóveis são</span>
            <span>sobre pessoas.</span>
          </h2>
          <p className={styles.copy}>
            O Rio Lançamentos nasceu para aproximar pessoas de endereços que
            façam sentido para suas histórias — com curadoria local, contexto e
            escolhas mais conscientes.
          </p>

          <Link className={styles.button} href="#">
            <span>Conhecer o projeto</span>
            <ArrowIcon />
          </Link>
        </div>

        <p className={styles.signature} aria-hidden="true">
          <span>Rio de Janeiro</span>
          <i />
          <span>Curadoria imobiliária</span>
        </p>
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
