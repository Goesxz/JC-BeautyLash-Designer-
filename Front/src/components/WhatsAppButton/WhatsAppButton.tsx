import styles from "./WhatsAppButton.module.css";

const whatsappLink = "https://w.app/ydap6c";

export function WhatsAppButton() {
  return (
    <a
      className={styles.button}
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a JC Beauty pelo WhatsApp"
    >
      <span className={styles.pulseRing} aria-hidden="true" />

      <span className={styles.iconWrapper} aria-hidden="true">
        <span className={styles.icon}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M20.52 3.48A11.93 11.93 0 0 0 12.04 0C5.46 0 .1 5.36.1 11.94c0 2.1.55 4.15 1.6 5.96L0 24l6.25-1.64a11.92 11.92 0 0 0 5.78 1.48h.01c6.58 0 11.94-5.36 11.94-11.94 0-3.19-1.24-6.19-3.46-8.42Z"
              fill="currentColor"
            />
            <path
              d="M17.47 14.34c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.46-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.21 5.08 4.5.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35Z"
              fill="#fff"
            />
          </svg>
        </span>

        <span className={styles.statusDot} />
      </span>

      <span className={styles.content}>
        <span className={styles.label}>WhatsApp</span>
        <span className={styles.text}>Fale conosco</span>
      </span>

      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </a>
  );
}

