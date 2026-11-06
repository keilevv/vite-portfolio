import React, { useEffect, useRef } from "react";
import { GameIntroduction } from "./GameIntroduction";

interface GameSectionProps {
  onEnterIntro: () => void;
  onLeaveIntro: () => void;
  onStart: () => void;
}

export const GameSection: React.FC<GameSectionProps> = ({
  onEnterIntro,
  onLeaveIntro,
  onStart,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onEnterIntro();
          } else {
            // Only trigger leave if user scrolls above the game section
            if (entry.boundingClientRect.top > 0) {
              onLeaveIntro();
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [onEnterIntro, onLeaveIntro]);

  const handleBackToTop = () => {
    const header = document.getElementById("header");
    if (header) {
      header.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="game-section"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center p-6 relative z-10"
    >
      <GameIntroduction onStart={onStart} onBackToPortfolio={handleBackToTop} />
    </section>
  );
};
