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
          <p>{error || "Não foi possível carregar as configurações."}</p>

          <button type="button" onClick={loadSettings}>
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
          <p className={styles.eyebrow}>Configurações</p>
          <h1>Preferências do estúdio</h1>
          <p>
            Consulte os dados principais do negócio, horários de atendimento e
            informações usadas no agendamento.
          </p>
        </div>

        <button type="button" onClick={loadSettings}>
          Atualizar
        </button>
      </header>

      <div className={styles.contentGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Dados do negócio</h2>
          </div>

          <div className={styles.infoList}>
            <div>
              <span>Nome</span>
              <strong>{settings.business.name}</strong>
            </div>

            <div>
              <span>Endereço</span>
              <strong>{settings.business.address}</strong>
            </div>

            <div>
              <span>WhatsApp</span>
              <strong>{settings.business.whatsapp}</strong>
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Horários de atendimento</h2>
          </div>

          <div className={styles.tags}>
            {settings.schedule.workingHours.map((hour) => (
              <span key={hour}>{hour}</span>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Dias de funcionamento</h2>
          </div>

          <div className={styles.tags}>
            {settings.schedule.weekDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </section>

        <section className={styles.noticePanel}>
          <h2>Próxima evolução</h2>
          <p>
            Em breve esta tela poderá editar horários, dias de folga, endereço,
            WhatsApp, PIX, Instagram e regras de agendamento sem mexer no
            código.
          </p>
        </section>
      </div>
    </section>
  );
}
