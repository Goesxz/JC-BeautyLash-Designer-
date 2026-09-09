import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import { logoutAdmin } from "../../utils/adminAuth";

const navItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Agenda", path: "/admin/agenda" },
  { label: "Clientes", path: "/admin/clientes" },
  { label: "Financeiro", path: "/admin/financeiro" },
  { label: "Serviços", path: "/admin/servicos" },
  { label: "Relatórios", path: "/admin/relatorios" },
  { label: "Configurações", path: "/admin/configuracoes" },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    logoutAdmin();
    navigate("/#inicio", { replace: true });
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span>JC Beauty</span>
          <strong>Admin</strong>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          Sair
        </button>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
