import styles from "./InstagramLink.module.css";

const instagramUrl = "https://www.instagram.com/";

export function InstagramLink() {
  return (
    <section
      id="instagram"
      className={styles.instagram}
      aria-labelledby="instagram-heading"
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>Instagram</span>
          <h2 id="instagram-heading" className={styles.headline}>
            Acompanhe os bastidores e resultados
          </h2>
          <p className={styles.subheadline}>
            Veja novos trabalhos, cuidados pós-procedimento e detalhes da rotina
            do estúdio diretamente pelo Instagram.
          </p>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cta}
            aria-label="Acessar o perfil do JC Beauty Studio no Instagram (abre em nova aba)"
          >
            Acessar Instagram
          </a>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.avatar} />
              <div className={styles.cardHeaderText}>
                <span className={styles.handle}>@jcbeauty.studio</span>
                <span className={styles.handleSub}>Osasco, SP</span>
              </div>
            </div>

            <div className={styles.gridPreview}>
              <span className={styles.previewTile} />
              <span className={styles.previewTile} />
              <span className={styles.previewTile} />
              <span className={styles.previewTile} />
              <span className={styles.previewTile} />
              <span className={styles.previewTile} />
            </div>

            <div className={styles.cardFooter}>
              <span className={styles.footerLine} />
              <span className={styles.footerLineShort} />
            </div>
          </div>

          <div className={styles.cardAccent} />
        </div>
      </div>
    </section>
  );
}
