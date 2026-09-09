import { useCallback, useEffect, useState } from "react";
import { galleryImages } from "../../data/gallery";
import { services } from "../../data/services";
import styles from "./Gallery.module.css";

function getServiceName(technique?: string): string | undefined {
  if (!technique) return undefined;
  return services.find((service) => service.slug === technique)?.name;
}

function formatIndex(position: number): string {
  return String(position + 1).padStart(2, "0");
}

/**
 * Usa as transformações da Cloudinary (quando aplicável) para servir a
 * imagem no formato/qualidade/largura ideais, reduzindo peso sem exigir
 * nenhum serviço extra de otimização.
 */
function withCloudinaryParams(src: string | undefined, params: string) {
  if (!src || !src.includes("res.cloudinary.com")) return src;
  return src.replace("/upload/", `/upload/${params}/`);
}

export function Gallery() {
  const [loadedIds, setLoadedIds] = useState<Set<number>>(new Set());
  const [failedIds, setFailedIds] = useState<Set<number>>(new Set());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = galleryImages.length;

  const handleLoad = useCallback((id: number) => {
    setLoadedIds((previous) => new Set(previous).add(id));
  }, []);

  const handleError = useCallback((id: number) => {
    setFailedIds((previous) => new Set(previous).add(id));
  }, []);

  const openLightbox = useCallback(
    (index: number) => setActiveIndex(index),
    [],
  );
  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  const showPrev = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + total) % total,
    );
  }, [total]);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % total,
    );
  }, [total]);

  useEffect(() => {
    if (activeIndex === null) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, closeLightbox, showPrev, showNext]);

  const activeImage = activeIndex !== null ? galleryImages[activeIndex] : null;

  return (
    <section
      id="resultados"
      className={styles.gallery}
      aria-labelledby="gallery-heading"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Resultados reais</span>
          <h2 id="gallery-heading" className={styles.headline}>
            Detalhes que valorizam o olhar
          </h2>
          <p className={styles.subheadline}>
            Uma seleção de trabalhos que revela precisão técnica e acabamento
            natural — cada detalhe, pensado com cuidado.
          </p>
        </header>

        <ul className={styles.grid}>
          {galleryImages.map((image, index) => {
            const serviceName = getServiceName(image.technique);
            const hasFailed = failedIds.has(image.id) || !image.src;
            const isLoaded = loadedIds.has(image.id);
            const thumbnailSrc = withCloudinaryParams(
              image.src,
              "w_900,q_auto,f_auto",
            );

            return (
              <li key={image.id} className={styles.item}>
                <button
                  type="button"
                  className={styles.trigger}
                  onClick={() => openLightbox(index)}
                  aria-label={`Ampliar imagem: ${image.label}`}
                >
                  <figure className={styles.figure}>
                    <div className={styles.imageWrapper}>
                      {!isLoaded && !hasFailed && (
                        <span className={styles.skeleton} aria-hidden="true" />
                      )}

                      {!hasFailed && thumbnailSrc ? (
                        <img
                          src={thumbnailSrc}
                          alt={image.alt ?? image.label}
                          className={`${styles.image} ${
                            isLoaded ? styles.imageLoaded : ""
                          }`}
                          loading={index === 0 ? "eager" : "lazy"}
                          onLoad={() => handleLoad(image.id)}
                          onError={() => handleError(image.id)}
                        />
                      ) : (
                        <div
                          className={styles.fallback}
                          role="img"
                          aria-label={image.alt ?? image.label}
                        >
                          <span className={styles.fallbackMark} />
                          <span className={styles.fallbackText}>
                            Foto em breve
                          </span>
                        </div>
                      )}

                      <span className={styles.index} aria-hidden="true">
                        {formatIndex(index)}
                      </span>
                    </div>

                    <figcaption className={styles.caption}>
                      {serviceName && (
                        <span className={styles.serviceName}>
                          {serviceName}
                        </span>
                      )}
                      <span className={styles.captionText}>{image.label}</span>
                    </figcaption>
                  </figure>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {activeImage && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.label}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={closeLightbox}
            aria-label="Fechar"
          >
            <span aria-hidden="true">&times;</span>
          </button>

          <button
            type="button"
            className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
            onClick={(event) => {
              event.stopPropagation();
              showPrev();
            }}
            aria-label="Imagem anterior"
          >
            <span aria-hidden="true">&#8592;</span>
          </button>

          <figure
            className={styles.lightboxFigure}
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={withCloudinaryParams(
                activeImage.src,
                "w_1600,q_auto,f_auto",
              )}
              alt={activeImage.alt ?? activeImage.label}
              className={styles.lightboxImage}
            />
            <figcaption className={styles.lightboxCaption}>
              {getServiceName(activeImage.technique) && (
                <span className={styles.serviceName}>
                  {getServiceName(activeImage.technique)}
                </span>
              )}
              <span className={styles.captionText}>{activeImage.label}</span>
              <span className={styles.lightboxCount}>
                {formatIndex(activeIndex ?? 0)} / {formatIndex(total - 1)}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            className={`${styles.lightboxNav} ${styles.lightboxNext}`}
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Próxima imagem"
          >
            <span aria-hidden="true">&#8594;</span>
          </button>
        </div>
      )}
    </section>
  );
}
