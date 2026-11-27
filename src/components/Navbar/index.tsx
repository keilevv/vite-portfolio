import { useState, useRef, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useStore } from "../../store/useStore";

import "./style.css";

function Navbar() {
  const { setLanguage } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOnHeader, setIsOnHeader] = useState(true);
  const [manualOpen, setManualOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isNavbarVisible = !isOnHeader || manualOpen;

  const handleLanguageSelect = (key: string) => {
    setLanguage(key);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const checkScroll = () => {
      const onHeader = window.scrollY < window.innerHeight * 0.7;
      setIsOnHeader(onHeader);
      if (!onHeader) {
        setManualOpen(false);
        setExpanded(false);
      }
    };

    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      {isOnHeader && !manualOpen && (
        <button
          type="button"
          className="nav-handler-btn"
          onClick={() => {
            setManualOpen(true);
            if (window.innerWidth <= 600) {
              setExpanded(true);
            }
          }}
          aria-label="Open Navigation"
        >
          <span className="nav-handler-bars">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      )}

      <div
        className={`nav ${expanded ? "expanded" : ""} ${
          isNavbarVisible ? "nav--visible" : "nav--hidden"
        }`}
      >
        <div className="nav-content">
          <input
            type="checkbox"
            id="nav-check"
            checked={expanded}
            onChange={(e) => setExpanded(e.target.checked)}
          />
          <div className="nav-header">
            <a
              className="transition-wheat nav-title"
              href="#header"
              onClick={() => {
                setManualOpen(false);
                setExpanded(false);
              }}
            >
              Caleb Villalba
            </a>
          </div>
          {!(isOnHeader && manualOpen) && (
            <div className="nav-btn">
              <label htmlFor="nav-check">
                <span></span>
                <span></span>
                <span></span>
              </label>
            </div>
          )}
          <div className="nav-right">
            <div className="relative flex items-stretch" ref={dropdownRef}>
              <button
                type="button"
                className="language-picker bg-transparent border-0 text-inherit p-0"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                aria-label="Select Language"
              >
                <i className="fa-solid fa-globe language-picker-icon transition-wheat"></i>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 min-w-[120px] rounded-md border-2 border-white bg-[#131f27] py-1 shadow-lg z-50">
                  <button
                    type="button"
                    onClick={() => handleLanguageSelect("en")}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:text-[wheat] hover:bg-[#344042] transition-colors cursor-pointer"
                  >
                    <FormattedMessage id="navbar.language.english" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLanguageSelect("es")}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:text-[wheat] hover:bg-[#344042] transition-colors cursor-pointer"
                  >
                    <FormattedMessage id="navbar.language.spanish" />
                  </button>
                </div>
              )}
            </div>

            <div className="nav-links">
              <a
                className="transition-wheat"
                href="#experience"
                onClick={() => {
                  setManualOpen(false);
                  setExpanded(false);
                }}
              >
                <FormattedMessage id="navbar.experience" />
              </a>
              <a
                className="transition-wheat"
                href="#about"
                onClick={() => {
                  setManualOpen(false);
                  setExpanded(false);
                }}
              >
                <FormattedMessage id="navbar.about" />
              </a>
              <a
                className="transition-wheat"
                href="#projects"
                onClick={() => {
                  setManualOpen(false);
                  setExpanded(false);
                }}
              >
                <FormattedMessage id="navbar.projects" />
              </a>
            </div>

            {isOnHeader && manualOpen && (
              <button
                type="button"
                className="nav-close-btn"
                onClick={() => {
                  setManualOpen(false);
                  setExpanded(false);
                }}
                aria-label="Close Navigation"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default Navbar;
