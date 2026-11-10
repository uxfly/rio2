import styles from "@/app/contato/contato.module.css";

const MAPA_URL =
  "https://www.google.com/maps?q=Av.%20das%20Am%C3%A9ricas%2C%208585%20-%20Lj%20127%20-%20Barra%20da%20Tijuca%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2022793-081&output=embed";

const DESTINO_URL =
  "https://www.google.com/maps/search/?api=1&query=Av.%20das%20Am%C3%A9ricas%2C%208585%20-%20Lj%20127%20-%20Barra%20da%20Tijuca%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2022793-081";

export default function ContatoMapa() {
  return (
    <div className={styles.mapFrame}>
      <iframe
        className={styles.mapCanvas}
        src={MAPA_URL}
        title="Localização da Rio Lançamentos na Barra da Tijuca"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <a
        className={styles.mapCard}
        href={DESTINO_URL}
        target="_blank"
        rel="noreferrer"
      >
        <span>Rio Lançamentos</span>
        <strong>Av. das Américas, 8585 — Lj 127</strong>
        <small>Abrir no Google Maps ↗</small>
      </a>
    </div>
  );
}
