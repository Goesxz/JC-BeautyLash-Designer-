import styles from "./WhatsAppButton.module.css";

// 1. Corrigido o link (removido o ponto final que estava na string original por segurança)
const whatsappLink = "https://w.app/ydap6c";

export function WhatsAppButton() {
  return (
    <a
      className={styles.button}
      href={whatsappLink} // 2. Agora a variável está sendo usada aqui
      target="_blank"
      rel="noopener noreferrer" // 3. Adicionado 'noopener' para segurança
      aria-label="Falar com a JC Beauty pelo WhatsApp"
    >
      <span className={styles.pulseRing} aria-hidden="true" />

      <span className={styles.icon} aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 9.4c0-.9.6-1.6 1.4-1.6h.6a1 1 0 0 1 .9.6l.6 1.4a1 1 0 0 1-.2 1.1l-.6.6a5.6 5.6 0 0 0 3 3l.6-.6a1 1 0 0 1 1.1-.2l1.4.6a1 1 0 0 1 .6.9v.6c0 .8-.7 1.5-1.5 1.5A8.1 8.1 0 0 1 7 9.4Z" />
          <path d="M4 20l1.2-3.7A8 8 0 1 1 8.6 19.8L4 20Z" />
        </svg>
      </span>

      <span className={styles.text}>Fale comigo</span>
    </a>
  );
}
