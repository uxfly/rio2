"use client";

import { useState } from "react";
import styles from "./CompartilharPost.module.css";

type CompartilharPostProps = {
  titulo: string;
};

export default function CompartilharPost({ titulo }: CompartilharPostProps) {
  const [copiado, setCopiado] = useState(false);

  function abrir(url: string) {
    window.open(url, "_blank", "noopener,noreferrer,width=720,height=640");
  }

  function compartilharWhatsApp() {
    abrir(
      `https://wa.me/?text=${encodeURIComponent(`${titulo} ${window.location.href}`)}`,
    );
  }

  function compartilharLinkedIn() {
    abrir(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
    );
  }

  async function copiarLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopiado(true);
    window.setTimeout(() => setCopiado(false), 1800);
  }

  async function compartilhar() {
    if (navigator.share) {
      await navigator.share({ title: titulo, url: window.location.href });
      return;
    }
    await copiarLink();
  }

  return (
    <div className={styles.share} aria-label="Compartilhar artigo">
      <span>Compartilhar</span>
      <div>
        <button type="button" onClick={compartilharWhatsApp}>
          WhatsApp
        </button>
        <button type="button" onClick={compartilharLinkedIn}>
          LinkedIn
        </button>
        <button type="button" onClick={copiarLink}>
          {copiado ? "Link copiado" : "Copiar link"}
        </button>
        <button type="button" className={styles.primary} onClick={compartilhar}>
          Compartilhar
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  );
}
