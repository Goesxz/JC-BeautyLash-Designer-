import styles from "../Agenda.module.css";

type MetricsCardsProps = {
  appointmentsCount: number;
  dayRevenue: string;
  freeTimesCount: number;
};

export default function MetricsCards({
  appointmentsCount,
  dayRevenue,
  freeTimesCount,
}: MetricsCardsProps) {
  return (
    <section className={styles.metricsGrid}>
      <article className={styles.metricCard}>
        <span>Agendamentos do dia</span>
        <strong>{appointmentsCount}</strong>
      </article>

      <article className={styles.metricCard}>
        <span>Faturamento previsto</span>
        <strong>{dayRevenue}</strong>
      </article>

      <article className={styles.metricCard}>
        <span>Horários livres</span>
        <strong>{freeTimesCount}</strong>
      </article>
    </section>
  );
}
