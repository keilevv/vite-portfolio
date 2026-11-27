import { useEffect } from "react";

/**
 * High-end multi-layer parallax engine:
 * Dynamically computes relative scroll offsets for elements matching '[data-parallax-speed]'
 * and applies hardware-accelerated transforms on the GPU.
 *
 * Features:
 * - Independent speed layers: elements move faster or slower than scroll rate.
 * - Viewport intersection optimization: elements off-screen are skipped.
 * - Sub-pixel hardware acceleration via translate3d / will-change.
 * - Fully respects 'prefers-reduced-motion'.
 */
export function useParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let rafId: number | null = null;

    const updateParallax = () => {
      const elements = document.querySelectorAll<HTMLElement>(
        "[data-parallax-speed]"
      );
      const windowHeight = window.innerHeight;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();

        // Only compute for visible elements (with 150px margin buffer)
        if (rect.bottom < -150 || rect.top > windowHeight + 150) {
          return;
        }

        const speed = parseFloat(el.getAttribute("data-parallax-speed") || "0");
        // Center offset relative to viewport center
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const distanceFromCenter = elementCenter - viewportCenter;

        // Apply smooth translated offset
        const translateY = (distanceFromCenter * speed).toFixed(2);
        el.style.transform = `translate3d(0, ${translateY}px, 0)`;
      });
    };

    const onScrollOrResize = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateParallax();
          rafId = null;
        });
      }
    };

    // Initial calculation
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
