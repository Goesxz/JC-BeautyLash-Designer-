import { useEffect, useMemo, useState } from "react";

import styles from "./Clientes.module.css";
import {
  getClients,
  type Client,
} from "../../../services/clientApi";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(date?: string) {
  if (!date) return "Sem histórico";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );
}

function getClientInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export default function Clientes() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] =
    useState<Client | null>(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadClients() {
    try {
      setLoading(true);
      setError("");

      const data = await getClients();

      setClients(data.clients);

      setSelectedClient(
        data.clients[0] || null,
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao carregar clientes.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return clients;

    return clients.filter((client) => {
      return (
        client.name
          .toLowerCase()
          .includes(term) ||
        client.phone.includes(term)
      );
    });
  }, [clients, search]);

  const totalRevenue = useMemo(() => {
    return clients.reduce(
      (total, client) =>
        total + client.totalSpent,
      0,
    );
  }, [clients]);

  const recurringClients = useMemo(() => {
    return clients.filter(
      (client) =>
        client.totalAppointments > 1,
    ).length;
  }, [clients]);

  if (loading) {
    return (
      <section className={styles.page}>
        <div className={styles.loadingState}>
          <div
            className={styles.loadingSpinner}
            aria-hidden="true"
          />

          <strong>
            Carregando clientes
          </strong>

          <p>
            Preparando sua base de clientes...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.page}>
        <div
          className={styles.errorBox}
          role="alert"
        >
          <div
            className={styles.errorIcon}
            aria-hidden="true"
          >
            !
          </div>

          <h1>
            Erro ao carregar clientes
          </h1>

          <p>{error}</p>

          <button
            type="button"
            onClick={loadClients}
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
            Clientes
          </p>

          <h1>Base de clientes</h1>

          <p className={styles.headerDescription}>
            Gerencie seus clientes e acompanhe
            relacionamento, recorrência e valor
            gerado.
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            onClick={loadClients}
            disabled={loading}
          >
            <span aria-hidden="true">
              ↻
            </span>

            Atualizar
          </button>
        </div>
      </header>

      {/* =========================
          MÉTRICAS
      ========================= */}

      <section
        className={styles.metricsGrid}
        aria-label="Resumo dos clientes"
      >
        <article className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>
              Total de clientes
            </span>

            <span
              className={styles.metricIcon}
              aria-hidden="true"
            >
              01
            </span>
          </div>

          <strong className={styles.metricValue}>
            {clients.length}
          </strong>

          <span
            className={styles.metricDescription}
          >
            clientes cadastradas
          </span>
        </article>

        <article className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>
              Receita total
            </span>

            <span
              className={styles.metricIcon}
              aria-hidden="true"
            >
              R$
            </span>
          </div>

          <strong
            className={`${styles.metricValue} ${styles.metricCurrency}`}
          >
            {formatCurrency(totalRevenue)}
          </strong>

          <span
            className={styles.metricDescription}
          >
            valor gerado pela base
          </span>
        </article>

        <article className={styles.metricCard}>
          <div className={styles.metricTop}>
            <span className={styles.metricLabel}>
              Clientes recorrentes
            </span>

            <span
              className={styles.metricIcon}
              aria-hidden="true"
            >
              ↗
            </span>
          </div>

          <strong className={styles.metricValue}>
            {recurringClients}
          </strong>

          <span
            className={styles.metricDescription}
          >
            mais de um agendamento
          </span>
        </article>
      </section>

      {/* =========================
          CONTEÚDO
      ========================= */}

      <div className={styles.contentGrid}>
        {/* =========================
            LISTA
        ========================= */}

        <section className={styles.listPanel}>
          <div className={styles.panelHeader}>
            <div
              className={styles.panelTitleGroup}
            >
              <h2>Clientes</h2>

              <p>
                Selecione uma cliente para
                visualizar o perfil.
              </p>
            </div>

            <span
              className={styles.panelCount}
            >
              {filteredClients.length}
            </span>
          </div>

          {/* Busca */}

          <div className={styles.searchWrapper}>
            <span
              className={styles.searchIcon}
              aria-hidden="true"
            >
              ⌕
            </span>

            <input
              className={styles.searchInput}
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Buscar por nome ou telefone..."
              aria-label="Buscar clientes"
            />

            {search && (
              <button
                type="button"
                className={
                  styles.clearSearch
                }
                onClick={() =>
                  setSearch("")
                }
                aria-label="Limpar busca"
              >
                ×
              </button>
            )}
          </div>

          {/* Lista */}

          <div
            className={styles.clientList}
            role="list"
          >
            {filteredClients.map(
              (client) => {
                const isActive =
                  selectedClient?.id ===
                  client.id;

                return (
                  <button
                    key={client.id}
                    type="button"
                    role="listitem"
                    aria-pressed={isActive}
                    className={`${styles.clientCard} ${
                      isActive
                        ? styles.clientCardActive
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedClient(
                        client,
                      )
                    }
                  >
                    <div
                      className={
                        styles.clientAvatar
                      }
                      aria-hidden="true"
                    >
                      {getClientInitial(
                        client.name,
                      )}
                    </div>

                    <div
                      className={
                        styles.clientMain
                      }
                    >
                      <strong>
                        {client.name}
                      </strong>

                      <span>
                        {client.phone}
                      </span>
                    </div>

                    <div
                      className={
                        styles.clientMeta
                      }
                    >
                      <strong>
                        {
                          client.totalAppointments
                        }
                      </strong>

                      <span>
                        agend.
                      </span>
                    </div>

                    <span
                      className={
                        styles.clientArrow
                      }
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>
                );
              },
            )}

            {filteredClients.length ===
              0 && (
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
                  ⌕
                </div>

                <strong>
                  Nenhuma cliente encontrada
                </strong>

                <p>
                  Tente buscar por outro
                  nome ou número de
                  telefone.
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                  >
                    Limpar busca
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* =========================
            PERFIL
        ========================= */}

        <aside
          className={styles.detailsPanel}
          aria-label="Perfil da cliente"
        >
          {selectedClient ? (
            <>
              {/* Cabeçalho do perfil */}

              <div
                className={
                  styles.profileHeader
                }
              >
                <div
                  className={
                    styles.profileIdentity
                  }
                >
                  <div
                    className={
                      styles.profileAvatar
                    }
                    aria-hidden="true"
                  >
                    {getClientInitial(
                      selectedClient.name,
                    )}
                  </div>

                  <div>
                    <p
                      className={
                        styles.profileEyebrow
                      }
                    >
                      Perfil da cliente
                    </p>

                    <h2>
                      {
                        selectedClient.name
                      }
                    </h2>

                    <span>
                      {
                        selectedClient.phone
                      }
                    </span>
                  </div>
                </div>

                <a
                  className={
                    styles.whatsappButton
                  }
                  href={`https://wa.me/55${selectedClient.phone}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span
                    aria-hidden="true"
                  >
                    ↗
                  </span>

                  WhatsApp
                </a>
              </div>

              {/* Status do cliente */}

              <div
                className={
                  styles.clientStatus
                }
              >
                <span
                  className={
                    styles.statusDot
                  }
                  aria-hidden="true"
                />

                <span>
                  {selectedClient.totalAppointments >
                  1
                    ? "Cliente recorrente"
                    : "Primeiro atendimento"}
                </span>
              </div>

              {/* Estatísticas */}

              <div
                className={
                  styles.profileStats
                }
              >
                <div
                  className={
                    styles.profileStat
                  }
                >
                  <span>
                    Total gasto
                  </span>

                  <strong>
                    {formatCurrency(
                      selectedClient.totalSpent,
                    )}
                  </strong>

                  <small>
                    valor acumulado
                  </small>
                </div>

                <div
                  className={
                    styles.profileStat
                  }
                >
                  <span>
                    Agendamentos
                  </span>

                  <strong>
                    {
                      selectedClient.totalAppointments
                    }
                  </strong>

                  <small>
                    atendimentos
                  </small>
                </div>

                <div
                  className={
                    styles.profileStat
                  }
                >
                  <span>
                    Última visita
                  </span>

                  <strong>
                    {formatDate(
                      selectedClient
                        .lastAppointment
                        ?.date,
                    )}
                  </strong>

                  <small>
                    último atendimento
                  </small>
                </div>
              </div>

              {/* Informações */}

              <div
                className={
                  styles.infoSection
                }
              >
                <div
                  className={
                    styles.sectionHeading
                  }
                >
                  <div>
                    <p>
                      Informações
                    </p>

                    <h3>
                      Resumo do cliente
                    </h3>
                  </div>
                </div>

                <div
                  className={
                    styles.infoGrid
                  }
                >
                  <div
                    className={
                      styles.infoItem
                    }
                  >
                    <span>
                      Nome completo
                    </span>

                    <strong>
                      {
                        selectedClient.name
                      }
                    </strong>
                  </div>

                  <div
                    className={
                      styles.infoItem
                    }
                  >
                    <span>
                      Telefone
                    </span>

                    <strong>
                      {
                        selectedClient.phone
                      }
                    </strong>
                  </div>
                </div>
              </div>

              {/* Histórico */}

              <div
                className={
                  styles.history
                }
              >
                <div
                  className={
                    styles.historyHeader
                  }
                >
                  <div>
                    <p>
                      Histórico
                    </p>

                    <h3>
                      Atendimentos
                    </h3>
                  </div>

                  <span
                    className={
                      styles.historyCount
                    }
                  >
                    {
                      selectedClient.totalAppointments
                    }
                  </span>
                </div>

                {selectedClient
                  .lastAppointment ? (
                  <div
                    className={
                      styles.historyItem
                    }
                  >
                    <div
                      className={
                        styles.historyIndicator
                      }
                    />

                    <div
                      className={
                        styles.historyContent
                      }
                    >
                      <strong>
                        Último atendimento
                      </strong>

                      <span>
                        {formatDate(
                          selectedClient
                            .lastAppointment
                            .date,
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className={
                      styles.historyEmpty
                    }
                  >
                    <span>
                      Nenhum atendimento
                      registrado ainda.
                    </span>
                  </div>
                )}
              </div>

              {/* Ação principal */}

              <a
                className={
                  styles.primaryContactButton
                }
                href={`https://wa.me/55${selectedClient.phone}`}
                target="_blank"
                rel="noreferrer"
              >
                Entrar em contato com{" "}
                {selectedClient.name}
              </a>
            </>
          ) : (
            <div
              className={
                styles.profileEmpty
              }
            >
              <div
                className={
                  styles.emptyIconLarge
                }
                aria-hidden="true"
              >
                ◈
              </div>

              <strong>
                Nenhuma cliente
                selecionada
              </strong>

              <p>
                Selecione uma cliente na
                lista para visualizar seu
                perfil, histórico e
                informações.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
