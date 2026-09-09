import styles from "../Agenda.module.css";
import type {
  AgendaAppointment,
  AppointmentStatus,
} from "../../../../services/agendaApi";

type AppointmentDetailsProps = {
  appointment: AgendaAppointment | null;
  selectedStatus: AppointmentStatus;
  updatingStatus: boolean;
  onStatusChange: (status: AppointmentStatus) => void;
  onSaveStatus: () => void;
  formatDate: (date: string) => string;
  formatCurrency: (value: number) => string;
};

function getStatusLabel(status: AppointmentStatus) {
  const labels: Record<AppointmentStatus, string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmado",
    CANCELLED: "Cancelado",
    FINISHED: "Finalizado",
  };

  return labels[status];
}

export default function AppointmentDetails({
  appointment,
  selectedStatus,
  updatingStatus,
  onStatusChange,
  onSaveStatus,
  formatDate,
  formatCurrency,
}: AppointmentDetailsProps) {
  return (
    <aside className={styles.detailsPanel}>
      <div className={styles.panelHeader}>
        <h2>Detalhes</h2>
      </div>

      {appointment ? (
        <div className={styles.details}>
          <div>
            <span>Cliente</span>
            <strong>{appointment.client.name}</strong>
          </div>

          <div>
            <span>WhatsApp</span>
            <strong>{appointment.client.phone}</strong>
          </div>

          <div>
            <span>Serviço</span>
            <strong>{appointment.service.name}</strong>
          </div>

          <div>
            <span>Data</span>
            <strong>{formatDate(appointment.date)}</strong>
          </div>

          <div>
            <span>Horário</span>
            <strong>{appointment.time}</strong>
          </div>

          <div>
            <span>Valor</span>
            <strong>{formatCurrency(appointment.price)}</strong>
          </div>

          <div>
            <span>Status atual</span>
            <strong>{getStatusLabel(appointment.status)}</strong>
          </div>

          <div>
            <span>Alterar status</span>

            <select
              className={styles.statusSelect}
              value={selectedStatus}
              aria-label="Status do agendamento"
              onChange={(event) =>
                onStatusChange(event.target.value as AppointmentStatus)
              }
            >
              <option value="PENDING">Pendente</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="FINISHED">Finalizado</option>
            </select>
          </div>

          <button
            type="button"
            className={styles.saveButton}
            onClick={onSaveStatus}
            disabled={updatingStatus}
          >
            {updatingStatus ? "Salvando..." : "Salvar status"}
          </button>

          <a
            className={styles.whatsappButton}
            href={`https://wa.me/55${appointment.client.phone}`}
            target="_blank"
            rel="noreferrer"
          >
            Chamar no WhatsApp
          </a>
        </div>
      ) : (
        <p className={styles.empty}>
          Selecione um agendamento para ver os detalhes.
        </p>
      )}
    </aside>
  );
}
