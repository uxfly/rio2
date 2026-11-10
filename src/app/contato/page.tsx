import type { Metadata } from "next";
import ContatoForm from "@/components/ContatoForm";
import ContatoMapa from "@/components/ContatoMapa";
import styles from "./contato.module.css";

export const metadata: Metadata = {
  title: "Contato | Rio Lançamentos",
  description:
    "Fale com a curadoria da Rio Lançamentos e encontre seu próximo imóvel no Rio de Janeiro.",
};

type ContatoPageProps = {
  searchParams: Promise<{ assunto?: string | string[] }>;
};

export default async function ContatoPage({ searchParams }: ContatoPageProps) {
  const query = await searchParams;
  const assunto = Array.isArray(query.assunto)
    ? query.assunto[0]
    : query.assunto;

  return (
    <main className={styles.page}>
      <section className={styles.contact} aria-labelledby="contato-form-title">
        <div className={`${styles.inner} ${styles.contactGrid}`}>
          <aside className={styles.contactDetails}>
            <div className={styles.sectionLabel}>
              <span>01</span>
              <p>Nos encontre</p>
            </div>

            <div className={styles.detailBlock}>
              <p>Rio Lançamentos</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Av.%20das%20Am%C3%A9ricas%2C%208585%20-%20Lj%20127%20-%20Barra%20da%20Tijuca%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2022793-081"
                target="_blank"
                rel="noreferrer"
              >
                Av. das Américas, 8585 — Lj 127
                <br />
                Barra da Tijuca, Rio de Janeiro — RJ
                <br />
                22793-081
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className={styles.detailBlock}>
              <p>Atendimento</p>
              <a href="tel:+5521973226405">(21) 97322-6405</a>
              <a
                className={styles.whatsappLink}
                href="https://wa.me/5521973226405"
                target="_blank"
                rel="noreferrer"
              >
                Conversar pelo WhatsApp <span aria-hidden="true">→</span>
              </a>
            </div>

            <p className={styles.availability}>
              Atendimento pessoal e consultivo para encontrar o imóvel certo
              para o seu momento.
            </p>
          </aside>

          <div className={styles.formArea}>
            <p className={styles.formEyebrow}>Conte o que você procura</p>
            <h2 id="contato-form-title">Vamos começar uma nova história?</h2>
            <ContatoForm assuntoInicial={assunto} />
          </div>
        </div>
      </section>

      <section className={styles.location} aria-labelledby="localizacao-title">
        <div className={`${styles.inner} ${styles.locationHeading}`}>
          <div className={styles.sectionLabel}>
            <span>02</span>
            <p>Barra da Tijuca</p>
          </div>
          <div>
            <h2 id="localizacao-title">Onde estamos</h2>
            <p>Av. das Américas, 8585 — Lj 127</p>
          </div>
        </div>
        <ContatoMapa />
      </section>
    </main>
  );
}
