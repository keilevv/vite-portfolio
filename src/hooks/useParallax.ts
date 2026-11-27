import { useEffect } from "react";

/**
 * High-end multi-layer parallax engine:
 * Dynamically computes relative scroll offsets for elements matching '[data-parallax-speed]'
 * and applies hardware-accelerated transforms on the GPU.
 *
 * Optimizations:
 * - Caches target elements and parsed speeds on mount instead of querying DOM every frame.
 * - Batches all layout reads (getBoundingClientRect) before style writes (transform)
 *   to eliminate forced synchronous reflows / layout thrashing.
 * - Skips off-screen elements with a 150px margin buffer.
 * - Respects 'prefers-reduced-motion'.
 */
export function useParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let rafId: number | null = null;

    const layers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax-speed]")
    ).map((el) => ({
      el,
      speed: parseFloat(el.getAttribute("data-parallax-speed") || "0"),
    }));

    if (layers.length === 0) return;

    const updateParallax = () => {
      const windowHeight = window.innerHeight;
      const viewportCenter = windowHeight / 2;

      // Pass 1: Batch all layout reads
      const updates: Array<{ el: HTMLElement; translateY: string }> = [];
      for (let i = 0; i < layers.length; i++) {
        const { el, speed } = layers[i];
        const rect = el.getBoundingClientRect();

        if (rect.bottom < -150 || rect.top > windowHeight + 150) {
          continue;
        }

        const elementCenter = rect.top + rect.height / 2;
        const distanceFromCenter = elementCenter - viewportCenter;
        const translateY = (distanceFromCenter * speed).toFixed(2);
        updates.push({ el, translateY });
      }

      // Pass 2: Batch all style writes
      for (let i = 0; i < updates.length; i++) {
        const { el, translateY } = updates[i];
        el.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }
    };

    const onScrollOrResize = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateParallax();
          rafId = null;
        });
      }
    };

    updateParallax();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);
}
