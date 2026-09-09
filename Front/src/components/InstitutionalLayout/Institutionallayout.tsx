import { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { WhatsAppButton } from "../WhatsAppButton/WhatsAppButton";
import "./Institutionallayout.css";

interface InstitutionalLayoutProps {
  /** Pequeno rótulo acima do título, ex: "Institucional" */
  eyebrow: string;
  title: string;
  /** Linha de apoio abaixo do título (opcional) */
  intro?: string;
  /** Data de última atualização, exibida junto ao cabeçalho */
  updatedAt?: string;
  children: ReactNode;
}

export function InstitutionalLayout({
  eyebrow,
  title,
  intro,
  updatedAt,
  children,
}: InstitutionalLayoutProps) {
  return (
    <>
      <Navbar />

      <main className="institutional">
        <header className="institutional__header">
          <div className="container institutional__header-inner">
            <nav className="institutional__breadcrumb" aria-label="breadcrumb">
              <Link to="/">Início</Link>
              <span aria-hidden="true">/</span>
              <span>{title}</span>
            </nav>

            <p className="institutional__eyebrow">{eyebrow}</p>
            <h1 className="institutional__title">{title}</h1>

            {intro && <p className="institutional__intro">{intro}</p>}
            {updatedAt && (
              <p className="institutional__updated">
                Última atualização: {updatedAt}
              </p>
            )}
          </div>
        </header>

        <section className="institutional__content">
          <div className="container institutional__content-inner">
            {children}
          </div>
        </section>
      </main>

      <Footer />

      <WhatsAppButton />
    </>
  );
}

export default InstitutionalLayout;
