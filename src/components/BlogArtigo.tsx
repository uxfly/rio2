import Image from "next/image";
import Link from "next/link";
import type { BlogArticle } from "@/lib/blog";
import CompartilharPost from "./CompartilharPost";
import styles from "./BlogArtigo.module.css";

type BlogArtigoProps = {
  artigo: BlogArticle;
  relacionados: readonly BlogArticle[];
};

export default function BlogArtigo({
  artigo,
  relacionados,
}: BlogArtigoProps) {
  return (
    <main className={styles.page}>
      <article>
        <header className={styles.meta}>
          <span>{artigo.categoria}</span>
          <span>{artigo.leitura}</span>
          <span>Rio de Janeiro</span>
        </header>

        <CompartilharPost titulo={artigo.titulo} />

        <div className={styles.content}>
          <p className={styles.lead}>{artigo.resumo}</p>
          {artigo.conteudo.map((secao) => (
            <section key={secao.titulo}>
              <h2>{secao.titulo}</h2>
              <p>{secao.texto}</p>
            </section>
          ))}
          <p className={styles.note}>
            Este conteúdo tem caráter editorial e demonstrativo. Uma decisão
            imobiliária deve considerar documentação, contexto e análise
            individual.
          </p>
        </div>
      </article>

      <section className={styles.more} aria-labelledby="mais-posts-title">
        <header>
          <div>
            <p>Continue explorando</p>
            <h2 id="mais-posts-title">Mais leituras selecionadas.</h2>
          </div>
          <Link href="/blog">
            Ver todos os posts <span aria-hidden="true">→</span>
          </Link>
        </header>

        <div className={styles.moreGrid}>
          {relacionados.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <div className={styles.moreImage}>
                <Image
                  src={post.imagem}
                  alt={post.alt}
                  fill
                  sizes="(max-width: 50rem) 100vw, 33vw"
                />
              </div>
              <div className={styles.moreContent}>
                <span>{post.categoria} · {post.leitura}</span>
                <h3>{post.titulo}</h3>
                <span className={styles.moreCta}>
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
