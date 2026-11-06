import { useState, useEffect, useMemo, useCallback } from "react";
import { FormattedMessage, IntlProvider } from "react-intl";
import englishTranslations from "./translations/en";
import spanishTranslations from "./translations/es";
/* Components */
import HeaderContainer from "./containers/Header";
import AboutContainer from "./containers/About";
import ExperienceContainer from "./containers/Experience";
import ProjectsContainer from "./containers/Projects";
import { GameCanvas } from "./components/game/GameCanvas";
import { GameSection } from "./components/game/GameSection";
import { GameHUD } from "./components/game/GameHUD";
import { DebugOverlay } from "./components/game/DebugOverlay";
import { GameEngine } from "./game/engine/GameEngine";
import { ExperienceMode } from "./game/engine/GameTypes";
/* Hooks */
import { useStore } from "./store/useStore";
import "./style.css";

function App() {
  const { language } = useStore();
  const [messages, setMessages] = useState(englishTranslations.messages);
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>("portfolio");
  const [showDebug, setShowDebug] = useState(false);
  const [, setTick] = useState(0);

  // Single game engine instance across mounts/Strict Mode
  const engine = useMemo(() => new GameEngine(), []);

  useEffect(() => {
    engine.setModeChangeCallback((mode) => {
      setExperienceMode(mode);
    });
    return () => {
      engine.dispose();
    };
  }, [engine]);

  // Update debug overlay tick at a gentle interval during gameplay
  useEffect(() => {
    if (!showDebug || (experienceMode !== "playing" && experienceMode !== "paused")) {
      return;
    }
    const interval = setInterval(() => {
      setTick((t) => (t + 1) % 1000);
    }, 50);
    return () => clearInterval(interval);
  }, [showDebug, experienceMode]);

  useEffect(() => {
    if (language === "en") {
      setMessages(englishTranslations.messages);
    } else {
      setMessages(spanishTranslations.messages);
    }
  }, [language]);

  const handleEnterIntro = useCallback(() => {
    if (engine.getMode() === "portfolio") {
      engine.setMode("game-intro");
    }
  }, [engine]);

  const handleLeaveIntro = useCallback(() => {
    if (engine.getMode() === "game-intro") {
      engine.setMode("portfolio");
    }
  }, [engine]);

  const handleStartGame = useCallback(() => {
    engine.startGame();
  }, [engine]);

  const handlePauseGame = useCallback(() => {
    engine.pauseGame();
  }, [engine]);

  const handleResumeGame = useCallback(() => {
    engine.resumeGame();
  }, [engine]);

  const handleExitToPortfolio = useCallback(() => {
    engine.returnToPortfolio();
    const gameSection = document.getElementById("game-section");
    if (gameSection) {
      gameSection.scrollIntoView({ behavior: "smooth" });
    }
  }, [engine]);

  const isGameplay = experienceMode === "playing" || experienceMode === "paused";

  return (
    <IntlProvider messages={messages} locale={language} defaultLocale="en">
      {/* 1. Persistent Three.js Background Canvas */}
      <GameCanvas engine={engine} />

      {/* 2. Gameplay HUD & Pause Menu */}
      {isGameplay && (
        <>
          <GameHUD
            isPaused={experienceMode === "paused"}
            onPause={handlePauseGame}
            onResume={handleResumeGame}
            onExit={handleExitToPortfolio}
            showDebug={showDebug}
            onToggleDebug={() => setShowDebug((prev) => !prev)}
          />
          {showDebug && (
            <DebugOverlay
              playerState={engine.getPlayerState()}
              mode={experienceMode}
            />
          )}
        </>
      )}

      {/* 3. Portfolio Layer (Fades/hides during active gameplay) */}
      <div
        className={`app-container relative z-10 transition-opacity duration-500 ${
          isGameplay ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
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

        {/* Dedicated Game Section */}
        <GameSection
          onEnterIntro={handleEnterIntro}
          onLeaveIntro={handleLeaveIntro}
          onStart={handleStartGame}
        />

        <section id="footer">
          <div className="footer-container">
            <p>
              <FormattedMessage id="footer.text" />
            </p>
          </div>
        </section>
      </div>
    </IntlProvider>
  );
}

export default App;
