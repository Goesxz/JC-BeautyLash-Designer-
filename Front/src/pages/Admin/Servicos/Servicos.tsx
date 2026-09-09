import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./Servicos.module.css";
import {
  createService,
  getServices,
  updateService,
  type ServiceItem,
} from "../../../services/serviceApi";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const initialForm = {
  name: "",
  category: "",
  price: "",
  duration: "120",
};

export default function Servicos() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null,
  );
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadServices() {
    try {
      setLoading(true);
      setError("");

      const data = await getServices();

      setServices(data.services);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao carregar serviços.",
      );
    } finally {
      setLoading(false);
    }
  }

  function selectService(service: ServiceItem) {
    setSelectedService(service);
    setSuccess("");
    setError("");
    setForm({
      name: service.name,
      category: service.category || "",
      price: String(service.price),
      duration: String(service.duration),
    });
  }

  function clearForm() {
    setSelectedService(null);
    setForm(initialForm);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (!form.name.trim() || !form.price || !form.duration) {
        setError("Informe nome, preço e duração.");
        return;
      }

      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        duration: Number(form.duration),
      };

      if (selectedService) {
        await updateService(selectedService.id, payload);
        setSuccess("Serviço atualizado com sucesso.");
      } else {
        await createService(payload);
        setSuccess("Serviço criado com sucesso.");
      }

      await loadServices();
      clearForm();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao salvar serviço.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(service: ServiceItem) {
    try {
      setError("");
      setSuccess("");

      await updateService(service.id, {
        active: !service.active,
      });

      await loadServices();

      setSuccess(
        service.active
          ? "Serviço desativado com sucesso."
          : "Serviço ativado com sucesso.",
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao alterar serviço.",
      );
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const activeServices = useMemo(
    () => services.filter((service) => service.active),
    [services],
  );

  if (loading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Carregando serviços...</p>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Serviços</p>
          <h1>Catálogo de serviços</h1>
          <p>Gerencie procedimentos, preços, duração e disponibilidade.</p>
        </div>

        <button type="button" onClick={clearForm}>
          Novo serviço
        </button>
      </header>

      <section className={styles.metricsGrid}>
        <article className={styles.metricCard}>
          <span>Total de serviços</span>
          <strong>{services.length}</strong>
        </article>

        <article className={styles.metricCard}>
          <span>Serviços ativos</span>
          <strong>{activeServices.length}</strong>
        </article>

        <article className={styles.metricCard}>
          <span>Preço médio</span>
          <strong>
            {formatCurrency(
              activeServices.length
                ? activeServices.reduce(
                    (total, service) => total + service.price,
                    0,
                  ) / activeServices.length
                : 0,
            )}
          </strong>
        </article>
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.listPanel}>
          <div className={styles.panelHeader}>
            <h2>Serviços cadastrados</h2>
            <span>{services.length} registros</span>
          </div>

          <div className={styles.serviceList}>
            {services.map((service) => (
              <article
                key={service.id}
                className={`${styles.serviceCard} ${
                  !service.active ? styles.serviceCardInactive : ""
                }`}
              >
                <button type="button" onClick={() => selectService(service)}>
                  <div>
                    <strong>{service.name}</strong>
                    <span>{service.category || "Sem categoria"}</span>
                  </div>

                  <div>
                    <strong>{formatCurrency(service.price)}</strong>
                    <span>{service.duration} min</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={() => toggleActive(service)}
                >
                  {service.active ? "Desativar" : "Ativar"}
                </button>
              </article>
            ))}

            {services.length === 0 && (
              <p className={styles.empty}>Nenhum serviço cadastrado.</p>
            )}
          </div>
        </section>

        <aside className={styles.formPanel}>
          <div className={styles.panelHeader}>
            <h2>{selectedService ? "Editar serviço" : "Novo serviço"}</h2>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              Nome do serviço
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Ex: Fio a Fio - Aplicação"
              />
            </label>

            <label>
              Categoria
              <input
                type="text"
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                placeholder="Ex: Fio a Fio"
              />
            </label>

            <label>
              Preço
              <input
                type="number"
                value={form.price}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    price: event.target.value,
                  }))
                }
                placeholder="80"
                min="0"
              />
            </label>

            <label>
              Duração em minutos
              <input
                type="number"
                value={form.duration}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    duration: event.target.value,
                  }))
                }
                placeholder="120"
                min="1"
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}

            <button type="submit" disabled={saving}>
              {saving
                ? "Salvando..."
                : selectedService
                  ? "Salvar alterações"
                  : "Criar serviço"}
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
}
