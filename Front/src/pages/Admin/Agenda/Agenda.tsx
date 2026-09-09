import { useEffect, useMemo, useState } from "react";

import styles from "./Agenda.module.css";
import {
  getAgenda,
  updateAppointment,
  type AgendaAppointment,
  type AgendaResponse,
  type AppointmentStatus,
} from "../../../services/agendaApi";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getStatusLabel(status: AppointmentStatus) {
  const labels: Record<AppointmentStatus, string> = {
    PENDING: "Pendente",
    CONFIRMED: "Confirmado",
    CANCELLED: "Cancelado",
    FINISHED: "Finalizado",
  };

  return labels[status];
}

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [agenda, setAgenda] = useState<AgendaResponse | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AgendaAppointment | null>(null);

  const [selectedStatus, setSelectedStatus] =
    useState<AppointmentStatus>("PENDING");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [updatingAppointment, setUpdatingAppointment] = useState(false);
  const [error, setError] = useState("");

  async function loadAgenda(date = selectedDate) {
    try {
      setLoading(true);
      setError("");

      const data = await getAgenda(date);
      setAgenda(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao carregar agenda.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleDateChange(date: string) {
    setSelectedDate(date);
    setSelectedAppointment(null);
    setSelectedStatus("PENDING");
    setNotes("");
    loadAgenda(date);
  }

  function handleSelectAppointment(appointment: AgendaAppointment) {
    setSelectedAppointment(appointment);
    setSelectedStatus(appointment.status);
    setNotes(appointment.notes || "");
  }

  function handleSelectFreeTime() {
    setSelectedAppointment(null);
    setSelectedStatus("PENDING");
    setNotes("");
  }

  async function handleUpdateAppointment() {
    try {
      if (!selectedAppointment) return;

      setUpdatingAppointment(true);
      setError("");

      await updateAppointment(selectedAppointment.id, {
        status: selectedStatus,
        notes,
      });

      await loadAgenda(selectedDate);

      setSelectedAppointment((current) =>
        current
          ? {
              ...current,
              status: selectedStatus,
              notes,
            }
          : current,
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar agendamento.",
      );
    } finally {
      setUpdatingAppointment(false);
    }
  }

  async function handleQuickStatusChange(status: AppointmentStatus) {
    try {
      if (!selectedAppointment) return;

      setUpdatingAppointment(true);
      setError("");

      await updateAppointment(selectedAppointment.id, {
        status,
        notes,
      });

      await loadAgenda(selectedDate);

      setSelectedStatus(status);

      setSelectedAppointment((current) =>
        current
          ? {
              ...current,
              status,
              notes,
            }
          : current,
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar agendamento.",
      );
    } finally {
      setUpdatingAppointment(false);
    }
  }

  useEffect(() => {
    loadAgenda(selectedDate);
  }, []);

  const appointmentsByTime = useMemo(() => {
    const map = new Map<string, AgendaAppointment>();

    agenda?.appointments.forEach((appointment) => {
      map.set(appointment.time, appointment);
    });

    return map;
  }, [agenda]);

  const dayRevenue = useMemo(() => {
    if (!agenda) return 0;

    return agenda.appointments
      .filter((appointment) => appointment.status !== "CANCELLED")
      .reduce((total, appointment) => total + appointment.price, 0);
  }, [agenda]);

  if (loading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Carregando agenda...</p>
      </section>
    );
  }

  if (error || !agenda) {
    return (
      <section className={styles.page}>
        <div className={styles.errorBox}>
          <h1>Erro ao carregar agenda</h1>
          <p>{error || "Não foi possível carregar a agenda."}</p>

          <button type="button" onClick={() => loadAgenda()}>
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
          <p className={styles.eyebrow}>Agenda</p>
          <h1>Agenda diária</h1>
          <p>{formatDate(selectedDate)}</p>
        </div>

        <div className={styles.headerActions}>
          <label className={styles.dateField}>
            Data da agenda
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => handleDateChange(event.target.value)}
            />
          </label>

          <button type="button" onClick={() => handleDateChange(getToday())}>
            Hoje
          </button>
        </div>
      </header>

      <section className={styles.metricsGrid}>
        <article className={styles.metricCard}>
          <span>Agendamentos do dia</span>
          <strong>{agenda.appointments.length}</strong>
        </article>

        <article className={styles.metricCard}>
          <span>Faturamento previsto</span>
          <strong>{formatCurrency(dayRevenue)}</strong>
        </article>

        <article className={styles.metricCard}>
          <span>Horários livres</span>
          <strong>
            {agenda.workingHours.length - agenda.appointments.length}
          </strong>
        </article>
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.timelinePanel}>
          <div className={styles.panelHeader}>
            <h2>Horários</h2>
            <span>{agenda.workingHours.length} horários</span>
          </div>

          <div className={styles.timeline}>
            {agenda.workingHours.map((time) => {
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
                      handleSelectAppointment(appointment);
                    } else {
                      handleSelectFreeTime();
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

        <aside className={styles.detailsPanel}>
          <div className={styles.panelHeader}>
            <h2>Detalhes</h2>
          </div>

          {selectedAppointment ? (
            <div className={styles.details}>
              <div>
                <span>Cliente</span>
                <strong>{selectedAppointment.client.name}</strong>
              </div>

              <div>
                <span>WhatsApp</span>
                <strong>{selectedAppointment.client.phone}</strong>
              </div>

              <div>
                <span>Serviço</span>
                <strong>{selectedAppointment.service.name}</strong>
              </div>

              <div>
                <span>Data</span>
                <strong>{formatDate(selectedAppointment.date)}</strong>
              </div>

              <div>
                <span>Horário</span>
                <strong>{selectedAppointment.time}</strong>
              </div>

              <div>
                <span>Valor</span>
                <strong>{formatCurrency(selectedAppointment.price)}</strong>
              </div>

              <div>
                <span>Status atual</span>
                <strong>{getStatusLabel(selectedAppointment.status)}</strong>
              </div>

              <div>
                <span>Alterar status</span>

                <select
                  className={styles.statusSelect}
                  value={selectedStatus}
                  aria-label="Status do agendamento"
                  onChange={(event) =>
                    setSelectedStatus(event.target.value as AppointmentStatus)
                  }
                >
                  <option value="PENDING">Pendente</option>
                  <option value="CONFIRMED">Confirmado</option>
                  <option value="CANCELLED">Cancelado</option>
                  <option value="FINISHED">Finalizado</option>
                </select>
              </div>

              <div>
                <span>Observações internas</span>

                <textarea
                  className={styles.notesField}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Ex: cliente prefere cílios mais naturais..."
                  rows={4}
                />
              </div>

              <button
                type="button"
                className={styles.saveButton}
                onClick={handleUpdateAppointment}
                disabled={updatingAppointment}
              >
                {updatingAppointment ? "Salvando..." : "Salvar alterações"}
              </button>

              <div className={styles.quickActions}>
                <button
                  type="button"
                  onClick={() => handleQuickStatusChange("CONFIRMED")}
                  disabled={updatingAppointment}
                >
                  Confirmar
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickStatusChange("FINISHED")}
                  disabled={updatingAppointment}
                >
                  Finalizar
                </button>

                <button
                  type="button"
                  className={styles.dangerButton}
                  onClick={() => handleQuickStatusChange("CANCELLED")}
                  disabled={updatingAppointment}
                >
                  Cancelar
                </button>
              </div>

              <a
                className={styles.whatsappButton}
                href={`https://wa.me/55${selectedAppointment.client.phone}`}
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
      </div>
    </section>
  );
}
