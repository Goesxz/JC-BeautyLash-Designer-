import styles from "./Hero.module.css";

const trustItems: string[] = [
  "Acabamento natural",
  "Atendimento personalizado",
  "Materiais premium",
];

const heroImage =
  "https://res.cloudinary.com/djpdnyvpv/image/upload/v1783112334/WhatsApp_Image_2026-07-03_at_17.52.00_zi0d5p.jpg";

export function Hero() {
  return (
    <section id="inicio" className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>JC Beauty Studio</span>

          <h1 id="hero-heading" className={styles.headline}>
            Realce seu olhar com naturalidade.
          </h1>

          <p className={styles.subheadline}>
            Extensão de cílios com acabamento leve, elegante e personalizado
            para valorizar sua beleza sem exageros.
          </p>

          <div className={styles.ctaGroup}>
            <a href="#agendamento" className={styles.primaryCta}>
              Agendar horário
            </a>
            <a href="#servicos" className={styles.secondaryCta}>
              Ver serviços
            </a>
          </div>

          <div className={styles.socialProof}>
            <span className={styles.stars}>★★★★★</span>
            <span className={styles.score}>5.0</span>
            <span className={styles.clients}>+350 clientes atendidas</span>
          </div>

          <ul className={styles.trustList}>
            {trustItems.map((item) => (
              <li key={item} className={styles.trustItem}>
                <span className={styles.trustMark} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <img src={heroImage} alt="" className={styles.heroPhoto} />
        </div>
      </div>
    </section>
  );
}
