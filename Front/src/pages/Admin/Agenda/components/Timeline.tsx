import styles from "../Agenda.module.css";
import type {
  AgendaAppointment,
  AppointmentStatus,
} from "../../../../services/agendaApi";

type TimelineProps = {
  workingHours: string[];
  appointmentsByTime: Map<string, AgendaAppointment>;
  onSelectAppointment: (appointment: AgendaAppointment) => void;
  onSelectFreeTime: () => void;
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

export default function Timeline({
  workingHours,
  appointmentsByTime,
  onSelectAppointment,
  onSelectFreeTime,
}: TimelineProps) {
  return (
    <section className={styles.timelinePanel}>
      <div className={styles.panelHeader}>
        <h2>Horários</h2>
        <span>{workingHours.length} horários</span>
      </div>

      <div className={styles.timeline}>
        {workingHours.map((time) => {
          const appointment = appointmentsByTime.get(time);

          return (
            <button
              key={time}
              type="button"
              className={`${styles.timeSlot} ${
                appointment ? styles.timeSlotBooked : styles.timeSlotFree
              }`}
              onClick={() => {
                if (appointment) {
                  onSelectAppointment(appointment);
                } else {
                  onSelectFreeTime();
                }
              }}
            >
              <span className={styles.time}>{time}</span>

              {appointment ? (
                <div className={styles.appointmentInfo}>
                  <strong>{appointment.client.name}</strong>
                  <span>{appointment.service.name}</span>

                  <small
                    className={`${styles.status} ${
                      styles[`status${appointment.status}`]
                    }`}
                  >
                    {getStatusLabel(appointment.status)}
                  </small>
                </div>
              ) : (
                <div className={styles.freeInfo}>
                  <strong>Livre</strong>
                  <span>Horário disponível</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
