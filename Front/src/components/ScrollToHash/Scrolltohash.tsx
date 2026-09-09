import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Ajuste esse valor para a altura real do seu header fixo/sticky
const SCROLL_OFFSET = 96;

/**
 * Renderize este componente uma única vez dentro do <BrowserRouter>,
 * fora das <Routes> (ele não renderiza nada visualmente).
 *
 * Ele resolve o caso em que o usuário clica em um link do tipo
 * <Link to="/#servicos" /> estando em outra rota (ex: /termos-de-uso):
 * o React Router troca a rota para "/", mas não faz scroll até a
 * âncora sozinho — este componente cuida disso.
 */
export function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      return;
    }

    const id = hash.replace("#", "");

    // pequeno delay para garantir que a página de destino (ex: Home)
    // já foi montada e renderizada antes de calcular a posição do scroll
    const timeout = setTimeout(() => {
      const element = document.getElementById(id);
      if (!element) return;

      const top =
        element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;

      window.scrollTo({ top, behavior: "smooth" });
    }, 80);

    return () => clearTimeout(timeout);
  }, [hash, pathname]);

  return null;
}

export default ScrollToHash;
