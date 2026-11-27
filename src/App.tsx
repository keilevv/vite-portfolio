import { useState, useEffect, useRef } from "react";
import { IntlProvider } from "react-intl";
import englishTranslations from "./translations/en";
import spanishTranslations from "./translations/es";
/* Components */
import HeaderContainer from "./containers/Header";
import AboutContainer from "./containers/About";
import ExperienceContainer from "./containers/Experience";
import ProjectsContainer from "./containers/Projects";
import FooterComponent from "./containers/Footer";
import HolographicTerrain from "./components/HolographicTerrain";
/* Hooks */
import { useStore } from "./store/useStore";
import { useParallax } from "./hooks/useParallax";
import "./style.css";

function App() {
  const { language } = useStore();
  const [messages, setMessages] = useState(englishTranslations.messages);
  const backdropRef = useRef<HTMLDivElement | null>(null);

  // Initialize multi-layer parallax
  useParallax();

  useEffect(() => {
    let rafId: number | null = null;

    const updateBackdropOpacity = () => {
      if (!backdropRef.current) return;
      const maxScroll = window.innerHeight * 0.85;
      const opacity = Math.min(window.scrollY / maxScroll, 0.88);
      backdropRef.current.style.opacity = opacity.toFixed(3);
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateBackdropOpacity();
          rafId = null;
        });
      }
    };

    updateBackdropOpacity();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (language === "en") {
      setMessages(englishTranslations.messages);
    } else {
      setMessages(spanishTranslations.messages);
    }
  }, [language]);
  return (
    <IntlProvider messages={messages} locale={language} defaultLocale="en">
      <div className="app-container relative">
        <HolographicTerrain className="!fixed inset-0 z-0" />
        <div
          ref={backdropRef}
          className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundColor: "#121110", opacity: 0 }}
        />
        <div className="relative z-10">
          <section id="header">
            <HeaderContainer />
          </section>
          <section id="experience">
            <ExperienceContainer />
          </section>
          <section id="about">
            <AboutContainer />
          </section>
          <section id="projects">
            <ProjectsContainer />
          </section>
          <section id="footer">
            <FooterComponent />
          </section>
        </div>
      </div>
    </IntlProvider>
  );
}

export default App;
