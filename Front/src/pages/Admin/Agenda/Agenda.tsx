
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

function getClientInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
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
        error instanceof Error
          ? error.message
          : "Erro ao carregar agenda.",
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

  function handleSelectAppointment(
    appointment: AgendaAppointment,
  ) {
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
    if (!selectedAppointment) return;

    try {
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

  async function handleQuickStatusChange(
    status: AppointmentStatus,
  ) {
    if (!selectedAppointment) return;

    try {
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
      .filter(
        (appointment) =>
          appointment.status !== "CANCELLED",
      )
      .reduce(
        (total, appointment) =>
          total + appointment.price,
        0,
      );
  }, [agenda]);

  const freeSlots = useMemo(() => {
    if (!agenda) return 0;

    return Math.max(
      agenda.workingHours.length -
        agenda.appointments.length,
      0,
    );
  }, [agenda]);

  if (loading) {
    return (
      <section className={styles.page}>
        <p
          className={styles.loading}
          aria-live="polite"
        >
          Carregando agenda...
        </p>
      </section>
    );
  }

  if (error || !agenda) {
    return (
      <section className={styles.page}>
        <div
          className={styles.errorBox}
          role="alert"
        >
          <h1>Erro ao carregar agenda</h1>

          <p>
            {error ||
              "Não foi possível carregar a agenda."}
          </p>

          <button
            type="button"
            onClick={() => loadAgenda()}
          >
            Tentar novamente
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      {/* =========================
          HEADER
      ========================= */}

      <header className={styles.header}>
        <div className={styles.headerMain}>
          <p className={styles.eyebrow}>
            Agenda
          </p>

          <h1>Agenda diária</h1>

          <p className={styles.headerDescription}>
            <span
              className={styles.liveIndicator}
              aria-hidden="true"
            />

            {formatDate(selectedDate)}
          </p>
        </div>

        <div className={styles.headerActions}>
          <label className={styles.dateField}>
            Data da agenda

            <input
              type="date"
              value={selectedDate}
              onChange={(event) =>
                handleDateChange(
                  event.target.value,
                )
              }
            />
          </label>

          <button
            type="button"
            className={styles.todayButton}
            onClick={() =>
              handleDateChange(getToday())
            }
          >
            Hoje
          </button>
        </div>
      </header>

      {/* =========================
          MÉTRICAS
      ========================= */}

      <section
        className={styles.metricsGrid}
        aria-label="Resumo da agenda"
      >
        <article className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>
              Agendamentos do dia
            </span>

            <span
              className={styles.metricIcon}
              aria-hidden="true"
            >
              01
            </span>
          </div>

          <strong className={styles.metricValue}>
            {agenda.appointments.length}
          </strong>

          <span className={styles.metricDescription}>
            compromissos registrados hoje
          </span>
        </article>

        <article className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>
              Faturamento previsto
            </span>

            <span
              className={styles.metricIcon}
              aria-hidden="true"
            >
              R$
            </span>
          </div>

          <strong className={styles.metricValue}>
            {formatCurrency(dayRevenue)}
          </strong>

          <span className={styles.metricDescription}>
            considerando os agendamentos não
            cancelados
          </span>
        </article>

        <article className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>
              Horários livres
            </span>

            <span
              className={styles.metricIcon}
              aria-hidden="true"
            >
              +
            </span>
          </div>

          <strong className={styles.metricValue}>
            {freeSlots}
          </strong>

          <span className={styles.metricDescription}>
            horários disponíveis na agenda
          </span>
        </article>
      </section>

      {/* =========================
          CONTEÚDO PRINCIPAL
      ========================= */}

      <div className={styles.contentGrid}>
        {/* =========================
            TIMELINE
        ========================= */}

        <section className={styles.timelinePanel}>
          <div className={styles.panelHeader}>
            <div
              className={styles.panelTitleGroup}
            >
              <h2>Horários</h2>

              <p>
                Selecione um horário para
                visualizar os detalhes
              </p>
            </div>

            <span
              className={styles.panelCount}
            >
              {agenda.workingHours.length}{" "}
              horários
            </span>
          </div>

          <div
            className={styles.timeline}
            role="list"
          >
            {agenda.workingHours.map(
              (time) => {
                const appointment =
                  appointmentsByTime.get(time);

                const isSelected =
                  selectedAppointment?.id ===
                  appointment?.id;

                return (
                  <button
                    key={time}
                    type="button"
                    role="listitem"
                    aria-pressed={
                      isSelected
                    }
                    aria-label={
                      appointment
                        ? `Agendamento às ${time} com ${appointment.client.name}`
                        : `Horário livre às ${time}`
                    }
                    className={`${styles.timeSlot} ${
                      appointment
                        ? styles.timeSlotBooked
                        : styles.timeSlotFree
                    } ${
                      isSelected
                        ? styles.timeSlotSelected
                        : ""
                    }`}
                    onClick={() => {
                      if (appointment) {
                        handleSelectAppointment(
                          appointment,
                        );
                      } else {
                        handleSelectFreeTime();
                      }
                    }}
                  >
                    <span
                      className={styles.time}
                    >
                      {time}
                    </span>

                    {appointment ? (
                      <div
                        className={
                          styles.appointmentInfo
                        }
                      >
                        <strong>
                          {
                            appointment.client
                              .name
                          }
                        </strong>

                        <span>
                          {
                            appointment.service
                              .name
                          }
                        </span>

                        <small
                          className={`${styles.status} ${
                            styles[
                              `status${appointment.status}`
                            ]
                          }`}
                        >
                          {getStatusLabel(
                            appointment.status,
                          )}
                        </small>
                      </div>
                    ) : (
                      <div
                        className={
                          styles.freeInfo
                        }
                      >
                        <strong>
                          Livre
                        </strong>

                        <span>
                          Horário disponível
                        </span>
                      </div>
                    )}

                    <span
                      className={
                        styles.slotAction
                      }
                      aria-hidden="true"
                    >
                      {appointment
                        ? "Ver detalhes →"
                        : "Selecionar →"}
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </section>

        {/* =========================
            DETALHES
        ========================= */}

        <aside
          className={styles.detailsPanel}
          aria-label="Detalhes do agendamento"
        >
          <div className={styles.panelHeader}>
            <div
              className={styles.panelTitleGroup}
            >
              <h2>Detalhes</h2>

              <p>
                Informações do agendamento
              </p>
            </div>
          </div>

          {selectedAppointment ? (
            <div className={styles.details}>
              {/* Cliente */}

              <div
                className={
                  styles.detailsHeader
                }
              >
                <div
                  className={
                    styles.clientAvatar
                  }
                  aria-hidden="true"
                >
                  {getClientInitial(
                    selectedAppointment
                      .client.name,
                  )}
                </div>

                <div
                  className={
                    styles.clientHeaderInfo
                  }
                >
                  <strong>
                    {
                      selectedAppointment
                        .client.name
                    }
                  </strong>

                  <span>
                    {
                      selectedAppointment
                        .service.name
                    }{" "}
                    ·{" "}
                    {
                      selectedAppointment.time
                    }
                  </span>
                </div>
              </div>

              {/* Informações */}

              <div
                className={
                  styles.detailItem
                }
              >
                <span>Cliente</span>

                <strong>
                  {
                    selectedAppointment.client
                      .name
                  }
                </strong>
              </div>

              <div
                className={
                  styles.detailItem
                }
              >
                <span>WhatsApp</span>

                <strong>
                  {
                    selectedAppointment.client
                      .phone
                  }
                </strong>
              </div>

              <div
                className={
                  styles.detailItem
                }
              >
                <span>Serviço</span>

                <strong>
                  {
                    selectedAppointment.service
                      .name
                  }
                </strong>
              </div>

              <div
                className={
                  styles.detailItem
                }
              >
                <span>Data</span>

                <strong>
                  {formatDate(
                    selectedAppointment.date,
                  )}
                </strong>
              </div>

              <div
                className={
                  styles.detailItem
                }
              >
                <span>Horário</span>

                <strong>
                  {
                    selectedAppointment.time
                  }
                </strong>
              </div>

              <div
                className={
                  styles.detailItem
                }
              >
                <span>Valor</span>

                <strong
                  className={
                    styles.priceValue
                  }
                >
                  {formatCurrency(
                    selectedAppointment.price,
                  )}
                </strong>
              </div>

              <div
                className={
                  styles.detailItem
                }
              >
                <span>Status atual</span>

                <strong>
                  {getStatusLabel(
                    selectedAppointment.status,
                  )}
                </strong>
              </div>

              {/* Status */}

              <label
                className={
                  styles.formSection
                }
              >
                <span>
                  Alterar status
                </span>

                <select
                  className={
                    styles.statusSelect
                  }
                  value={selectedStatus}
                  aria-label="Status do agendamento"
                  onChange={(event) =>
                    setSelectedStatus(
                      event.target
                        .value as AppointmentStatus,
                    )
                  }
                  disabled={
                    updatingAppointment
                  }
                >
                  <option value="PENDING">
                    Pendente
                  </option>

                  <option value="CONFIRMED">
                    Confirmado
                  </option>

                  <option value="CANCELLED">
                    Cancelado
                  </option>

                  <option value="FINISHED">
                    Finalizado
                  </option>
                </select>
              </label>

              {/* Observações */}

              <label
                className={
                  styles.formSection
                }
              >
                <span>
                  Observações internas
                </span>

                <textarea
                  className={
                    styles.notesField
                  }
                  value={notes}
                  onChange={(event) =>
                    setNotes(
                      event.target.value,
                    )
                  }
                  placeholder="Ex: cliente prefere cílios mais naturais..."
                  rows={4}
                  disabled={
                    updatingAppointment
                  }
                />
              </label>

              {/* Ações */}

              <div
                className={
                  styles.actionGroup
                }
              >
                <button
                  type="button"
                  className={
                    styles.saveButton
                  }
                  onClick={
                    handleUpdateAppointment
                  }
                  disabled={
                    updatingAppointment
                  }
                >
                  {updatingAppointment
                    ? "Salvando alterações..."
                    : "Salvar alterações"}
                </button>

                <div
                  className={
                    styles.quickActions
                  }
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickStatusChange(
                        "CONFIRMED",
                      )
                    }
                    disabled={
                      updatingAppointment
                    }
                  >
                    Confirmar
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuickStatusChange(
                        "FINISHED",
                      )
                    }
                    disabled={
                      updatingAppointment
                    }
                  >
                    Finalizar
                  </button>

                  <button
                    type="button"
                    className={
                      styles.dangerButton
                    }
                    onClick={() =>
                      handleQuickStatusChange(
                        "CANCELLED",
                      )
                    }
                    disabled={
                      updatingAppointment
                    }
                  >
                    Cancelar
                  </button>
                </div>

                <a
                  className={
                    styles.whatsappButton
                  }
                  href={`https://wa.me/55${selectedAppointment.client.phone}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Chamar no WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div
              className={
                styles.emptyState
              }
            >
              <div
                className={
                  styles.emptyIcon
                }
                aria-hidden="true"
              >
                ◈
              </div>

              <strong>
                Nenhum agendamento
                selecionado
              </strong>

              <p>
                Selecione um horário na
                agenda para visualizar
                informações e gerenciar o
                atendimento.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
