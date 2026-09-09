import styles from "../Agenda.module.css";

type AgendaHeaderProps = {
  selectedDate: string;
  formattedDate: string;
  onDateChange: (date: string) => void;
  onGoToday: () => void;
};

export default function AgendaHeader({
  selectedDate,
  formattedDate,
  onDateChange,
  onGoToday,
}: AgendaHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>Agenda</p>
        <h1>Agenda diária</h1>
        <p>{formattedDate}</p>
      </div>

      <div className={styles.headerActions}>
        <label className={styles.dateField}>
          Data da agenda
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </label>

        <button type="button" onClick={onGoToday}>
          Hoje
        </button>
      </div>
    </header>
  );
}
