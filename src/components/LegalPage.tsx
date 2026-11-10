import Link from "next/link";
import styles from "./LegalPage.module.css";

export type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  updated: string;
  introduction: string;
  sections: LegalSection[];
};

export default function LegalPage({
  eyebrow,
  title,
  updated,
  introduction,
  sections,
}: LegalPageProps) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          <span>←</span>
          <span>Rio Lançamentos</span>
        </Link>
        <p>{eyebrow}</p>
        <div className="titulo-com-poeira">
          <div
            className="poeira-titulo poeira-titulo-pagina"
            aria-hidden="true"
          />
          <h1>{title}</h1>
        </div>
        <div className={styles.intro}>
          <p>{introduction}</p>
          <span>Atualizado em {updated}</span>
        </div>
      </header>

      <article className={styles.article}>
        <aside>
          <span>Identificação</span>
          <p>CRECI: 9007</p>
          <p>CNPJ: 40.724.844/0001-08</p>
        </aside>

        <div className={styles.content}>
          {sections.map((section, index) => (
            <section key={section.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
