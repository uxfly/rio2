import Image from "next/image";
import Link from "next/link";
import { BLOG_ARTICLES } from "@/lib/blog";
import styles from "./BlogCatalogo.module.css";

export default function BlogCatalogo() {
  const [featured, ...articles] = BLOG_ARTICLES;

  return (
    <main className={styles.page}>
      <section className={styles.catalog} aria-labelledby="blog-title">
        <header className={styles.header}>
          <div>
            <p>Leituras para escolher melhor</p>
            <h2 id="blog-title">O Rio por diferentes pontos de vista.</h2>
          </div>
          <span>
            Arquitetura, bairros, mercado e investimento para transformar
            informação em escolhas mais conscientes.
          </span>
        </header>

        <Link
          href={`/blog/${featured.slug}`}
          className={styles.featured}
          aria-label={`Ler artigo: ${featured.titulo}`}
        >
          <Image
            src={featured.imagem}
            alt={featured.alt}
            fill
            sizes="(max-width: 50rem) 100vw, 72vw"
          />
          <span className={styles.featuredShade} aria-hidden="true" />
          <div className={styles.featuredTop}>
            <span>Leitura em destaque</span>
            <span>{featured.categoria} · {featured.leitura}</span>
          </div>
          <div className={styles.featuredContent}>
            <h3>{featured.titulo}</h3>
            <p>{featured.resumo}</p>
            <span className={styles.read}>
              Ler matéria <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>

        <div className={styles.articles}>
          {articles.map((article, index) => (
            <Link
              href={`/blog/${article.slug}`}
              className={styles.article}
              key={article.slug}
            >
              <div className={styles.articleMedia}>
                <Image
                  src={article.imagem}
                  alt={article.alt}
                  fill
                  sizes="(max-width: 50rem) 100vw, 33vw"
                />
                <span>{String(index + 2).padStart(2, "0")}</span>
              </div>
              <div className={styles.articleContent}>
                <div>
                  <span>{article.categoria}</span>
                  <span>{article.leitura}</span>
                </div>
                <h3>{article.titulo}</h3>
                <p>{article.resumo}</p>
                <span className={styles.articleCta}>
                  Ler artigo <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
