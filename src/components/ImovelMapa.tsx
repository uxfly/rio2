"use client";

import { useEffect, useMemo, useState } from "react";
import CatalogoMapa from "./CatalogoMapa";
import styles from "./ImovelMapa.module.css";

type ImovelMapaProps = {
  id: string;
  nome: string;
  bairro: string;
  tipologia: string;
  valor: string;
  imagem: string;
  endereco: string;
  latitude?: number;
  longitude?: number;
  slug: string;
  segmento?: "refugio";
};

type Coordenadas = [number, number];

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;

export default function ImovelMapa({
  id,
  nome,
  bairro,
  tipologia,
  valor,
  imagem,
  endereco,
  latitude,
  longitude,
  slug,
  segmento,
}: ImovelMapaProps) {
  const coordenadasIniciais = useMemo(
    () =>
      Number.isFinite(latitude) && Number.isFinite(longitude)
        ? ([longitude!, latitude!] as Coordenadas)
        : null,
    [latitude, longitude],
  );
  const [coordenadas, setCoordenadas] = useState<Coordenadas | null>(
    coordenadasIniciais,
  );
  const [buscando, setBuscando] = useState(
    () => !coordenadasIniciais && Boolean(endereco && MAPTILER_KEY),
  );

  useEffect(() => {
    if (coordenadasIniciais || !endereco) return;
    if (!MAPTILER_KEY) return;

    const controller = new AbortController();
    const query = `${endereco}, Brasil`;

    fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${encodeURIComponent(MAPTILER_KEY)}&country=br&language=pt&limit=1`,
      { signal: controller.signal },
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => {
        const center = result?.features?.[0]?.center;
        if (
          Array.isArray(center) &&
          Number.isFinite(center[0]) &&
          Number.isFinite(center[1])
        ) {
          setCoordenadas([center[0], center[1]]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setBuscando(false);
      });

    return () => controller.abort();
  }, [coordenadasIniciais, endereco]);

  if (buscando) {
    return <div className={styles.status}>Localizando o endereço no mapa</div>;
  }

  if (!coordenadas) {
    return <div className={styles.status}>Localização ainda não cadastrada</div>;
  }

  return (
    <CatalogoMapa
      imoveis={[
        {
          id,
          nome,
          bairro,
          tipologia,
          valor,
          imagem,
          coordenadas,
          slug,
          segmento: segmento === "refugio" ? "refugio" : "imovel",
        },
      ]}
    />
  );
}
