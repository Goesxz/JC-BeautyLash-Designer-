import { useEffect, useMemo, useState } from "react";
import styles from "./Clientes.module.css";
import { getClients, type Client } from "../../../services/clientApi";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(date?: string) {
  if (!date) return "Sem histórico";

  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
}

export default function Clientes() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadClients() {
    try {
      setLoading(true);
      setError("");

      const data = await getClients();

      setClients(data.clients);
      setSelectedClient(data.clients[0] || null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao carregar clientes.",
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
        client.name.toLowerCase().includes(term) || client.phone.includes(term)
      );
    });
  }, [clients, search]);

  if (loading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Carregando clientes...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.page}>
        <div className={styles.errorBox}>
          <h1>Erro ao carregar clientes</h1>
          <p>{error}</p>
          <button type="button" onClick={loadClients}>
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
          <p className={styles.eyebrow}>Clientes</p>
          <h1>Base de clientes</h1>
          <p>Acompanhe histórico, recorrência e valor gerado por cliente.</p>
        </div>

        <button type="button" onClick={loadClients}>
          Atualizar
        </button>
      </header>

      <section className={styles.metricsGrid}>
        <article className={styles.metricCard}>
          <span>Total de clientes</span>
          <strong>{clients.length}</strong>
        </article>

        <article className={styles.metricCard}>
          <span>Receita total</span>
          <strong>
            {formatCurrency(
              clients.reduce((total, client) => total + client.totalSpent, 0),
            )}
          </strong>
        </article>

        <article className={styles.metricCard}>
          <span>Clientes recorrentes</span>
          <strong>
            {clients.filter((client) => client.totalAppointments > 1).length}
          </strong>
        </article>
      </section>

      <div className={styles.contentGrid}>
        <section className={styles.listPanel}>
          <div className={styles.panelHeader}>
            <h2>Clientes</h2>
            <span>{filteredClients.length} registros</span>
          </div>

          <input
            className={styles.searchInput}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome ou telefone..."
          />

          <div className={styles.clientList}>
            {filteredClients.map((client) => (
              <button
                key={client.id}
                type="button"
                className={`${styles.clientCard} ${
                  selectedClient?.id === client.id
                    ? styles.clientCardActive
                    : ""
                }`}
                onClick={() => setSelectedClient(client)}
              >
                <div>
                  <strong>{client.name}</strong>
                  <span>{client.phone}</span>
                </div>

                <small>{client.totalAppointments} ag.</small>
              </button>
            ))}

            {filteredClients.length === 0 && (
              <p className={styles.empty}>Nenhuma cliente encontrada.</p>
            )}
          </div>
        </section>

        <aside className={styles.detailsPanel}>
          {selectedClient ? (
            <>
              <div className={styles.profileHeader}>
                <div>
                  <p className={styles.eyebrow}>Perfil</p>
                  <h2>{selectedClient.name}</h2>
                  <span>{selectedClient.phone}</span>
                </div>

                <a
                  href={`https://wa.me/55${selectedClient.phone}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </div>

              <div className={styles.profileStats}>
                <div>
                  <span>Total gasto</span>
                  <strong>{formatCurrency(selectedClient.totalSpent)}</strong>
                </div>

                <div>
                  <span>Agendamentos</span>
                  <strong>{selectedClient.totalAppointments}</strong>
                </div>

                <div>
                  <span>Última visita</span>
                  <strong>
                    {formatDate(selectedClient.lastAppointment?.date)}
                  </strong>
                </div>
              </div>

              <div className={styles.history}>
                <div className={styles.panelHeader}>
                  <h3>Resumo</h3>
                </div>

                <p>
                  Cliente cadastrada automaticamente após o primeiro
                  agendamento. Em breve esta área terá histórico completo de
                  atendimentos.
                </p>
              </div>
            </>
          ) : (
            <p className={styles.empty}>Selecione uma cliente.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
