import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

// Âncoras de seções que vivem na Home. Usamos "/" + hash para que o link
// funcione de qualquer rota, não só quando o usuário já está na Home.
const quickLinks = [
  { label: "Início", to: "/#inicio" },
  { label: "Serviços", to: "/#servicos" },
  { label: "Resultados", to: "/#resultados" },
  { label: "Agendamento", to: "/#agendamento" },
];

// Links internos (rotas reais), navegados via <Link> do React Router
const helpLinks = [
  { label: "Dúvidas frequentes", to: "/perguntas-frequentes" },
  { label: "Políticas de privacidade", to: "/politica-de-privacidade" },
  { label: "Termos de uso", to: "/termos-de-uso" },
];

const whatsappUrl = "https://w.app/ydap6c";
const instagramUrl = "https://www.instagram.com/__studiojcbeauty/";
const emailAddress = "jcbeauty.lashdesigner@gmail.com";
const phoneDisplay = "(11) 99139-8942";
const logoUrl =
  "https://res.cloudinary.com/djpdnyvpv/image/upload/v1783117499/WhatsApp_Image_2026-06-18_at_16.53.35-removebg-preview_odbyfv.png";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M20.5 11.9c0 4.7-3.8 8.5-8.5 8.5-1.5 0-2.9-.4-4.1-1.1L3.5 20.5l1.2-4.3A8.4 8.4 0 013.5 11.9C3.5 7.2 7.3 3.4 12 3.4s8.5 3.8 8.5 8.5z" />
      <path d="M9 10.2c.3 1.9 1.9 3.5 3.8 3.8.8.1 1.4-.5 1.6-1.1l.1-.4-1.7-.9c-.2.3-.5.7-.8.7-.5 0-1.6-.7-2.2-1.7-.2-.4-.1-.7.2-.9l.4-.3-.7-1.7-.4.1c-.6.2-1 .7-1 1.3z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M6.6 3.8h3l1.5 4-2 1.2a11.5 11.5 0 005.9 5.9l1.2-2 4 1.5v3c0 1-.9 1.8-1.9 1.6a17 17 0 01-13.6-13.6c-.2-1 .6-1.9 1.6-1.9z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="3.2" y="5.5" width="17.6" height="13" rx="2" />
      <path d="M4 6.8l8 6 8-6" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link
            to="/#inicio"
            className={styles.logo}
            aria-label="Voltar ao início"
          >
            <img
              src={logoUrl}
              alt="JC Beauty"
              className={styles.logoImage}
              width={220}
              height={220}
              loading="lazy"
              decoding="async"
            />
          </Link>

          <p className={styles.description}>
            Beleza natural, cuidado e excelência em cada detalhe.
          </p>

          <div className={styles.socialRow}>
            <a
              className={styles.socialButton}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir o Instagram do JC Beauty Studio (abre em nova aba)"
            >
              <InstagramIcon />
            </a>
            <a
              className={styles.socialButton}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Conversar no WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        <nav className={styles.column} aria-label="Links rápidos">
          <h3 className={styles.title}>Navegação</h3>
          <ul className={styles.list}>
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link className={styles.link} to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.column} aria-label="Ajuda">
          <h3 className={styles.title}>Ajuda</h3>
          <ul className={styles.list}>
            {helpLinks.map((link) => (
              <li key={link.to}>
                <Link className={styles.link} to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.column}>
          <h3 className={styles.title}>Atendimento</h3>
          <ul className={styles.list}>
            <li>Segunda a sábado</li>
            <li>09h às 18h</li>
            <li>Osasco, São Paulo</li>
          </ul>
        </div>

        <div className={styles.column}>
          <h3 className={styles.title}>Fale conosco</h3>
          <ul className={styles.list}>
            <li>
              <a
                className={`${styles.link} ${styles.contactItem}`}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Conversar no WhatsApp: ${phoneDisplay}`}
              >
                <PhoneIcon />
                <span>{phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a
                className={`${styles.link} ${styles.contactItem}`}
                href={`mailto:${emailAddress}`}
                aria-label={`Enviar e-mail para ${emailAddress}`}
              >
                <MailIcon />
                <span>{emailAddress}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© {currentYear} JC Beauty. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
