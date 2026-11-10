"use client";

import type { CSSProperties } from "react";
import styles from "./CarouselControls.module.css";

type CarouselControlsProps = {
  active: number;
  labels: readonly string[];
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

export default function CarouselControls({
  active,
  labels,
  onSelect,
  onPrevious,
  onNext,
}: CarouselControlsProps) {
  return (
    <div className={styles.root}>
      <div className={styles.progress} aria-label="Selecionar item do carrossel">
        {labels.map((label, index) => (
          <button
            key={`${label}-${index}`}
            type="button"
            className={index === active ? styles.active : undefined}
            onClick={() => onSelect(index)}
            aria-label={`Ver ${label}`}
            aria-current={index === active ? "true" : undefined}
          />
        ))}
      </div>

      <button
        type="button"
        className={styles.counter}
        aria-label="Avançar para o próximo item"
        onClick={onNext}
        style={
          {
            "--carousel-progress": (active + 1) / labels.length,
          } as CSSProperties
        }
      >
        <span aria-live="polite">
          {String(active + 1).padStart(2, "0")}
        </span>
        <i />
        {String(labels.length).padStart(2, "0")}
      </button>

      <div className={styles.arrows}>
        <button type="button" aria-label="Item anterior" onClick={onPrevious}>
          <ArrowIcon previous />
        </button>
        <button type="button" aria-label="Próximo item" onClick={onNext}>
          <ArrowIcon />
        </button>
      </div>
    </div>
  );
}

export function ArrowIcon({ previous = false }: { previous?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={previous ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="M5 12h13M13 7l5 5-5 5" />
    </svg>
  );
}
