import { useEffect, useMemo, useState } from "react";
import styles from "./Financeiro.module.css";
import {
getFinance,
type FinanceAppointment,
type FinanceResponse,
} from "../../../services/financeApi";

function formatCurrency(value: number) {
return new Intl.NumberFormat("pt-BR", {
style: "currency",
currency: "BRL",
}).format(value);
}

function formatDate(date: string) {
return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
}

function getStatusLabel(status: FinanceAppointment["status"]) {
const labels: Record<FinanceAppointment["status"], string> = {
PENDING: "Pendente",
CONFIRMED: "Confirmado",
CANCELLED: "Cancelado",
FINISHED: "Finalizado",
};

return labels[status];
}

export default function Financeiro() {
const [finance, setFinance] = useState<FinanceResponse | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

async function loadFinance() {
try {
setLoading(true);
setError("");

const data = await getFinance();

  setFinance(data);
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "Erro ao carregar financeiro.",
  );
} finally {
  setLoading(false);
}

}

useEffect(() => {
loadFinance();
}, []);

const paidLikeAppointments = useMemo(() => {
if (!finance) return [];

return finance.appointments.filter(
  (appointment) => appointment.status !== "CANCELLED",
);

}, [finance]);

if (loading) {
return ( <section className={styles.page}> <p className={styles.loading}>Carregando financeiro...</p> </section>
);
}

if (error || !finance) {
return ( <section className={styles.page}> <div className={styles.errorBox}> <h1>Erro ao carregar financeiro</h1>

      <p>
        {error || "Não foi possível carregar os dados financeiros."}
      </p>

      <button type="button" onClick={loadFinance}>
        Tentar novamente
      </button>
    </div>
  </section>
);

}

return ( <section className={styles.page}> <header className={styles.header}> <div> <p className={styles.eyebrow}>Financeiro</p>

      <h1>Controle financeiro</h1>

      <p>
        Acompanhe faturamento previsto, ticket médio e movimentações dos
        atendimentos.
      </p>
    </div>

    <button type="button" onClick={loadFinance}>
      Atualizar
    </button>
  </header>

  <section className={styles.metricsGrid}>
    <article className={styles.metricCard}>
      <span>Receita hoje</span>

      <strong>{formatCurrency(finance.metrics.revenueToday)}</strong>
    </article>

    <article className={styles.metricCard}>
      <span>Receita do mês</span>

      <strong>{formatCurrency(finance.metrics.revenueMonth)}</strong>
    </article>

    <article className={styles.metricCard}>
      <span>Receita total</span>

      <strong>{formatCurrency(finance.metrics.totalRevenue)}</strong>
    </article>

    <article className={styles.metricCard}>
      <span>Ticket médio</span>

      <strong>{formatCurrency(finance.metrics.averageTicket)}</strong>
    </article>
  </section>

  <section className={styles.summaryGrid}>
    <article className={styles.summaryCard}>
      <span>Agendamentos totais</span>

      <strong>{finance.metrics.totalAppointments}</strong>
    </article>

    <article className={styles.summaryCard}>
      <span>Atendimentos válidos</span>

      <strong>{paidLikeAppointments.length}</strong>
    </article>

    <article className={styles.summaryCard}>
      <span>Cancelamentos</span>

      <strong>{finance.metrics.cancelledAppointments}</strong>
    </article>
  </section>

  <section className={styles.tablePanel}>
    <div className={styles.panelHeader}>
      <h2>Movimentações</h2>

      <span>
        {finance.appointments.length}{" "}
        {finance.appointments.length === 1 ? "registro" : "registros"}
      </span>
    </div>

    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Horário</th>
            <th>Cliente</th>
            <th>Serviço</th>
            <th>Status</th>
            <th>Valor</th>
          </tr>
        </thead>

        <tbody>
          {finance.appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{formatDate(appointment.date)}</td>

              <td>{appointment.time}</td>

              <td>{appointment.client.name}</td>

              <td>{appointment.service.name}</td>

              <td>
                <span
                  className={`${styles.status} ${
                    styles[`status${appointment.status}`]
                  }`}
                >
                  {getStatusLabel(appointment.status)}
                </span>
              </td>

              <td>{formatCurrency(appointment.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {finance.appointments.length === 0 && (
        <p className={styles.empty}>
          Nenhuma movimentação encontrada.
        </p>
      )}
    </div>
  </section>
</section>

);
}
