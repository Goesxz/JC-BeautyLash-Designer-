import { useEffect, useState } from "react";
import styles from "./Relatorios.module.css";
import { getReports, type ReportsResponse } from "../../../services/reportApi";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function Relatorios() {
  const [reports, setReports] = useState<ReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const data = await getReports();

      setReports(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao carregar relatórios.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Carregando relatórios...</p>
      </section>
    );
  }

  if (error || !reports) {
    return (
      <section className={styles.page}>
        <div className={styles.errorBox}>
          <h1>Erro ao carregar relatórios</h1>

          <p>
            {error || "Não foi possível carregar os relatórios."}
          </p>

          <button type="button" onClick={loadReports}>
            Tentar novamente
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Relatórios</p>

          <h1>Visão geral</h1>

          <p>
            Resumo de atendimentos, cancelamentos e serviços mais vendidos.
          </p>
        </div>

        <button type="button" onClick={loadReports}>
          Atualizar
        </button>
      </header>

      <section className={styles.metricsGrid}>
        <article className={styles.metricCard}>
          <span>Receita total</span>

          <strong>
            {formatCurrency(reports.metrics.revenue)}
          </strong>
        </article>

        <article className={styles.metricCard}>
          <span>Atendimentos válidos</span>

          <strong>
            {reports.metrics.validAppointments}
          </strong>
        </article>

        <article className={styles.metricCard}>
          <span>Total de agendamentos</span>

          <strong>
            {reports.metrics.totalAppointments}
          </strong>
        </article>

        <article className={styles.metricCard}>
          <span>Cancelamentos</span>

          <strong>
            {reports.metrics.cancelledAppointments}
          </strong>
        </article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Ranking de serviços</h2>

          <span>
            {reports.servicesRanking.length} serviços
          </span>
        </div>

        <div className={styles.rankingList}>
          {reports.servicesRanking.map((item, index) => (
            <article
              key={item.service}
              className={styles.rankingCard}
            >
              <span className={styles.position}>
                {index + 1}
              </span>

              <div className={styles.rankingInfo}>
                <strong>
                  {item.service}
                </strong>

                <span>
                  {item.total}{" "}
                  {item.total === 1
                    ? "atendimento"
                    : "atendimentos"}
                </span>
              </div>

              <strong className={styles.rankingRevenue}>
                {formatCurrency(item.revenue)}
              </strong>
            </article>
          ))}

          {reports.servicesRanking.length === 0 && (
            <p className={styles.empty}>
              Nenhum dado de relatório ainda.
            </p>
          )}
        </div>
      </section>
    </section>
  );
}

