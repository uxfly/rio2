"use client";

import { useEffect, useRef, useState } from "react";
import {
  config,
  GeoJSONSource,
  LngLatBounds,
  Map,
  MapStyle,
  NavigationControl,
  Popup,
} from "@maptiler/sdk";
import type { FeatureCollection, Point } from "geojson";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { urlDoImovel } from "@/lib/site-urls";
import styles from "./CatalogoMapa.module.css";

export type CatalogoMapaItem = {
  id: string;
  nome: string;
  bairro: string;
  tipologia: string;
  valor: string;
  imagem: string;
  coordenadas: [number, number];
  slug?: string;
  segmento?: "imovel" | "refugio";
  tipoImovel?: string;
};

type CatalogoMapaProps = {
  imoveis: readonly CatalogoMapaItem[];
  monocromatico?: boolean;
};

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;
const CENTRO_RIO: [number, number] = [-43.255, -22.965];
const SOURCE_ID = "catalogo-imoveis";
const CLUSTERS_LAYER_ID = "catalogo-quantidades";
const CLUSTER_COUNT_LAYER_ID = "catalogo-quantidades-texto";
const PINS_LAYER_ID = "catalogo-pinos";
const PIN_IMAGE_ID = "catalogo-pin-laranja";

type CatalogoFeatureProperties = {
  id: string;
};

function criarColecao(
  imoveis: readonly CatalogoMapaItem[],
): FeatureCollection<Point, CatalogoFeatureProperties> {
  return {
    type: "FeatureCollection",
    features: imoveis.map((imovel) => ({
      type: "Feature",
      properties: { id: imovel.id },
      geometry: {
        type: "Point",
        coordinates: imovel.coordenadas,
      },
    })),
  };
}

function criarImagemDoPino(cor: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 76;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.beginPath();
  context.moveTo(32, 72);
  context.bezierCurveTo(26, 61, 10, 47, 10, 29);
  context.bezierCurveTo(10, 16, 20, 6, 32, 6);
  context.bezierCurveTo(44, 6, 54, 16, 54, 29);
  context.bezierCurveTo(54, 47, 38, 61, 32, 72);
  context.closePath();
  context.fillStyle = cor;
  context.fill();
  context.lineWidth = 4;
  context.strokeStyle = "rgba(255, 255, 255, 0.9)";
  context.stroke();

  context.beginPath();
  context.arc(32, 29, 8, 0, Math.PI * 2);
  context.fillStyle = "#f7f4ef";
  context.fill();

  return context.getImageData(0, 0, canvas.width, canvas.height);
}

function criarConteudoDoPopup(imovel: CatalogoMapaItem) {
  const popupContent = document.createElement("article");
  popupContent.className = styles.popupCard;

  const image = document.createElement("img");
  image.src = imovel.imagem;
  image.alt = "";
  popupContent.appendChild(image);

  const copy = document.createElement("div");
  copy.className = styles.popupCopy;

  const location = document.createElement("span");
  location.textContent = imovel.bairro;
  copy.appendChild(location);

  const title = document.createElement("strong");
  title.textContent = imovel.nome;
  copy.appendChild(title);

  const type = document.createElement("small");
  type.textContent = imovel.tipologia;
  copy.appendChild(type);

  const link = document.createElement("a");
  link.href = urlDoImovel(imovel);
  link.setAttribute(
    "aria-label",
    `Ver ${imovel.nome}, disponível por ${imovel.valor}`,
  );

  const value = document.createElement("span");
  value.textContent = imovel.valor;
  link.appendChild(value);

  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "→";
  link.appendChild(arrow);

  copy.appendChild(link);
  popupContent.appendChild(copy);

  return popupContent;
}

export default function CatalogoMapa({
  imoveis,
  monocromatico = false,
}: CatalogoMapaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const imoveisRef = useRef(imoveis);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    imoveisRef.current = imoveis;
  }, [imoveis]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current || !MAPTILER_KEY) return;

    config.apiKey = MAPTILER_KEY;

    const map = new Map({
      container,
      style: MapStyle.STREETS.DARK,
      center: CENTRO_RIO,
      zoom: 10.2,
      pitch: 34,
      bearing: -8,
      navigationControl: false,
      geolocateControl: false,
    });

    map.addControl(
      new NavigationControl({ showCompass: false, visualizePitch: true }),
      "bottom-right",
    );
    map.once("load", () => {
      const corDoMapa = monocromatico ? "#a8a8a8" : "#d86132";
      const pinImage = criarImagemDoPino(corDoMapa);
      if (pinImage && !map.hasImage(PIN_IMAGE_ID)) {
        map.addImage(PIN_IMAGE_ID, pinImage, { pixelRatio: 2 });
      }

      map.addSource(SOURCE_ID, {
        type: "geojson",
        data: criarColecao(imoveisRef.current),
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 54,
      });

      map.addLayer({
        id: CLUSTERS_LAYER_ID,
        type: "circle",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": corDoMapa,
          "circle-radius": [
            "step",
            ["get", "point_count"],
            18,
            5,
            22,
            10,
            27,
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "rgba(255, 255, 255, 0.88)",
          "circle-blur": 0.02,
        },
      });

      map.addLayer({
        id: CLUSTER_COUNT_LAYER_ID,
        type: "symbol",
        source: SOURCE_ID,
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["Open Sans Bold"],
          "text-size": 12,
          "text-allow-overlap": true,
        },
        paint: {
          "text-color": "#171717",
        },
      });

      map.addLayer({
        id: PINS_LAYER_ID,
        type: "symbol",
        source: SOURCE_ID,
        filter: ["!", ["has", "point_count"]],
        layout: {
          "icon-image": PIN_IMAGE_ID,
          "icon-size": 0.82,
          "icon-anchor": "bottom",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      });

      map.on("click", CLUSTERS_LAYER_ID, async (event) => {
        const feature = event.features?.[0];
        if (!feature || feature.geometry.type !== "Point") return;
        const clusterId = Number(feature.properties?.cluster_id);
        if (!Number.isFinite(clusterId)) return;

        const source = map.getSource(SOURCE_ID) as GeoJSONSource;
        const zoom = await source.getClusterExpansionZoom(clusterId);
        map.easeTo({
          center: feature.geometry.coordinates as [number, number],
          zoom: Math.max(zoom, 14),
          duration: 650,
        });
      });

      map.on("click", PINS_LAYER_ID, (event) => {
        const feature = event.features?.[0];
        const id = String(feature?.properties?.id ?? "");
        const imovel = imoveisRef.current.find((item) => item.id === id);
        if (!imovel) return;

        popupRef.current?.remove();
        popupRef.current = new Popup({
          className: styles.popup,
          closeButton: false,
          closeOnClick: true,
          offset: 24,
          maxWidth: "20rem",
        })
          .setLngLat(imovel.coordenadas)
          .setDOMContent(criarConteudoDoPopup(imovel))
          .addTo(map);
      });

      for (const layerId of [CLUSTERS_LAYER_ID, PINS_LAYER_ID]) {
        map.on("mouseenter", layerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "";
        });
      }

      setCarregado(true);
    });
    mapRef.current = map;

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      popupRef.current?.remove();
      popupRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [monocromatico]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !carregado) return;

    popupRef.current?.remove();
    popupRef.current = null;
    const source = map.getSource(SOURCE_ID) as GeoJSONSource;
    source.setData(criarColecao(imoveis));

    if (imoveis.length === 0) {
      map.easeTo({ center: CENTRO_RIO, zoom: 10.2, duration: 700 });
      return;
    }

    if (imoveis.length === 1) {
      map.flyTo({
        center: imoveis[0].coordenadas,
        zoom: 14,
        pitch: 42,
        duration: 900,
      });
      return;
    }

    const bounds = new LngLatBounds();
    imoveis.forEach((imovel) => bounds.extend(imovel.coordenadas));
    map.fitBounds(bounds, {
      padding: { top: 72, right: 52, bottom: 72, left: 52 },
      maxZoom: 13.2,
      duration: 950,
    });
  }, [carregado, imoveis]);

  if (!MAPTILER_KEY) {
    return (
      <div className={styles.unavailable} role="status">
        <span>Mapa indisponível</span>
        <p>Configure a chave pública do MapTiler para carregar esta visualização.</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.map} ref={containerRef} />
      <div
        className={`${styles.loading} ${carregado ? styles.loadingHidden : ""}`}
        aria-live="polite"
      >
        <span />
        Preparando o mapa do Rio
      </div>
    </div>
  );
}
