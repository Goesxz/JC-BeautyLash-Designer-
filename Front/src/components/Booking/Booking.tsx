import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  getServices,
  type ApiService,
} from "../../services/servicesApi";

import {
  createAppointment,
  getAvailableTimes,
} from "../../services/bookingApi";

import styles from "./Booking.module.css";

interface BookingFormState {
  name: string;
  whatsapp: string;
  serviceName: string;
  date: string;
  time: string;
  notes: string;
}

interface BookingFormErrors {
  name?: string;
  whatsapp?: string;
  serviceName?: string;
  date?: string;
  time?: string;
}

const initialFormState: BookingFormState = {
  name: "",
  whatsapp: "",
  serviceName: "",
  date: "",
  time: "",
  notes: "",
};

function getDateDayOfWeek(date: string): number | null {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.getDay();
}

function validate(
  form: BookingFormState,
  availableTimeSlots: string[],
): BookingFormErrors {
  const errors: BookingFormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Informe seu nome completo.";
  }

  if (!form.whatsapp.trim()) {
    errors.whatsapp = "Informe seu WhatsApp.";
  }

  if (!form.serviceName) {
    errors.serviceName = "Escolha um serviço.";
  }

  if (!form.date) {
    errors.date = "Escolha uma data.";
  }

  if (!form.time) {
    errors.time = "Escolha um horário.";
  }

  if (
    form.date &&
    form.time &&
    !availableTimeSlots.includes(form.time)
  ) {
    errors.time =
      "Esse horário não está mais disponível. Escolha outro.";
  }

  return errors;
}

function formatPhone(value: string): string {
  const numbers = value
    .replace(/\D/g, "")
    .slice(0, 11);

  if (numbers.length <= 2) {
    return numbers;
  }

  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(
    2,
    7,
  )}-${numbers.slice(7)}`;
}

function formatDate(date: string): string {
  if (!date) {
    return "Não selecionada";
  }

  const parsedDate = new Date(`${date}T12:00:00`);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function getToday(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(
    2,
    "0",
  );
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getScheduleDescription(date: string): string {
  const dayOfWeek = getDateDayOfWeek(date);

  if (dayOfWeek === null) {
    return "Selecione uma data para visualizar os horários.";
  }

  if (dayOfWeek === 0) {
    return "Domingo • 10:00 às 22:00 • almoço das 13:00 às 14:00";
  }

  if (dayOfWeek === 6) {
    return "Sábado • 18:00 às 23:00";
  }

  return "Segunda a sexta • 18:00 às 22:30";
}

export function Booking() {
  const [form, setForm] =
    useState<BookingFormState>(initialFormState);

  const [errors, setErrors] =
    useState<BookingFormErrors>({});

  const [isSubmitted, setIsSubmitted] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  const [services, setServices] =
    useState<ApiService[]>([]);

  const [servicesLoading, setServicesLoading] =
    useState(true);

  const [servicesError, setServicesError] =
    useState("");

  /**
   * Horários retornados pelo Backend.
   *
   * O Front não calcula mais os horários.
   */
  const [availableTimeSlots, setAvailableTimeSlots] =
    useState<string[]>([]);

  const [availableTimesLoading, setAvailableTimesLoading] =
    useState(false);

  const [availableTimesError, setAvailableTimesError] =
    useState("");

  /*
   * Carrega os serviços.
   */
  useEffect(() => {
    async function loadServices() {
      try {
        setServicesLoading(true);
        setServicesError("");

        const data = await getServices();

        setServices(
          data.filter((service) => service.active),
        );
      } catch (err) {
        setServicesError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar serviços.",
        );
      } finally {
        setServicesLoading(false);
      }
    }

    loadServices();
  }, []);

  /*
   * Busca os horários sempre que a data muda.
   *
   * O Backend decide quais horários podem ser exibidos.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadAvailableTimes() {
      if (!form.date) {
        setAvailableTimeSlots([]);
        setAvailableTimesError("");
        setAvailableTimesLoading(false);
        return;
      }

      try {
        setAvailableTimesLoading(true);
        setAvailableTimesError("");

        const times = await getAvailableTimes(
          form.date,
        );

        if (cancelled) {
          return;
        }

        setAvailableTimeSlots(times);

        /*
         * Caso o horário selecionado tenha sido ocupado
         * enquanto a pessoa estava preenchendo o formulário,
         * removemos a seleção.
         */
        setForm((previous) => {
          if (
            previous.time &&
            !times.includes(previous.time)
          ) {
            return {
              ...previous,
              time: "",
            };
          }

          return previous;
        });

        setErrors((previous) => {
          if (
            previous.time &&
            !times.includes(form.time)
          ) {
            return {
              ...previous,
              time: undefined,
            };
          }

          return previous;
        });
      } catch (err) {
        if (cancelled) {
          return;
        }

        setAvailableTimeSlots([]);

        setAvailableTimesError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar horários disponíveis.",
        );
      } finally {
        if (!cancelled) {
          setAvailableTimesLoading(false);
        }
      }
    }

    loadAvailableTimes();

    return () => {
      cancelled = true;
    };
  }, [form.date]);

  const selectedService = useMemo(
    () =>
      services.find(
        (service) =>
          service.name === form.serviceName,
      ),
    [services, form.serviceName],
  );

  const selectedServicePrice = selectedService
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(selectedService.price)
    : null;

  const scheduleDescription = useMemo(
    () => getScheduleDescription(form.date),
    [form.date],
  );

  function handleChange(
    field: keyof BookingFormState,
    value: string,
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    setSubmitError("");
  }

  function handleWhatsappChange(value: string) {
    handleChange(
      "whatsapp",
      formatPhone(value),
    );
  }

  function handleServiceSelect(
    serviceName: string,
  ) {
    handleChange(
      "serviceName",
      serviceName,
    );
  }

  function handleDateChange(date: string) {
    setForm((previous) => ({
      ...previous,
      date,
      time: "",
    }));

    setAvailableTimeSlots([]);
    setAvailableTimesError("");

    setErrors((previous) => ({
      ...previous,
      date: undefined,
      time: undefined,
    }));

    setSubmitError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const validationErrors = validate(
      form,
      availableTimeSlots,
    );

    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError("");

      await createAppointment({
        name: form.name,
        phone: form.whatsapp,
        service: form.serviceName,
        date: form.date,
        time: form.time,
      });

      setIsSubmitted(true);
      setForm(initialFormState);
      setAvailableTimeSlots([]);
      setAvailableTimesError("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível enviar sua solicitação. Tente novamente.";

      setSubmitError(message);

      /*
       * Se o horário foi ocupado por outra pessoa
       * exatamente enquanto o formulário era enviado,
       * atualizamos os horários imediatamente.
       */
      if (
        form.date &&
        form.time
      ) {
        try {
          const refreshedTimes =
            await getAvailableTimes(
              form.date,
            );

          setAvailableTimeSlots(
            refreshedTimes,
          );

          if (
            !refreshedTimes.includes(
              form.time,
            )
          ) {
            setForm((previous) => ({
              ...previous,
              time: "",
            }));

            setErrors((previous) => ({
              ...previous,
              time:
                "Esse horário acabou de ser ocupado. Escolha outro.",
            }));
          }
        } catch {
          // O erro principal já foi exibido ao usuário.
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNewRequest() {
    setIsSubmitted(false);
    setErrors({});
    setSubmitError("");
    setAvailableTimeSlots([]);
    setAvailableTimesError("");
  }

  return (
    <section
      id="agendamento"
      className={styles.booking}
      aria-labelledby="booking-heading"
    >
      <div
        className={styles.decorativeGlow}
        aria-hidden="true"
      />

      <div className={styles.container}>
        <header className={styles.intro}>
          <div className={styles.eyebrow}>
            <span
              className={styles.eyebrowLine}
              aria-hidden="true"
            />
            Agendamento
          </div>

          <h2
            id="booking-heading"
            className={styles.headline}
          >
            Seu olhar merece
            <span> um momento especial.</span>
          </h2>

          <p className={styles.subheadline}>
            Escolha o procedimento, encontre o melhor
            horário e envie sua solicitação. Cuidamos
            dos detalhes para você.
          </p>

          <div className={styles.introDetails}>
            <div className={styles.detail}>
              <span
                className={styles.detailNumber}
              >
                01
              </span>

              <div>
                <strong>Escolha</strong>
                <span>seu procedimento</span>
              </div>
            </div>

            <div className={styles.detail}>
              <span
                className={styles.detailNumber}
              >
                02
              </span>

              <div>
                <strong>Encontre</strong>
                <span>seu melhor horário</span>
              </div>
            </div>

            <div className={styles.detail}>
              <span
                className={styles.detailNumber}
              >
                03
              </span>

              <div>
                <strong>Confirme</strong>
                <span>seu atendimento</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.card}>
          {isSubmitted ? (
            <div
              className={styles.success}
              role="status"
            >
              <div
                className={styles.successIcon}
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="m5 12 4.2 4.2L19 6.5" />
                </svg>
              </div>

              <span
                className={styles.successEyebrow}
              >
                Tudo certo
              </span>

              <h3
                className={styles.successTitle}
              >
                Solicitação enviada.
              </h3>

              <p
                className={styles.successText}
              >
                Recebemos seus dados e sua preferência
                de horário. Em breve entraremos em
                contato pelo WhatsApp para confirmar a
                disponibilidade do atendimento.
              </p>

              <div
                className={styles.successDivider}
              />

              <button
                type="button"
                className={styles.successButton}
                onClick={handleNewRequest}
              >
                Fazer nova solicitação
                <span aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          ) : (
            <form
              className={styles.form}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className={styles.formHeader}>
                <div>
                  <span
                    className={styles.formEyebrow}
                  >
                    Reserve seu momento
                  </span>

                  <h3
                    className={styles.formTitle}
                  >
                    Vamos começar.
                  </h3>
                </div>

                <span
                  className={styles.formStep}
                >
                  01 <span>/ 04</span>
                </span>
              </div>

              {submitError && (
                <div
                  className={styles.submitError}
                  role="alert"
                >
                  <span
                    className={styles.errorDot}
                    aria-hidden="true"
                  />
                  {submitError}
                </div>
              )}

              <div className={styles.section}>
                <div
                  className={styles.sectionHeading}
                >
                  <span
                    className={styles.sectionNumber}
                  >
                    01
                  </span>

                  <div>
                    <h4>Seus dados</h4>
                    <p>
                      Como podemos falar com você?
                    </p>
                  </div>
                </div>

                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <label
                      htmlFor="booking-name"
                      className={styles.label}
                    >
                      Nome completo
                    </label>

                    <input
                      id="booking-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Digite seu nome"
                      className={styles.input}
                      value={form.name}
                      onChange={(event) =>
                        handleChange(
                          "name",
                          event.target.value,
                        )
                      }
                      aria-invalid={
                        errors.name
                          ? true
                          : undefined
                      }
                      aria-describedby={
                        errors.name
                          ? "booking-name-error"
                          : undefined
                      }
                    />

                    {errors.name && (
                      <span
                        id="booking-name-error"
                        className={styles.errorText}
                      >
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label
                      htmlFor="booking-whatsapp"
                      className={styles.label}
                    >
                      WhatsApp
                    </label>

                    <input
                      id="booking-whatsapp"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="(11) 99999-9999"
                      className={styles.input}
                      value={form.whatsapp}
                      onChange={(event) =>
                        handleWhatsappChange(
                          event.target.value,
                        )
                      }
                      aria-invalid={
                        errors.whatsapp
                          ? true
                          : undefined
                      }
                      aria-describedby={
                        errors.whatsapp
                          ? "booking-whatsapp-error"
                          : undefined
                      }
                    />

                    {errors.whatsapp && (
                      <span
                        id="booking-whatsapp-error"
                        className={styles.errorText}
                      >
                        {errors.whatsapp}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <div
                  className={styles.sectionHeading}
                >
                  <span
                    className={styles.sectionNumber}
                  >
                    02
                  </span>

                  <div>
                    <h4>Seu procedimento</h4>
                    <p>
                      Escolha o serviço ideal para você.
                    </p>
                  </div>
                </div>

                {servicesLoading ? (
                  <div
                    className={styles.serviceLoading}
                  >
                    <span
                      className={styles.loadingPulse}
                    />

                    <span>
                      Carregando serviços...
                    </span>
                  </div>
                ) : servicesError ? (
                  <div
                    className={styles.serviceError}
                    role="alert"
                  >
                    <span>
                      {servicesError}
                    </span>
                  </div>
                ) : services.length === 0 ? (
                  <div
                    className={styles.serviceError}
                  >
                    <span>
                      Nenhum serviço disponível no
                      momento.
                    </span>
                  </div>
                ) : (
                  <div
                    className={styles.serviceGrid}
                  >
                    {services.map(
                      (service, index) => {
                        const isSelected =
                          form.serviceName ===
                          service.name;

                        const formattedPrice =
                          new Intl.NumberFormat(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            },
                          ).format(
                            service.price,
                          );

                        return (
                          <button
                            key={service.id}
                            type="button"
                            className={`${
                              styles.serviceCard
                            } ${
                              isSelected
                                ? styles.serviceCardSelected
                                : ""
                            }`}
                            onClick={() =>
                              handleServiceSelect(
                                service.name,
                              )
                            }
                            aria-pressed={
                              isSelected
                            }
                          >
                            <span
                              className={
                                styles.serviceIndex
                              }
                            >
                              {String(
                                index + 1,
                              ).padStart(2, "0")}
                            </span>

                            <span
                              className={
                                styles.serviceInfo
                              }
                            >
                              {service.category && (
                                <span
                                  className={
                                    styles.serviceCategory
                                  }
                                >
                                  {
                                    service.category
                                  }
                                </span>
                              )}

                              <strong>
                                {service.name}
                              </strong>

                              <span
                                className={
                                  styles.serviceMeta
                                }
                              >
                                {service.duration} min
                              </span>
                            </span>

                            <span
                              className={
                                styles.servicePrice
                              }
                            >
                              {
                                formattedPrice
                              }
                            </span>

                            <span
                              className={
                                styles.serviceCheck
                              }
                              aria-hidden="true"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                              >
                                <path d="m5 12 4.2 4.2L19 6.5" />
                              </svg>
                            </span>
                          </button>
                        );
                      },
                    )}
                  </div>
                )}

                {errors.serviceName && (
                  <span
                    className={styles.errorText}
                  >
                    {errors.serviceName}
                  </span>
                )}
              </div>

              <div className={styles.section}>
                <div
                  className={styles.sectionHeading}
                >
                  <span
                    className={styles.sectionNumber}
                  >
                    03
                  </span>

                  <div>
                    <h4>Data e horário</h4>
                    <p>
                      Quando você gostaria de ser
                      atendida?
                    </p>
                  </div>
                </div>

                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <label
                      htmlFor="booking-date"
                      className={styles.label}
                    >
                      Data preferida
                    </label>

                    <input
                      id="booking-date"
                      type="date"
                      min={getToday()}
                      className={styles.input}
                      value={form.date}
                      onChange={(event) =>
                        handleDateChange(
                          event.target.value,
                        )
                      }
                      aria-invalid={
                        errors.date
                          ? true
                          : undefined
                      }
                      aria-describedby={
                        errors.date
                          ? "booking-date-error"
                          : undefined
                      }
                    />

                    {errors.date && (
                      <span
                        id="booking-date-error"
                        className={styles.errorText}
                      >
                        {errors.date}
                      </span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <span className={styles.label}>
                      Horário disponível
                    </span>

                    <div
                      className={styles.timeGrid}
                      role="group"
                      aria-label="Horários disponíveis"
                    >
                      {availableTimesLoading ? (
                        <span
                          className={
                            styles.serviceLoading
                          }
                        >
                          <span
                            className={
                              styles.loadingPulse
                            }
                          />

                          <span>
                            Consultando horários...
                          </span>
                        </span>
                      ) : availableTimesError ? (
                        <span
                          className={
                            styles.serviceError
                          }
                          role="alert"
                        >
                          {availableTimesError}
                        </span>
                      ) : !form.date ? (
                        <span
                          className={
                            styles.serviceError
                          }
                        >
                          Selecione uma data para
                          visualizar os horários.
                        </span>
                      ) : availableTimeSlots.length ===
                        0 ? (
                        <span
                          className={
                            styles.serviceError
                          }
                        >
                          Nenhum horário disponível
                          para esta data.
                        </span>
                      ) : (
                        availableTimeSlots.map(
                          (slot) => {
                            const isSelected =
                              form.time ===
                              slot;

                            return (
                              <button
                                key={slot}
                                type="button"
                                className={`${
                                  styles.timeButton
                                } ${
                                  isSelected
                                    ? styles.timeButtonSelected
                                    : ""
                                }`}
                                onClick={() =>
                                  handleChange(
                                    "time",
                                    slot,
                                  )
                                }
                                aria-pressed={
                                  isSelected
                                }
                              >
                                {slot}
                              </button>
                            );
                          },
                        )
                      )}
                    </div>

                    <span
                      className={
                        styles.scheduleHint
                      }
                    >
                      {scheduleDescription}
                    </span>

                    {errors.time && (
                      <span
                        className={
                          styles.errorText
                        }
                      >
                        {errors.time}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <div
                  className={styles.sectionHeading}
                >
                  <span
                    className={styles.sectionNumber}
                  >
                    04
                  </span>

                  <div>
                    <h4>
                      Alguma observação?
                    </h4>

                    <p>
                      Conte algo que devemos saber
                      antes do atendimento.
                    </p>
                  </div>
                </div>

                <div className={styles.field}>
                  <label
                    htmlFor="booking-notes"
                    className={styles.label}
                  >
                    Observações

                    <span
                      className={styles.optional}
                    >
                      Opcional
                    </span>
                  </label>

                  <textarea
                    id="booking-notes"
                    className={styles.textarea}
                    rows={4}
                    placeholder="Escreva aqui, se desejar..."
                    value={form.notes}
                    onChange={(event) =>
                      handleChange(
                        "notes",
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className={styles.summary}>
                <div
                  className={styles.summaryHeader}
                >
                  <span>Resumo</span>

                  <span
                    className={
                      styles.summaryStatus
                    }
                  >
                    {selectedService
                      ? "Pronto"
                      : "Pendente"}
                  </span>
                </div>

                <div
                  className={
                    styles.summaryContent
                  }
                >
                  <div
                    className={
                      styles.summaryService
                    }
                  >
                    <span
                      className={
                        styles.summaryLabel
                      }
                    >
                      Serviço
                    </span>

                    <strong>
                      {selectedService
                        ? selectedService.name
                        : "Selecione um serviço"}
                    </strong>

                    {selectedService && (
                      <span>
                        {selectedService.duration}{" "}
                        minutos
                      </span>
                    )}
                  </div>

                  <div
                    className={
                      styles.summaryItem
                    }
                  >
                    <span>Data</span>

                    <strong>
                      {form.date
                        ? formatDate(
                            form.date,
                          )
                        : "Não selecionada"}
                    </strong>
                  </div>

                  <div
                    className={
                      styles.summaryItem
                    }
                  >
                    <span>Horário</span>

                    <strong>
                      {form.time ||
                        "Não selecionado"}
                    </strong>
                  </div>

                  {selectedServicePrice && (
                    <div
                      className={
                        styles.summaryPrice
                      }
                    >
                      <span>Valor</span>

                      <strong>
                        {
                          selectedServicePrice
                        }
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className={
                  styles.submitButton
                }
                disabled={
                  isSubmitting ||
                  servicesLoading ||
                  availableTimesLoading
                }
              >
                <span>
                  {isSubmitting
                    ? "Enviando solicitação..."
                    : "Solicitar meu horário"}
                </span>

                {!isSubmitting && (
                  <span
                    className={
                      styles.submitArrow
                    }
                    aria-hidden="true"
                  >
                    →
                  </span>
                )}
              </button>

              <p
                className={
                  styles.formDisclaimer
                }
              >
                Ao enviar sua solicitação, você
                concorda em receber o contato necessário
                para confirmação do atendimento.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
