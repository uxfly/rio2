"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./GaleriaImovel.module.css";

type GaleriaImovelProps = {
  imagens: readonly string[];
  nome: string;
};

export default function GaleriaImovel({
  imagens,
  nome,
}: GaleriaImovelProps) {
  const [aberta, setAberta] = useState<number | null>(null);
  const layoutClass =
    imagens.length === 1
      ? styles.galleryOne
      : imagens.length === 2
        ? styles.galleryTwo
        : "";

  useEffect(() => {
    if (aberta === null) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const aoTeclar = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAberta(null);
      if (event.key === "ArrowRight") {
        setAberta((atual) =>
          atual === null ? null : (atual + 1) % imagens.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setAberta((atual) =>
          atual === null
            ? null
            : (atual - 1 + imagens.length) % imagens.length,
        );
      }
    };

    window.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [aberta, imagens.length]);

  function anterior() {
    setAberta((atual) =>
      atual === null ? null : (atual - 1 + imagens.length) % imagens.length,
    );
  }

  function proxima() {
    setAberta((atual) =>
      atual === null ? null : (atual + 1) % imagens.length,
    );
  }

  return (
    <>
      <div
        className={`${styles.gallery} ${layoutClass}`}
        aria-label={`Todas as imagens de ${nome}`}
      >
        {imagens.map((imagem, index) => (
          <button
            type="button"
            onClick={() => setAberta(index)}
            aria-label={`Abrir imagem ${index + 1} de ${imagens.length}`}
            key={imagem}
          >
            <Image
              src={imagem}
              alt={`${nome}, imagem ${index + 1}`}
              fill
              sizes={
                index === 0
                  ? "(max-width: 52rem) 100vw, 55vw"
                  : "(max-width: 52rem) 50vw, 28vw"
              }
            />
            <span className={styles.expand} aria-hidden="true">
              <ExpandIcon />
            </span>
          </button>
        ))}
      </div>

      {aberta !== null && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria de ${nome}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAberta(null);
          }}
        >
          <button
            type="button"
            className={styles.close}
            onClick={() => setAberta(null)}
            aria-label="Fechar galeria"
          >
            <CloseIcon />
          </button>

          <div className={styles.stage}>
            <Image
              src={imagens[aberta]}
              alt={`${nome}, imagem ampliada ${aberta + 1}`}
              fill
              sizes="96vw"
            />
          </div>

          <button
            type="button"
            className={`${styles.arrow} ${styles.previous}`}
            onClick={anterior}
            aria-label="Imagem anterior"
          >
            <ArrowIcon />
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={proxima}
            aria-label="Próxima imagem"
          >
            <ArrowIcon />
          </button>

          <p className={styles.counter}>
            {String(aberta + 1).padStart(2, "0")}
            <span />
            {String(imagens.length).padStart(2, "0")}
          </p>
        </div>
      )}
    </>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M9 4H4v5M15 4h5v5M20 15v5h-5M4 15v5h5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
