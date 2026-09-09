import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  /** Caminho relativo, ex: "/politica-de-privacidade" */
  path: string;
  /** Impede indexação da página (ex: páginas administrativas) */
  noIndex?: boolean;
}

const SITE_NAME = "Studio Cílios"; // TODO: ajuste para o nome real da marca
const SITE_URL = "https://www.seudominio.com.br"; // TODO: ajuste para o domínio real

/**
 * Componente leve de SEO, sem dependências externas.
 * Atualiza <title>, meta description, canonical e robots via useEffect.
 * Caso o projeto já utilize react-helmet-async, esse componente pode ser
 * substituído por <Helmet> mantendo a mesma assinatura de props.
 */
export function SEO({ title, description, path, noIndex = false }: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMetaByName("description", description);
    setMetaByName("robots", noIndex ? "noindex, nofollow" : "index, follow");

    setMetaByProperty("og:title", fullTitle);
    setMetaByProperty("og:description", description);
    setMetaByProperty("og:url", `${SITE_URL}${path}`);
    setMetaByProperty("og:type", "website");

    setCanonical(`${SITE_URL}${path}`);
  }, [title, description, path, noIndex]);

  return null;
}

function setMetaByName(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setMetaByProperty(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}
