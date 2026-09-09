import { useEffect, useMemo, useState } from "react";
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
  const [selectedCategory, setSelectedCategory] = useState("Todos");

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

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        services
          .map((service) => service.category?.trim())
          .filter((category): category is string => Boolean(category)),
      ),
    );

    return ["Todos", ...uniqueCategories];
  }, [services]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === "Todos") {
      return services;
    }

    return services.filter(
      (service) => service.category === selectedCategory,
    );
  }, [services, selectedCategory]);

  useEffect(() => {
    if (
      selectedCategory !== "Todos" &&
      !categories.includes(selectedCategory)
    ) {
      setSelectedCategory("Todos");
    }
  }, [categories, selectedCategory]);

  return (
    <section
      id="servicos"
      className={styles.services}
      aria-labelledby="services-heading"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <span className={styles.eyebrow}>Serviços</span>

            {!loading && !error && services.length > 0 && (
              <span className={styles.serviceCount}>
                {services.length}{" "}
                {services.length === 1 ? "procedimento" : "procedimentos"}
              </span>
            )}
          </div>

          <h2 id="services-heading" className={styles.headline}>
            Técnicas para realçar
            <span> o seu olhar</span>
          </h2>

          <p className={styles.subheadline}>
            Escolha o procedimento ideal para sua rotina, seu estilo e o
            resultado que você deseja alcançar.
          </p>
        </header>

        {!loading && !error && categories.length > 1 && (
          <nav
            className={styles.categoryNav}
            aria-label="Filtrar serviços por categoria"
          >
            <div
              className={styles.categoryList}
              role="tablist"
              aria-label="Categorias de serviços"
            >
              {categories.map((category) => {
                const isActive = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.categoryButton} ${
                      isActive ? styles.categoryButtonActive : ""
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        {loading && (
          <div className={styles.grid} aria-label="Carregando serviços">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={styles.skeletonCard}
                aria-hidden="true"
              >
                <div className={styles.skeletonTag} />
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonTitleShort} />

                <div className={styles.skeletonMeta}>
                  <div className={styles.skeletonMetaItem} />
                  <div className={styles.skeletonPrice} />
                </div>

                <div className={styles.skeletonButton} />
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className={styles.stateCard} role="alert">
            <div className={styles.stateIcon} aria-hidden="true">
              !
            </div>

            <div>
              <strong>Não foi possível carregar os serviços.</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && services.length === 0 && (
          <div className={styles.stateCard}>
            <div className={styles.stateIcon} aria-hidden="true">
              —
            </div>

            <div>
              <strong>Nenhum serviço disponível no momento.</strong>
              <p>
                Entre em contato para saber mais sobre os procedimentos
                disponíveis.
              </p>
            </div>
          </div>
        )}

        {!loading && !error && services.length > 0 && (
          <>
            {filteredServices.length > 0 ? (
              <ul className={styles.grid}>
                {filteredServices.map((service) => (
                  <li key={service.id} className={styles.card}>
                    <div className={styles.cardTop}>
                      {service.category ? (
                        <span className={styles.tag}>
                          {service.category}
                        </span>
                      ) : (
                        <span className={styles.tagPlaceholder}>
                          Procedimento
                        </span>
                      )}

                      <span className={styles.cardIndex} aria-hidden="true">
                        {String(service.id).padStart(2, "0")}
                      </span>
                    </div>

                    <div className={styles.cardBody}>
                      <h3 className={styles.cardName}>{service.name}</h3>

                      <div className={styles.cardMeta}>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Duração</span>
                          <span className={styles.metaValue}>
                            {service.duration} min
                          </span>
                        </div>

                        <div className={styles.metaItemPrice}>
                          <span className={styles.metaLabel}>Investimento</span>
                          <span className={styles.price}>
                            {priceFormatter.format(service.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <a
                      href="#agendamento"
                      className={styles.cardCta}
                      aria-label={`Agendar ${service.name}`}
                    >
                      <span>Agendar procedimento</span>

                      <span className={styles.ctaArrow} aria-hidden="true">
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 8h9M8 3l5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyFilter}>
                <p>
                  Nenhum procedimento encontrado nesta categoria.
                </p>

                <button
                  type="button"
                  onClick={() => setSelectedCategory("Todos")}
                >
                  Ver todos os serviços
                </button>
              </div>
            )}

            <div className={styles.helpCard}>
              <div className={styles.helpContent}>
                <span className={styles.helpEyebrow}>
                  Ainda está em dúvida?
                </span>

                <h3 className={styles.helpTitle}>
                  Não sabe qual procedimento escolher?
                </h3>

                <p className={styles.helpDescription}>
                  Comece seu agendamento e encontre a melhor opção para o
                  resultado que você procura.
                </p>
              </div>

              <a href="#agendamento" className={styles.helpButton}>
                Quero ajuda para escolher
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h9M8 3l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}


