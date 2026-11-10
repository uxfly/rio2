"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { PlantaImovel } from "@/lib/imoveis";
import styles from "./GaleriaPlantas.module.css";

type GaleriaPlantasProps = {
  nome: string;
  plantas: readonly PlantaImovel[];
};

export default function GaleriaPlantas({
  nome,
  plantas,
}: GaleriaPlantasProps) {
  const [ativa, setAtiva] = useState(0);
  const [ampliada, setAmpliada] = useState(false);
  const planta = plantas[ativa];

  useEffect(() => {
    if (!ampliada) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const aoTeclar = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAmpliada(false);
      if (event.key === "ArrowRight") {
        setAtiva((atual) => (atual + 1) % plantas.length);
      }
      if (event.key === "ArrowLeft") {
        setAtiva((atual) => (atual - 1 + plantas.length) % plantas.length);
      }
    };

    window.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [ampliada, plantas.length]);

  if (!planta) return null;

  return (
    <>
      <div className={styles.gallery}>
        <div className={styles.controls}>
          <p>
            <span>{String(ativa + 1).padStart(2, "0")}</span>
            <i />
            <span>{String(plantas.length).padStart(2, "0")}</span>
          </p>
        </div>

        <div className={styles.stage}>
          <button
            type="button"
            className={styles.stageOpen}
            onClick={() => setAmpliada(true)}
            aria-label={`Ampliar ${planta.nome} de ${nome}`}
          >
            <Image
              src={planta.imagem}
              alt={`${planta.nome} de ${nome}`}
              fill
              sizes="(max-width: 52rem) 100vw, 58vw"
            />
            <span className={styles.stageMeta}>
              <strong>Planta {String(ativa + 1).padStart(2, "0")}</strong>
              <span>Ampliar ↗</span>
            </span>
          </button>
          <button
            type="button"
            className={`${styles.stageArrow} ${styles.stagePrevious}`}
            onClick={() =>
              setAtiva(
                (atual) => (atual - 1 + plantas.length) % plantas.length,
              )
            }
            aria-label="Planta anterior"
          >
            ←
          </button>
          <button
            type="button"
            className={`${styles.stageArrow} ${styles.stageNext}`}
            onClick={() =>
              setAtiva((atual) => (atual + 1) % plantas.length)
            }
            aria-label="Próxima planta"
          >
            →
          </button>
        </div>
      </div>

      {ampliada && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Plantas de ${nome}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAmpliada(false);
          }}
        >
          <button
            type="button"
            className={styles.close}
            onClick={() => setAmpliada(false)}
            aria-label="Fechar planta"
          >
            ×
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.previous}`}
            onClick={() =>
              setAtiva((atual) => (atual - 1 + plantas.length) % plantas.length)
            }
            aria-label="Planta anterior"
          >
            ←
          </button>
          <div className={styles.lightboxStage}>
            <Image
              src={planta.imagem}
              alt={`${planta.nome} de ${nome}, ampliada`}
              fill
              sizes="94vw"
            />
          </div>
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={() =>
              setAtiva((atual) => (atual + 1) % plantas.length)
            }
            aria-label="Próxima planta"
          >
            →
          </button>
          <div className={styles.lightboxMeta}>
            <span>Planta {String(ativa + 1).padStart(2, "0")}</span>
            <span>
              {String(ativa + 1).padStart(2, "0")} /{" "}
              {String(plantas.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
