import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAdminIncorporadores } from "@/lib/admin-incorporadores-store";
import { getPublishedProperties } from "@/lib/admin-imoveis-store";
import { slugificarImovel } from "@/lib/imoveis";
import styles from "./construtoras.module.css";

export const metadata: Metadata = { title: "Construtoras no Rio de Janeiro | Rio Lançamentos", description: "Conheça as construtoras e incorporadoras presentes na curadoria Rio Lançamentos." };

export default async function ConstrutorasPage() {
  const [developers, properties] = await Promise.all([getAdminIncorporadores(), getPublishedProperties()]);
  const items = developers.filter((item) => item.status === "Publicado").map((item) => {
    const products = properties.filter((property) => slugificarImovel(property.incorporadora) === slugificarImovel(item.nome));
    return { ...item, count: products.length, image: products.find((product) => product.galeria[0])?.galeria[0] || "/img/cover.webp" };
  });
  return <main className={styles.page}><div className={styles.inner}><div className={styles.intro}><p>{items.length} construtoras e incorporadoras presentes em nosso catálogo.</p></div><div className={styles.grid}>{items.map((item) => <Link className={styles.card} href={`/construtora/${item.slug}`} key={item.id}><Image alt={`Empreendimento da ${item.nome}`} fill sizes="(max-width: 50rem) 100vw, 33vw" src={item.image} /><span className={styles.shade} /><div className={styles.content}><span>Construtora</span><h2>{item.nome}</h2><p>{item.descricao}</p><div className={styles.footer}><span>{item.count} {item.count === 1 ? "imóvel" : "imóveis"}</span><span aria-hidden="true">→</span></div></div></Link>)}</div></div></main>;
}
