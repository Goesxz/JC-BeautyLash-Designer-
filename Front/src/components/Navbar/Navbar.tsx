import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Resultados", href: "#resultados" },
  { label: "Agendamento", href: "#agendamento" },
  { label: "Instagram", href: "https://www.instagram.com/__studiojcbeauty/" },
];

const quickNavLinks: NavLink[] = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Resultados", href: "#resultados" },
];

const professionalAreaHref = "/admin/login";

// Links que começam com "http" são externos (ex: Instagram) e continuam
// como <a>. Links de âncora (#inicio, #servicos...) viram <Link to="/#...">
// para funcionarem a partir de qualquer rota do site, não só da Home.
function isExternalLink(href: string) {
  return href.startsWith("http");
}

function toHomeAnchor(href: string) {
  return `/${href}`;
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link
          to="/#inicio"
          className={styles.logo}
          aria-label="JC Beauty - Voltar ao início"
        >
          <img
            src="https://res.cloudinary.com/djpdnyvpv/image/upload/v1783117499/WhatsApp_Image_2026-06-18_at_16.53.35-removebg-preview_odbyfv.png"
            alt="JC Beauty"
            className={styles.logoImage}
          />
        </Link>

        <nav className={styles.desktopNav} aria-label="Navegação principal">
          <ul className={styles.linkList}>
            {navLinks.map((link) =>
              isExternalLink(link.href) ? (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ) : (
                <li key={link.href}>
                  <Link to={toHomeAnchor(link.href)} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Link to={professionalAreaHref} className={styles.professionalLink}>
            Área Profissional
          </Link>

          <Link to="/#agendamento" className={styles.ctaButton}>
            Agendar horário
          </Link>
        </div>

        <button
          type="button"
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <span className={styles.menuIcon} />
        </button>
      </div>

      <div
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ""}`}
      >
        <div className={styles.mobileMenuHeader}>
          <div className={styles.mobileMenuTitleGroup}>
            <img
              src="https://res.cloudinary.com/djpdnyvpv/image/upload/v1783117499/WhatsApp_Image_2026-06-18_at_16.53.35-removebg-preview_odbyfv.png"
              alt="JC Beauty"
              className={styles.mobileLogo}
            />
            <span className={styles.mobileMenuTitle}>Menu</span>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={closeMenu}
            aria-label="Fechar menu"
          >
            <span className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.mobileMenuBody}>
          <div className={styles.highlightCards}>
            <Link
              to="/#agendamento"
              className={styles.primaryCard}
              onClick={closeMenu}
            >
              <span className={styles.cardIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path d="M3 9.5H21" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M8 3V6.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16 3V6.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className={styles.cardText}>
                <span className={styles.cardTitle}>Agendar Horário</span>
                <span className={styles.cardSubtitle}>
                  Marque seu atendimento agora
                </span>
              </span>
            </Link>

            <Link
              to={professionalAreaHref}
              className={styles.secondaryCard}
              onClick={closeMenu}
            >
              <span className={styles.cardIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H15"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 17L15 12L10 7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 12H4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className={styles.cardText}>
                <span className={styles.cardTitle}>Área Profissional</span>
                <span className={styles.cardSubtitle}>
                  Acesso administrativo
                </span>
              </span>
            </Link>
          </div>

          <span className={styles.sectionDivider} />

          <nav aria-label="Navegação rápida">
            <span className={styles.sectionLabel}>Navegação Rápida</span>
            <ul className={styles.mobileLinkList}>
              {quickNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={toHomeAnchor(link.href)}
                    className={styles.mobileLink}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <span className={styles.sectionDivider} />

          <div className={styles.followSection}>
            <span className={styles.sectionLabel}>Siga-nos</span>
            <div className={styles.socialRow}>
              <a
                href="https://www.instagram.com/__studiojcbeauty/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label="Instagram"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
