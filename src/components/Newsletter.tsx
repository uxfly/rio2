import Image from "next/image";
import NewsletterForm from "./NewsletterForm";
import styles from "./Newsletter.module.css";

export default function Newsletter() {
  return (
    <section className={styles.section} aria-labelledby="newsletter-title">
      <div className={styles.inner}>
        <header className={styles.editorial}>
          <div>
            <p className={styles.eyebrow}>Newsletter Rio · Curadoria semanal</p>
            <h2 id="newsletter-title">
              <span>Uma carta sobre o Rio</span>
              <span>que vem por aí.</span>
            </h2>
          </div>

          <div className={styles.introduction}>
            <p>
              Novos lançamentos, movimentos dos bairros e oportunidades que
              merecem ser vistas com calma — em uma seleção por semana.
            </p>
            <ul className={styles.topics} aria-label="Conteúdo da newsletter">
              <li>Mercado</li>
              <li>Arquitetura</li>
              <li>Endereços</li>
            </ul>
          </div>
        </header>

        <div className={styles.capture}>
          <figure className={styles.visual}>
            <Image
              src="/img/bairro-botafogo.webp"
              alt="Vista da Enseada de Botafogo e do Pão de Açúcar"
              fill
              sizes="(max-width: 60rem) 100vw, 38vw"
            />
            <div className={styles.visualShade} />
            <figcaption>
              <span>01 edição</span>
              <p>Toda quinta, uma nova leitura do mercado carioca.</p>
            </figcaption>
          </figure>

          <div className={styles.formArea}>
            <div className={styles.frequency} aria-hidden="true">
              <span>01</span>
              <i />
              <span>52</span>
            </div>

            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
