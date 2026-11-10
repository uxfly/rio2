import Image from "next/image";
import Link from "next/link";
import { BLOG_ARTICLES } from "@/lib/blog";
import styles from "./BlogHome.module.css";

export default function BlogHome() {
  const [featured, ...articles] = BLOG_ARTICLES.slice(0, 4);

  return (
    <section className={styles.section} aria-labelledby="blog-home-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Leituras para escolher melhor</p>
            <h2 id="blog-home-title">
              <span>O Rio por diferentes</span>
              <span>pontos de vista.</span>
            </h2>
          </div>

          <p className={styles.introduction}>
            Conteúdo sobre imóveis, arquitetura, bairros e investimento para
            transformar informação em escolhas mais conscientes.
          </p>
        </header>

        <div className={styles.grid}>
          <Link
            className={styles.featured}
            href={`/blog/${featured.slug}`}
            id={featured.slug}
            aria-label={`Ler artigo: ${featured.titulo}`}
          >
            <Image
              src={featured.imagem}
              alt={featured.alt}
              fill
              sizes="(max-width: 54.2857rem) 100vw, 62vw"
            />
            <span className={styles.featuredShade} />

            <div className={styles.featuredTop}>
              <span>{featured.categoria}</span>
              <span>{featured.leitura}</span>
            </div>

            <div className={styles.featuredContent}>
              <p>Leitura em destaque</p>
              <h3>{featured.titulo}</h3>
              <span className={styles.featuredSummary}>{featured.resumo}</span>
              <span className={styles.read}>
                <span>Ler matéria</span>
                <ArrowIcon />
              </span>
            </div>
          </Link>

          <div className={styles.articles}>
            {articles.map((article, index) => (
              <Link
                className={styles.article}
                href={`/blog/${article.slug}`}
                id={article.slug}
                key={article.slug}
                aria-label={`Ler artigo: ${article.titulo}`}
              >
                <div className={styles.articleMedia}>
                  <Image
                    src={article.imagem}
                    alt={article.alt}
                    fill
                    sizes="(max-width: 47.1429rem) 35vw, 16vw"
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
                  <span className={styles.articleArrow}>
                    <ArrowIcon />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Link className={styles.allArticles} href="/blog">
          <span>Explorar todas as leituras</span>
          <ArrowIcon />
        </Link>
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
