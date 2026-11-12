import { useState, useRef, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useStore } from "../../store/useStore";

import "./style.css";

function Navbar() {
  const { setLanguage } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageSelect = (key: string) => {
    setLanguage(key);
    setIsDropdownOpen(false);
  };

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
    <div className={`nav ${expanded ? "expanded" : ""}`}>
      <div className="nav-content">
        <input type="checkbox" id="nav-check" />
        <div className="nav-header">
          <a className="transition-wheat nav-title" href="#header">
            Caleb Villalba
          </a>
        </div>
        <div
          className="nav-btn"
          onClick={() => {
            setExpanded((prev) => !prev);
          }}
        >
          <label htmlFor="nav-check">
            <span></span>
            <span></span>
            <span></span>
          </label>
        </div>
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
            <a className="transition-wheat" href="#experience">
              <FormattedMessage id="navbar.experience" />
            </a>
            <a className="transition-wheat" href="#about">
              <FormattedMessage id="navbar.about" />
            </a>
            <a className="transition-wheat" href="#projects">
              <FormattedMessage id="navbar.projects" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Navbar;
