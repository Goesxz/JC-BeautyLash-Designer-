import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const quickLinks = [
  { label: "Início", to: "/#inicio" },
  { label: "Serviços", to: "/#servicos" },
  { label: "Resultados", to: "/#resultados" },
  { label: "Agendamento", to: "/#agendamento" },
];

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
      fill="none"
      aria-hidden="true"
      className={styles.socialIcon}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.2"
        cy="6.8"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={styles.socialIcon}
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
      fill="none"
      aria-hidden="true"
      className={styles.contactIcon}
    >
      <path d="M6.6 3.8h3l1.5 4-2 1.2a11.5 11.5 0 005.9 5.9l1.2-2 4 1.5v3c0 1-.9 1.8-1.9 1.6a17 17 0 01-13.6-13.6c-.2-1 .6-1.9 1.6-1.9z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={styles.contactIcon}
    >
      <rect x="3.2" y="5.5" width="17.6" height="13" rx="2" />
      <path d="M4 6.8l8 6 8-6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={styles.arrowIcon}
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={styles.infoIcon}
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={styles.infoIcon}
    >
      <path d="M19 10.5c0 5-7 10-7 10s-7-5-7-10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10.5" r="2.3" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* =========================================
          CTA
      ========================================= */}

      <div className={styles.ctaWrapper}>
        <div className={styles.cta}>
          <div className={styles.ctaBackground} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className={styles.ctaContent}>
            <div className={styles.ctaText}>
              <span className={styles.ctaEyebrow}>
                JC Beauty
              </span>

              <h2 className={styles.ctaTitle}>
                Pronta para realçar
                <br />
                <strong>sua beleza?</strong>
              </h2>

              <p className={styles.ctaDescription}>
                Escolha seu serviço e agende seu horário de forma rápida
                e simples.
              </p>
            </div>

            <Link
              to="/#agendamento"
              className={styles.ctaButton}
            >
              <span>Agendar horário</span>

              <span className={styles.ctaButtonIcon}>
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================
          MAIN FOOTER
      ========================================= */}

      <div className={styles.container}>
        <div className={styles.main}>
          {/* BRAND */}

          <div className={styles.brand}>
            <Link
              to="/#inicio"
              className={styles.logo}
              aria-label="JC Beauty — voltar ao início"
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
                aria-label="Instagram da JC Beauty"
              >
                <InstagramIcon />
              </a>

              <a
                className={styles.socialButton}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Conversar com a JC Beauty pelo WhatsApp"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* NAVEGAÇÃO */}

          <nav
            className={styles.column}
            aria-label="Navegação"
          >
            <h3 className={styles.title}>Navegação</h3>

            <ul className={styles.list}>
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={styles.link}
                  >
                    <span>{link.label}</span>
                    <ArrowIcon />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* INFORMAÇÕES */}

          <nav
            className={styles.column}
            aria-label="Informações"
          >
            <h3 className={styles.title}>Informações</h3>

            <ul className={styles.list}>
              {helpLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={styles.link}
                  >
                    <span>{link.label}</span>
                    <ArrowIcon />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ATENDIMENTO */}

          <div className={styles.column}>
            <h3 className={styles.title}>Atendimento</h3>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoIconWrapper}>
                  <ClockIcon />
                </span>

                <div>
                  <span className={styles.infoLabel}>
                    Horário
                  </span>

                  <span className={styles.infoValue}>
                    Seg. a sábado
                    <br />
                    09h às 18h
                  </span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoIconWrapper}>
                  <LocationIcon />
                </span>

                <div>
                  <span className={styles.infoLabel}>
                    Localização
                  </span>

                  <span className={styles.infoValue}>
                    Osasco, São Paulo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CONTATO */}

          <div className={styles.column}>
            <h3 className={styles.title}>Contato</h3>

            <div className={styles.contactList}>
              <a
                className={styles.contactLink}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Conversar no WhatsApp: ${phoneDisplay}`}
              >
                <span className={styles.contactIconWrapper}>
                  <PhoneIcon />
                </span>

                <span className={styles.contactText}>
                  <small>WhatsApp</small>
                  {phoneDisplay}
                </span>
              </a>

              <a
                className={styles.contactLink}
                href={`mailto:${emailAddress}`}
                aria-label={`Enviar e-mail para ${emailAddress}`}
              >
                <span className={styles.contactIconWrapper}>
                  <MailIcon />
                </span>

                <span className={styles.contactText}>
                  <small>E-mail</small>
                  {emailAddress}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* =========================================
            BOTTOM
        ========================================= */}

        <div className={styles.bottom}>
          <p>
            © {currentYear} JC Beauty. Todos os direitos reservados.
          </p>

          <div className={styles.bottomLinks}>
            <Link to="/politica-de-privacidade">
              Privacidade
            </Link>

            <span className={styles.divider} />

            <Link to="/termos-de-uso">
              Termos de uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}