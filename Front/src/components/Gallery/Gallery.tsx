import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { galleryImages } from "../../data/gallery";
import { services } from "../../data/services";
import styles from "./Gallery.module.css";

const AUTOPLAY_INTERVAL_MS = 5500;
const SWIPE_THRESHOLD_PX = 45;
const DRAG_CLICK_THRESHOLD_PX = 6;
const PAGE_SCROLL_PAUSE_MS = 1200;

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

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])';

export function Gallery() {
  const [loadedIds, setLoadedIds] = useState<Set<number>>(new Set());
  const [failedIds, setFailedIds] = useState<Set<number>>(new Set());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  /**
   * Interação direta com o carrossel:
   * hover, foco, drag e scroll horizontal.
   */
  const [isInteracting, setIsInteracting] = useState(false);

  /**
   * NOVO:
   * Detecta quando o usuário está rolando a página principal.
   * Isso impede o autoplay de disputar atenção com o scroll vertical.
   */
  const [isPageScrolling, setIsPageScrolling] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const slideRefs = useRef<(HTMLLIElement | null)[]>([]);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const dragState = useRef({
    startX: 0,
    startScrollLeft: 0,
    moved: false,
    pointerId: -1,
  });

  const swipeState = useRef({
    startX: 0,
    startY: 0,
    active: false,
  });

  // ------------------------------------------------------------------
  // Filtro por técnica
  // ------------------------------------------------------------------

  const filterOptions = useMemo(
    () =>
      services.filter((service) =>
        galleryImages.some((image) => image.technique === service.slug),
      ),
    [],
  );

  const visibleImages = useMemo(
    () =>
      activeFilter
        ? galleryImages.filter((image) => image.technique === activeFilter)
        : galleryImages,
    [activeFilter],
  );

  const total = visibleImages.length;

  function handleFilterChange(slug: string | null) {
    if (slug === activeFilter) return;

    setActiveFilter(slug);
    setCurrentSlide(0);
    setActiveIndex(null);
    slideRefs.current = [];

    requestAnimationFrame(() => {
      trackRef.current?.scrollTo({
        left: 0,
        behavior: "auto",
      });
    });
  }

  // ------------------------------------------------------------------
  // Loading / erro de imagem
  // ------------------------------------------------------------------

  const handleLoad = useCallback((id: number) => {
    setLoadedIds((previous) => new Set(previous).add(id));
  }, []);

  const handleError = useCallback((id: number) => {
    setFailedIds((previous) => new Set(previous).add(id));
  }, []);

  // ------------------------------------------------------------------
  // Lightbox
  // ------------------------------------------------------------------

  const openLightbox = useCallback((index: number) => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setActiveIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    lastFocusedRef.current?.focus?.();
  }, []);

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

    const raf = requestAnimationFrame(() => {
      const closeButton = lightboxRef.current?.querySelector<HTMLElement>(
        `.${styles.lightboxClose}`,
      );

      closeButton?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
        return;
      }

      if (event.key === "ArrowLeft") {
        showPrev();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }

      if (event.key === "Tab" && lightboxRef.current) {
        const focusable = Array.from(
          lightboxRef.current.querySelectorAll<HTMLElement>(
            FOCUSABLE_SELECTOR,
          ),
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const activeEl = document.activeElement;

        if (event.shiftKey && activeEl === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && activeEl === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(raf);
    };
  }, [activeIndex, closeLightbox, showPrev, showNext]);

  // ------------------------------------------------------------------
  // Pré-carrega imagem anterior/seguinte do lightbox
  // ------------------------------------------------------------------

  useEffect(() => {
    if (activeIndex === null) return;

    [1, -1].forEach((offset) => {
      const neighbor =
        visibleImages[(activeIndex + offset + total) % total];

      if (!neighbor?.src) return;

      const preload = new Image();

      preload.src = withCloudinaryParams(
        neighbor.src,
        "w_1600,q_auto,f_auto",
      )!;
    });
  }, [activeIndex, total, visibleImages]);

  // ------------------------------------------------------------------
  // Swipe do lightbox
  // ------------------------------------------------------------------

  function handleLightboxPointerDown(event: React.PointerEvent) {
    swipeState.current = {
      startX: event.clientX,
      startY: event.clientY,
      active: true,
    };
  }

  function handleLightboxPointerUp(event: React.PointerEvent) {
    if (!swipeState.current.active) return;

    swipeState.current.active = false;

    const deltaX = event.clientX - swipeState.current.startX;
    const deltaY = event.clientY - swipeState.current.startY;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;

    if (Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX > 0) {
      showPrev();
    } else {
      showNext();
    }
  }

  // ------------------------------------------------------------------
  // Detecta qual slide está em foco
  // ------------------------------------------------------------------

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const index = slideRefs.current.findIndex(
              (el) => el === entry.target,
            );

            if (index !== -1) {
              setCurrentSlide(index);
            }
          }
        }
      },
      {
        root: track,
        threshold: [0.6],
      },
    );

    slideRefs.current.forEach((slide) => {
      if (slide) {
        observer.observe(slide);
      }
    });

    return () => observer.disconnect();
  }, [total]);

  // ------------------------------------------------------------------
  // NOVO:
  // Move somente o scroll horizontal do carrossel.
  //
  // Não usamos scrollIntoView(), porque ele pode alterar o scroll
  // vertical da página para tornar o elemento visível.
  // ------------------------------------------------------------------

  const scrollToSlide = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = slideRefs.current[index];

    if (!track || !slide) return;

    const trackRect = track.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();

    const targetScrollLeft =
      track.scrollLeft +
      (slideRect.left - trackRect.left) -
      (trackRect.width - slideRect.width) / 2;

    const maxScrollLeft = track.scrollWidth - track.clientWidth;

    track.scrollTo({
      left: Math.min(
        Math.max(0, targetScrollLeft),
        Math.max(0, maxScrollLeft),
      ),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const goToPrevSlide = useCallback(() => {
    const nextIndex = Math.max(currentSlide - 1, 0);

    scrollToSlide(nextIndex);
  }, [currentSlide, scrollToSlide]);

  const goToNextSlide = useCallback(() => {
    const nextIndex = Math.min(currentSlide + 1, total - 1);

    scrollToSlide(nextIndex);
  }, [currentSlide, scrollToSlide, total]);

  // ------------------------------------------------------------------
  // Barra de progresso
  // ------------------------------------------------------------------

  function handleProgressSeek(
    event: React.MouseEvent<HTMLDivElement>,
  ) {
    if (total <= 0) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const ratio =
      (event.clientX - rect.left) / rect.width;

    const index = Math.min(
      total - 1,
      Math.max(0, Math.round(ratio * (total - 1))),
    );

    scrollToSlide(index);
  }

  function handleProgressKeyDown(
    event: React.KeyboardEvent,
  ) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevSlide();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNextSlide();
    }
  }

  function handleTrackKeyDown(
    event: React.KeyboardEvent,
  ) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevSlide();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNextSlide();
    }
  }

  // ------------------------------------------------------------------
  // Arrastar com mouse
  // ------------------------------------------------------------------

  function handleTrackPointerDown(
    event: React.PointerEvent,
  ) {
    if (event.pointerType !== "mouse") return;

    const track = trackRef.current;

    if (!track) return;

    dragState.current = {
      startX: event.clientX,
      startScrollLeft: track.scrollLeft,
      moved: false,
      pointerId: event.pointerId,
    };

    track.setPointerCapture(event.pointerId);

    setIsDragging(true);
    setIsInteracting(true);
  }

  function handleTrackPointerMove(
    event: React.PointerEvent,
  ) {
    if (event.pointerType !== "mouse") return;

    if (
      dragState.current.pointerId !== event.pointerId
    ) {
      return;
    }

    const track = trackRef.current;

    if (!track) return;

    const delta =
      event.clientX - dragState.current.startX;

    if (Math.abs(delta) > DRAG_CLICK_THRESHOLD_PX) {
      dragState.current.moved = true;
    }

    track.scrollLeft =
      dragState.current.startScrollLeft - delta;
  }

  function endTrackDrag(
    event: React.PointerEvent,
  ) {
    if (event.pointerType !== "mouse") return;

    const track = trackRef.current;

    if (
      track &&
      track.hasPointerCapture(event.pointerId)
    ) {
      track.releasePointerCapture(event.pointerId);
    }

    setIsDragging(false);

    window.setTimeout(() => {
      setIsInteracting(false);
    }, 600);
  }

  // ------------------------------------------------------------------
  // Evita abrir lightbox depois de arrastar
  // ------------------------------------------------------------------

  function handleSlideClickCapture(
    event: React.MouseEvent,
  ) {
    if (dragState.current.moved) {
      event.preventDefault();
      event.stopPropagation();

      dragState.current.moved = false;
    }
  }

  // ------------------------------------------------------------------
  // Pausa autoplay durante scroll horizontal do carrossel
  // ------------------------------------------------------------------

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    let resumeTimeout: number;

    function handleScroll() {
      setIsInteracting(true);

      window.clearTimeout(resumeTimeout);

      resumeTimeout = window.setTimeout(() => {
        setIsInteracting(false);
      }, 1800);
    }

    track.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      track.removeEventListener("scroll", handleScroll);
      window.clearTimeout(resumeTimeout);
    };
  }, []);

  // ------------------------------------------------------------------
  // NOVO:
  // Detecta scroll vertical da página.
  //
  // Enquanto o usuário estiver descendo/subindo a página,
  // o autoplay fica pausado.
  // ------------------------------------------------------------------

  useEffect(() => {
    let resumeTimeout: number;

    function handlePageScroll() {
      setIsPageScrolling(true);

      window.clearTimeout(resumeTimeout);

      resumeTimeout = window.setTimeout(() => {
        setIsPageScrolling(false);
      }, PAGE_SCROLL_PAUSE_MS);
    }

    window.addEventListener("scroll", handlePageScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        handlePageScroll,
      );

      window.clearTimeout(resumeTimeout);
    };
  }, []);

  // ------------------------------------------------------------------
  // Autoplay
  // ------------------------------------------------------------------

  useEffect(() => {
    if (!autoplayEnabled) return;

    if (isInteracting) return;

    if (isDragging) return;

    if (isPageScrolling) return;

    if (total <= 1) return;

    if (prefersReducedMotion()) return;

    const timer = window.setInterval(() => {
      setCurrentSlide((current) => {
        const next = (current + 1) % total;

        scrollToSlide(next);

        // CORREÇÃO:
        // antes retornava "current", mantendo o estado errado.
        return next;
      });
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    autoplayEnabled,
    isInteracting,
    isDragging,
    isPageScrolling,
    total,
    scrollToSlide,
  ]);

  // ------------------------------------------------------------------
  // Animação de entrada
  // ------------------------------------------------------------------

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    if (prefersReducedMotion()) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const activeImage =
    activeIndex !== null
      ? visibleImages[activeIndex]
      : null;

  const currentCaption =
    visibleImages[currentSlide]?.label;

  const progressPercent =
    total > 0
      ? ((currentSlide + 1) / total) * 100
      : 0;

  return (
    <section
      id="resultados"
      ref={sectionRef}
      className={`${styles.gallery} ${
        isRevealed ? styles.revealed : ""
      }`}
      aria-labelledby="gallery-heading"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>
            Resultados reais
          </span>

          <h2
            id="gallery-heading"
            className={styles.headline}
          >
            Detalhes que valorizam o olhar
          </h2>

          <p className={styles.subheadline}>
            Uma seleção de trabalhos que revela precisão
            técnica e acabamento natural — cada detalhe,
            pensado com cuidado.
          </p>
        </header>

        {filterOptions.length > 1 && (
          <div
            className={styles.filterBar}
            role="group"
            aria-label="Filtrar por técnica"
          >
            <button
              type="button"
              className={`${styles.filterPill} ${
                activeFilter === null
                  ? styles.filterPillActive
                  : ""
              }`}
              aria-pressed={activeFilter === null}
              onClick={() =>
                handleFilterChange(null)
              }
            >
              Todos
            </button>

            {filterOptions.map((service) => (
              <button
                key={service.slug}
                type="button"
                className={`${styles.filterPill} ${
                  activeFilter === service.slug
                    ? styles.filterPillActive
                    : ""
                }`}
                aria-pressed={
                  activeFilter === service.slug
                }
                onClick={() =>
                  handleFilterChange(service.slug)
                }
              >
                {service.name}
              </button>
            ))}
          </div>
        )}

        <div
          className={styles.carousel}
          onMouseEnter={() =>
            setIsInteracting(true)
          }
          onMouseLeave={() =>
            setIsInteracting(false)
          }
          onFocusCapture={() =>
            setIsInteracting(true)
          }
          onBlurCapture={() =>
            setIsInteracting(false)
          }
        >
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonPrev}`}
            onClick={goToPrevSlide}
            disabled={currentSlide === 0}
            aria-label="Imagem anterior"
          >
            <span aria-hidden="true">
              &#8592;
            </span>
          </button>

          <ul
            ref={trackRef}
            className={`${styles.track} ${
              isDragging
                ? styles.trackDragging
                : ""
            }`}
            role="region"
            aria-roledescription="carrossel"
            aria-label="Galeria de resultados"
            tabIndex={0}
            onKeyDown={handleTrackKeyDown}
            onPointerDown={handleTrackPointerDown}
            onPointerMove={handleTrackPointerMove}
            onPointerUp={endTrackDrag}
            onPointerCancel={endTrackDrag}
          >
            {visibleImages.map((image, index) => {
              const serviceName =
                getServiceName(image.technique);

              const hasFailed =
                failedIds.has(image.id) ||
                !image.src;

              const isLoaded =
                loadedIds.has(image.id);

              const thumbnailSrc =
                withCloudinaryParams(
                  image.src,
                  "w_900,q_auto,f_auto",
                );

              const isActiveSlide =
                index === currentSlide;

              return (
                <li
                  key={image.id}
                  ref={(el) => {
                    slideRefs.current[index] = el;
                  }}
                  className={`${styles.slide} ${
                    isActiveSlide
                      ? styles.slideActive
                      : styles.slideInactive
                  }`}
                  style={
                    {
                      "--reveal-delay": `${
                        Math.min(index, 8) * 70
                      }ms`,
                    } as React.CSSProperties
                  }
                >
                  <button
                    type="button"
                    className={styles.trigger}
                    onClickCapture={
                      handleSlideClickCapture
                    }
                    onClick={() =>
                      openLightbox(index)
                    }
                    aria-label={`Ampliar imagem: ${image.label}`}
                  >
                    <figure
                      className={`${styles.figure} ${styles.slideFigure}`}
                    >
                      <div
                        className={
                          styles.imageWrapper
                        }
                      >
                        {!isLoaded && !hasFailed && (
                          <span
                            className={
                              styles.skeleton
                            }
                            aria-hidden="true"
                          />
                        )}

                        {!hasFailed &&
                        thumbnailSrc ? (
                          <img
                            src={thumbnailSrc}
                            alt={
                              image.alt ??
                              image.label
                            }
                            className={`${styles.image} ${
                              isLoaded
                                ? styles.imageLoaded
                                : ""
                            }`}
                            loading={
                              index === 0
                                ? "eager"
                                : "lazy"
                            }
                            draggable={false}
                            onLoad={() =>
                              handleLoad(image.id)
                            }
                            onError={() =>
                              handleError(image.id)
                            }
                          />
                        ) : (
                          <div
                            className={
                              styles.fallback
                            }
                            role="img"
                            aria-label={
                              image.alt ??
                              image.label
                            }
                          >
                            <span
                              className={
                                styles.fallbackMark
                              }
                            />

                            <span
                              className={
                                styles.fallbackText
                              }
                            >
                              Foto em breve
                            </span>
                          </div>
                        )}

                        <span
                          className={styles.index}
                          aria-hidden="true"
                        >
                          {formatIndex(index)}
                        </span>
                      </div>

                      <figcaption
                        className={styles.caption}
                      >
                        {serviceName && (
                          <span
                            className={
                              styles.serviceName
                            }
                          >
                            {serviceName}
                          </span>
                        )}

                        <span
                          className={
                            styles.captionText
                          }
                        >
                          {image.label}
                        </span>
                      </figcaption>
                    </figure>
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonNext}`}
            onClick={goToNextSlide}
            disabled={
              currentSlide === total - 1
            }
            aria-label="Próxima imagem"
          >
            <span aria-hidden="true">
              &#8594;
            </span>
          </button>
        </div>

        <div className={styles.progressRow}>
          <div
            className={styles.progressTrack}
            role="slider"
            tabIndex={0}
            aria-valuenow={currentSlide + 1}
            aria-valuemin={1}
            aria-valuemax={total}
            aria-label="Ir para uma imagem da galeria"
            onClick={handleProgressSeek}
            onKeyDown={handleProgressKeyDown}
          >
            <div
              className={styles.progressFill}
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>

          <span
            className={styles.counter}
            aria-hidden="true"
          >
            {formatIndex(currentSlide)}

            <span
              className={styles.counterTotal}
            >
              / {formatIndex(total - 1)}
            </span>
          </span>

          <button
            type="button"
            className={styles.autoplayToggle}
            onClick={() =>
              setAutoplayEnabled(
                (value) => !value,
              )
            }
            aria-label={
              autoplayEnabled
                ? "Pausar avanço automático"
                : "Retomar avanço automático"
            }
            aria-pressed={autoplayEnabled}
          >
            <span aria-hidden="true">
              {autoplayEnabled
                ? "❙❙"
                : "▶"}
            </span>
          </button>
        </div>

        <p
          className={styles.srOnly}
          aria-live="polite"
        >
          {`Imagem ${currentSlide + 1} de ${total}${
            currentCaption
              ? `: ${currentCaption}`
              : ""
          }`}
        </p>
      </div>

      {activeImage && (
        <div
          ref={lightboxRef}
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
            <span aria-hidden="true">
              &times;
            </span>
          </button>

          <div className={styles.lightboxStage}>
            <button
              type="button"
              className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
              onClick={(event) => {
                event.stopPropagation();
                showPrev();
              }}
              aria-label="Imagem anterior"
            >
              <span aria-hidden="true">
                &#8592;
              </span>
            </button>

            <figure
              className={styles.lightboxFigure}
              onClick={(event) =>
                event.stopPropagation()
              }
              onPointerDown={
                handleLightboxPointerDown
              }
              onPointerUp={
                handleLightboxPointerUp
              }
            >
              <img
                key={activeImage.id}
                src={withCloudinaryParams(
                  activeImage.src,
                  "w_1600,q_auto,f_auto",
                )}
                alt={
                  activeImage.alt ??
                  activeImage.label
                }
                className={
                  styles.lightboxImage
                }
                draggable={false}
              />

              <figcaption
                className={
                  styles.lightboxCaption
                }
              >
                {getServiceName(
                  activeImage.technique,
                ) && (
                  <span
                    className={
                      styles.serviceName
                    }
                  >
                    {getServiceName(
                      activeImage.technique,
                    )}
                  </span>
                )}

                <span
                  className={
                    styles.captionText
                  }
                >
                  {activeImage.label}
                </span>

                <span
                  className={
                    styles.lightboxCount
                  }
                >
                  {formatIndex(
                    activeIndex ?? 0,
                  )}{" "}
                  / {formatIndex(total - 1)}
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
              <span aria-hidden="true">
                &#8594;
              </span>
            </button>
          </div>

          {total > 1 && total <= 24 && (
            <div
              className={styles.thumbStrip}
              onClick={(event) =>
                event.stopPropagation()
              }
              role="tablist"
              aria-label="Selecionar imagem"
            >
              {visibleImages.map(
                (image, index) => {
                  const thumbSrc =
                    withCloudinaryParams(
                      image.src,
                      "w_150,q_auto,f_auto",
                    );

                  if (!thumbSrc) return null;

                  return (
                    <button
                      key={image.id}
                      type="button"
                      role="tab"
                      aria-selected={
                        index === activeIndex
                      }
                      aria-label={`Ver imagem: ${image.label}`}
                      className={`${styles.thumb} ${
                        index === activeIndex
                          ? styles.thumbActive
                          : ""
                      }`}
                      onClick={() =>
                        setActiveIndex(index)
                      }
                    >
                      <img
                        src={thumbSrc}
                        alt=""
                        aria-hidden="true"
                        className={
                          styles.thumbImage
                        }
                        draggable={false}
                      />
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
