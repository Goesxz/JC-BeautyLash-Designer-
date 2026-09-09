import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Admin.module.css";
import {
  getAdminDashboard,
  type AdminAppointment,
  type AdminDashboard,
} from "../../services/adminApi";
import { logoutAdmin } from "../../utils/adminAuth";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
}

function formatCreatedAt(date: string) {
  return new Date(date).toLocaleString("pt-BR");
}

function getStatusLabel(status: AdminAppointment["status"]) {
  const labels: Record<AdminAppointment["status"], string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmado",
    CANCELLED: "Cancelado",
    FINISHED: "Finalizado",
  };

  return labels[status];
}

export default function Admin() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminDashboard();
      setDashboard(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao carregar dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logoutAdmin();
    navigate("/admin/login");
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const appointmentsByService = useMemo(() => {
    if (!dashboard) return [];

    const result = dashboard.recentAppointments.reduce<Record<string, number>>(
      (acc, appointment) => {
        const serviceName = appointment.service.name;
        acc[serviceName] = (acc[serviceName] || 0) + 1;
        return acc;
      },
      {},
    );

    return Object.entries(result).map(([service, total]) => ({
      service,
      total,
    }));
  }, [dashboard]);

  if (loading) {
    return (
      <main className={styles.page}>
        <p className={styles.loading}>Carregando dashboard...</p>
      </main>
    );
  }

  if (error || !dashboard) {
    return (
      <main className={styles.page}>
        <div className={styles.errorBox}>
          <h1>Erro ao carregar admin</h1>
          <p>{error || "Não foi possível carregar os dados."}</p>

          <button type="button" onClick={loadDashboard}>
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Painel administrativo</p>
          <h1>Dashboard JC Beauty</h1>
          <p>
            Acompanhe agendamentos, clientes, serviços e faturamento previsto do
            studio.
          </p>
        </div>

        <div className={styles.heroActions}>
          <button
            type="button"
            className={styles.refreshButton}
            onClick={loadDashboard}
          >
            Atualizar dados
          </button>

          <button
            href=""
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </section>

      <section className={styles.metricsGrid}>
        <article className={styles.metricCard}>
          <span>Total de agendamentos</span>
          <strong>{dashboard.metrics.totalAppointments}</strong>
        </article>

        <article className={styles.metricCard}>
          <span>Agendamentos hoje</span>
          <strong>{dashboard.metrics.todayAppointments}</strong>
        </article>

        <article className={styles.metricCard}>
          <span>Próximos atendimentos</span>
          <strong>{dashboard.metrics.upcomingAppointments}</strong>
        </article>

        <article className={styles.metricCard}>
          <span>Receita do mês</span>
          <strong>{formatCurrency(dashboard.metrics.revenueMonth)}</strong>
        </article>

        <article className={styles.metricCard}>
          <span>Clientes</span>
          <strong>{dashboard.metrics.totalClients}</strong>
        </article>

        <article className={styles.metricCard}>
          <span>Serviços ativos</span>
          <strong>{dashboard.metrics.activeServices}</strong>
        </article>

        <article className={styles.metricCard}>
          <span>Receita total</span>
          <strong>{formatCurrency(dashboard.metrics.totalRevenue)}</strong>
        </article>

        <article className={styles.metricCard}>
          <span>Cancelamentos</span>
          <strong>{dashboard.metrics.cancelledAppointments}</strong>
        </article>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Próximos agendamentos</h2>
            <span>{dashboard.upcomingAppointments.length} próximos</span>
          </div>

          <div className={styles.appointmentList}>
            {dashboard.upcomingAppointments.length > 0 ? (
              dashboard.upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))
            ) : (
              <p className={styles.empty}>Nenhum próximo agendamento.</p>
            )}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Serviços recentes</h2>
            <span>{appointmentsByService.length} serviços</span>
          </div>

          <div className={styles.serviceList}>
            {appointmentsByService.length > 0 ? (
              appointmentsByService.map((item) => (
                <div key={item.service} className={styles.serviceItem}>
                  <span>{item.service}</span>
                  <strong>{item.total}</strong>
                </div>
              ))
            ) : (
              <p className={styles.empty}>Nenhum serviço agendado ainda.</p>
            )}
          </div>
        </div>
      </section>

      <section className={styles.tablePanel}>
        <div className={styles.panelHeader}>
          <h2>Agendamentos recentes</h2>
          <span>{dashboard.recentAppointments.length} registros</span>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>WhatsApp</th>
                <th>Serviço</th>
                <th>Status</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Criado em</th>
              </tr>
            </thead>

            <tbody>
              {dashboard.recentAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.client.name}</td>
                  <td>{appointment.client.phone}</td>
                  <td>{appointment.service.name}</td>
                  <td>{getStatusLabel(appointment.status)}</td>
                  <td>{formatDate(appointment.date)}</td>
                  <td>{appointment.time}</td>
                  <td>{formatCreatedAt(appointment.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {dashboard.recentAppointments.length === 0 && (
            <p className={styles.empty}>Nenhum agendamento cadastrado.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function AppointmentCard({ appointment }: { appointment: AdminAppointment }) {
  return (
    <article className={styles.appointmentCard}>
      <div>
        <strong>{appointment.client.name}</strong>
        <span>{appointment.service.name}</span>
      </div>

      <div className={styles.appointmentDate}>
        <span>{formatDate(appointment.date)}</span>
        <strong>{appointment.time}</strong>
      </div>
    </article>
  );
}
