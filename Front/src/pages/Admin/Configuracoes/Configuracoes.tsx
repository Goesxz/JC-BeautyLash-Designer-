import { useEffect, useState } from "react";
import styles from "./Configuracoes.module.css";
import {
  getSettings,
  type SettingsResponse,
} from "../../../services/settingsApi";

export default function Configuracoes() {
  const [settings, setSettings] = useState<SettingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const data = await getSettings();

      setSettings(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao carregar configurações.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  if (loading) {
    return (
      <section className={styles.page}>
        <p className={styles.loading}>Carregando configurações...</p>
      </section>
    );
  }

  if (error || !settings) {
    return (
      <section className={styles.page}>
        <div className={styles.errorBox}>
          <h1>Erro ao carregar configurações</h1>

          <p>
            {error || "Não foi possível carregar as configurações."}
          </p>

          <button type="button" onClick={loadSettings}>
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
        <div className={styles.headerContent}>
          <p className={styles.eyebrow}>Configurações</p>

          <h1>Preferências do estúdio</h1>

          <p className={styles.headerDescription}>
            Consulte os dados principais do negócio, horários de atendimento
            e informações utilizadas no agendamento.
          </p>
        </div>

        <button type="button" onClick={loadSettings}>
          Atualizar
        </button>
      </header>

      {/* =========================
          CONTEÚDO
      ========================= */}

      <div className={styles.contentGrid}>
        {/* =========================
            DADOS DO NEGÓCIO
        ========================= */}

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <div className={styles.panelIcon}>01</div>

              <div>
                <h2>Dados do negócio</h2>
                <p>Informações principais do estúdio</p>
              </div>
            </div>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>N</div>

              <div className={styles.infoContent}>
                <span>Nome</span>
                <strong>{settings.business.name}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>E</div>

              <div className={styles.infoContent}>
                <span>Endereço</span>
                <strong>{settings.business.address}</strong>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>W</div>

              <div className={styles.infoContent}>
                <span>WhatsApp</span>
                <strong>{settings.business.whatsapp}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            HORÁRIOS
        ========================= */}

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <div className={styles.panelIcon}>02</div>

              <div>
                <h2>Horários de atendimento</h2>
                <p>Horários disponíveis para agendamento</p>
              </div>
            </div>
          </div>

          <div className={styles.tags}>
            {settings.schedule.workingHours.map((hour) => (
              <span key={hour} className={styles.tag}>
                {hour}
              </span>
            ))}
          </div>
        </section>

        {/* =========================
            DIAS DE FUNCIONAMENTO
        ========================= */}

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <div className={styles.panelIcon}>03</div>

              <div>
                <h2>Dias de funcionamento</h2>
                <p>Dias em que o estúdio recebe clientes</p>
              </div>
            </div>
          </div>

          <div className={styles.weekDays}>
            {settings.schedule.weekDays.map((day) => (
              <div key={day} className={styles.weekDay}>
                {day}
              </div>
            ))}
          </div>
        </section>

        {/* =========================
            PRÓXIMA EVOLUÇÃO
        ========================= */}

        <section className={styles.noticePanel}>
          <div className={styles.noticeContent}>
            <div className={styles.noticeIcon}>✦</div>

            <h2>Próxima evolução</h2>

            <p>
              Em breve esta tela poderá editar horários, dias de folga,
              endereço, WhatsApp, PIX, Instagram e regras de agendamento
              diretamente pelo painel, sem precisar alterar o código.
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}
