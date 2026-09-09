import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import Admin from "./pages/Admin/Admin";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import Agenda from "./pages/Admin/Agenda/Agenda";
import Clientes from "./pages/Admin/Clientes/Clientes";
import Financeiro from "./pages/Admin/Financeiro/Financeiro";
import Servicos from "./pages/Admin/Servicos/Servicos";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute/ProtectedAdminRoute";
import Relatorios from "./pages/Admin/Relatorios/Relatorios";
import Configuracoes from "./pages/Admin/Configuracoes/Configuracoes";

// Páginas institucionais / ajuda — públicas, indexáveis, sem layout de admin
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade/PoliticaDePrivacidade";
import TermosDeUso from "./pages/TermosDeUso/TermosDeUso";
import PerguntasFrequentes from "./pages/PerguntasFrequentes/PerguntasFrequentes";
import { ScrollToHash } from "./components/ScrollToHash/Scrolltohash";

import "./styles/tokens.css";
import "./styles/globals.css";

export default function App() {
  return (
    <BrowserRouter>
      {/* Resolve o scroll até âncoras (#inicio, #servicos...) mesmo quando
          o link é clicado a partir de outra rota, como /termos-de-uso */}
      <ScrollToHash />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Rotas institucionais e de ajuda/suporte — públicas, exigidas por
            Google Ads / Meta Ads e boas práticas de SEO/LGPD */}
        <Route
          path="/politica-de-privacidade"
          element={<PoliticaDePrivacidade />}
        />
        <Route path="/termos-de-uso" element={<TermosDeUso />} />
        <Route path="/perguntas-frequentes" element={<PerguntasFrequentes />} />

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Admin />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="financeiro" element={<Financeiro />} />
          <Route path="servicos" element={<Servicos />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
