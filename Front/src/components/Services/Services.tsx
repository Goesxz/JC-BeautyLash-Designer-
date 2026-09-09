import { useEffect, useState } from "react";
import { getServices, type ApiService } from "../../services/servicesApi";
import styles from "./Services.module.css";

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function Services() {
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        setError("");

        const data = await getServices();
        setServices(data.filter((service) => service.active));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar serviços.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  return (
    <section
      id="servicos"
      className={styles.services}
      aria-labelledby="services-heading"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Serviços</span>
          <h2 id="services-heading" className={styles.headline}>
            Técnicas para realçar o seu olhar
          </h2>
          <p className={styles.subheadline}>
            Escolha o procedimento ideal para sua rotina, seu estilo e o
            resultado que você deseja alcançar.
          </p>
        </header>

        {loading && (
          <p className={styles.subheadline}>Carregando serviços...</p>
        )}

        {error && !loading && (
          <p className={styles.subheadline} role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <ul className={styles.grid}>
            {services.map((service) => (
              <li key={service.id} className={styles.card}>
                {service.category && (
                  <span className={styles.tag}>{service.category}</span>
                )}

                <h3 className={styles.cardName}>{service.name}</h3>

                <div className={styles.cardMeta}>
                  <span className={styles.duration}>
                    {service.duration} min
                  </span>
                  <span className={styles.price}>
                    {priceFormatter.format(service.price)}
                  </span>
                </div>

                <a href="#agendamento" className={styles.cardCta}>
                  Agendar este serviço
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
