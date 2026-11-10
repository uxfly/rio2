"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

const NAVIGATION = [
  {
    title: "Encontre seu imóvel",
    links: [
      ["Lançamentos", "/lancamentos"],
      ["Imóveis de alto padrão", "/alto-padrao"],
      ["Apartamentos", "/rio-de-janeiro/apartamento"],
      ["Casas", "/rio-de-janeiro/casa"],
      ["Coberturas", "/rio-de-janeiro/cobertura"],
      ["Studios", "/rio-de-janeiro/studio"],
    ],
  },
  {
    title: "Viva o Rio",
    links: [
      ["Barra e Recreio", "/regiao/barra-e-recreio"],
      ["Zona Sul", "/regiao/zona-sul"],
      ["Centro", "/regiao/centro"],
      ["Ipanema", "/bairros?bairro=ipanema"],
      ["Leblon", "/bairros?bairro=leblon"],
      ["Botafogo", "/bairros?bairro=botafogo"],
      ["Todos os bairros", "/bairros"],
    ],
  },
  {
    title: "Curadoria",
    links: [
      ["Coleções", "#"],
      ["Bairros planejados", "/bairros?tipo=planejados"],
      ["Investimento imobiliário", "#"],
      ["Construtoras", "/construtoras"],
      ["Blog", "/blog"],
      ["Newsletter Rio", "/#newsletter-title"],
    ],
  },
  {
    title: "Rio Lançamentos",
    links: [
      ["Sobre o projeto", "#"],
      ["Fale com a curadoria", "/contato"],
      ["Anuncie seu imóvel", "/contato/"],
      ["Seja um parceiro", "/contato/"],
      ["Atendimento", "/contato"],
      ["Voltar ao início", "/"],
    ],
  },
] as const;

const SOCIALS = [
  ["Instagram", "https://www.instagram.com/riolancamentos/"],
  ["YouTube", "https://www.youtube.com/"],
  ["LinkedIn", "https://www.linkedin.com/"],
  ["Threads", "https://www.threads.net/"],
] as const;

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/painel")) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <section className={styles.invitation} aria-labelledby="footer-title">
          <div>
            <p>Seu próximo capítulo no Rio</p>
            <h2 id="footer-title">
              <span>Um endereço muda tudo.</span>
              <span>Vamos encontrar o seu?</span>
            </h2>
          </div>
        </section>

        <nav className={styles.navigation} aria-label="Mapa do site">
          {NAVIGATION.map((group, index) => (
            <div className={styles.group} key={group.title}>
              <div className={styles.groupTitle}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{group.title}</h3>
              </div>

              <ul>
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} prefetch={false}>
                      <span>{label}</span>
                      <ArrowIcon />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <section className={styles.identity} aria-label="Rio Lançamentos">
          <div className={styles.identityTop}>
            <Link className={styles.logo} href="/" aria-label="Rio Lançamentos">
              <Image
                src="/img/logo.svg"
                alt=""
                width={1534}
                height={285}
              />
            </Link>

            <p>
              Curadoria independente de imóveis e lançamentos nos endereços
              mais desejados do Rio de Janeiro.
            </p>

            <div className={styles.socials}>
              {SOCIALS.map(([label, href]) => (
                <a href={href} key={label} target="_blank" rel="noreferrer">
                  <span>{label}</span>
                  <ExternalIcon />
                </a>
              ))}
            </div>
          </div>

        </section>

        <div className={styles.legal}>
          <div className={styles.registration}>
            <span>CRECI: 9007</span>
            <span>CNPJ: 40.724.844/0001-08</span>
          </div>

          <div className={styles.legalLinks}>
            <Link href="/termos-de-uso">Termos de uso</Link>
            <Link href="/politica-de-privacidade">Privacidade</Link>
            <Link href="/politica-de-cookies">Cookies</Link>
          </div>

          <p>© 2026 Rio Lançamentos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 7l5 5-5 5" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
