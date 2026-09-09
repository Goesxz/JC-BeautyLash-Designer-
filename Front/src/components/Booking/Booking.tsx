import { useEffect, useState, type FormEvent } from "react";
import { getServices, type ApiService } from "../../services/servicesApi";
import { createAppointment } from "../../services/bookingApi";
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

const timeSlots: string[] = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const initialFormState: BookingFormState = {
  name: "",
  whatsapp: "",
  serviceName: "",
  date: "",
  time: "",
  notes: "",
};

function validate(form: BookingFormState): BookingFormErrors {
  const errors: BookingFormErrors = {};

  if (!form.name.trim()) errors.name = "Informe seu nome completo.";
  if (!form.whatsapp.trim()) errors.whatsapp = "Informe um número de WhatsApp.";
  if (!form.serviceName) errors.serviceName = "Selecione o serviço desejado.";
  if (!form.date) errors.date = "Selecione a data preferida.";
  if (!form.time) errors.time = "Selecione o horário preferido.";

  return errors;
}

export function Booking() {
  const [form, setForm] = useState<BookingFormState>(initialFormState);
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [services, setServices] = useState<ApiService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");

  useEffect(() => {
    async function loadServices() {
      try {
        setServicesLoading(true);
        setServicesError("");

        const data = await getServices();
        setServices(data.filter((service) => service.active));
      } catch (err) {
        setServicesError(
          err instanceof Error ? err.message : "Erro ao carregar serviços.",
        );
      } finally {
        setServicesLoading(false);
      }
    }

    loadServices();
  }, []);

  function handleChange(field: keyof BookingFormState, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

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
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Erro ao enviar agendamento. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNewRequest() {
    setIsSubmitted(false);
  }

  return (
    <section
      id="agendamento"
      className={styles.booking}
      aria-labelledby="booking-heading"
    >
      <div className={styles.container}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>Agendamento</span>
          <h2 id="booking-heading" className={styles.headline}>
            Escolha seu horário com cuidado
          </h2>
          <p className={styles.subheadline}>
            Preencha as informações abaixo para solicitar seu agendamento. A
            confirmação será feita após a validação da disponibilidade.
          </p>
        </div>

        <div className={styles.card}>
          {isSubmitted ? (
            <div className={styles.success} role="status">
              <span className={styles.successMark} aria-hidden="true" />
              <h3 className={styles.successTitle}>Solicitação enviada</h3>
              <p className={styles.successText}>
                Recebemos seu pedido de agendamento. Em breve entraremos em
                contato pelo WhatsApp informado para confirmar o horário.
              </p>
              <button
                type="button"
                className={styles.successButton}
                onClick={handleNewRequest}
              >
                Fazer nova solicitação
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {submitError && (
                <div className={styles.errorText} role="alert">
                  {submitError}
                </div>
              )}

              <div className={styles.field}>
                <label htmlFor="booking-name" className={styles.label}>
                  Nome completo
                </label>
                <input
                  id="booking-name"
                  type="text"
                  className={styles.input}
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={
                    errors.name ? "booking-name-error" : undefined
                  }
                />
                {errors.name && (
                  <span id="booking-name-error" className={styles.errorText}>
                    {errors.name}
                  </span>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="booking-whatsapp" className={styles.label}>
                  WhatsApp
                </label>
                <input
                  id="booking-whatsapp"
                  type="tel"
                  className={styles.input}
                  value={form.whatsapp}
                  onChange={(event) =>
                    handleChange("whatsapp", event.target.value)
                  }
                  aria-invalid={errors.whatsapp ? true : undefined}
                  aria-describedby={
                    errors.whatsapp ? "booking-whatsapp-error" : undefined
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

              <div className={styles.field}>
                <label htmlFor="booking-service" className={styles.label}>
                  Serviço desejado
                </label>
                <select
                  id="booking-service"
                  className={styles.select}
                  value={form.serviceName}
                  onChange={(event) =>
                    handleChange("serviceName", event.target.value)
                  }
                  disabled={servicesLoading}
                  aria-invalid={errors.serviceName ? true : undefined}
                  aria-describedby={
                    errors.serviceName ? "booking-service-error" : undefined
                  }
                >
                  <option value="">
                    {servicesLoading
                      ? "Carregando serviços..."
                      : "Selecione um serviço"}
                  </option>
                  {services.map((service) => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {servicesError && (
                  <span className={styles.errorText} role="alert">
                    {servicesError}
                  </span>
                )}
                {errors.serviceName && (
                  <span id="booking-service-error" className={styles.errorText}>
                    {errors.serviceName}
                  </span>
                )}
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="booking-date" className={styles.label}>
                    Data preferida
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    className={styles.input}
                    value={form.date}
                    onChange={(event) =>
                      handleChange("date", event.target.value)
                    }
                    aria-invalid={errors.date ? true : undefined}
                    aria-describedby={
                      errors.date ? "booking-date-error" : undefined
                    }
                  />
                  {errors.date && (
                    <span id="booking-date-error" className={styles.errorText}>
                      {errors.date}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="booking-time" className={styles.label}>
                    Horário preferido
                  </label>
                  <select
                    id="booking-time"
                    className={styles.select}
                    value={form.time}
                    onChange={(event) =>
                      handleChange("time", event.target.value)
                    }
                    aria-invalid={errors.time ? true : undefined}
                    aria-describedby={
                      errors.time ? "booking-time-error" : undefined
                    }
                  >
                    <option value="">Selecione um horário</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {errors.time && (
                    <span id="booking-time-error" className={styles.errorText}>
                      {errors.time}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="booking-notes" className={styles.label}>
                  Observações
                </label>
                <textarea
                  id="booking-notes"
                  className={styles.textarea}
                  rows={3}
                  value={form.notes}
                  onChange={(event) =>
                    handleChange("notes", event.target.value)
                  }
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Solicitar agendamento"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
