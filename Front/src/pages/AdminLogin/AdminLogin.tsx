import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";
import { adminLogin } from "../../services/authApi";
import { saveAdminAuth } from "../../utils/adminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (!email || !password) {
        setError("Preencha e-mail e senha.");
        return;
      }

      setSubmitting(true);
      setError("");

      const data = await adminLogin(email, password);

      saveAdminAuth(data.token);

      navigate("/admin");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao fazer login.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>
          <span>JC Beauty</span>
          <strong>Painel Administrativo</strong>
        </div>

        <div className={styles.header}>
          <p className={styles.eyebrow}>Acesso restrito</p>
          <h1>Entrar no admin</h1>
          <p>Use suas credenciais para acessar agendamentos e métricas.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
            />
          </label>

          <label>
            Senha
            <div className={styles.passwordField}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
