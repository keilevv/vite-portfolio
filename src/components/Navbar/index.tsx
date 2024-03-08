import { useState } from "react";
import useViewport from "../../hooks/useViewport";
import "./style.css";
function Navbar() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`nav ${expanded ? "expanded" : ""}`}>
      <div className="nav-content">
        <input type="checkbox" id="nav-check" />
        <div className="nav-header">
          <div className="transition-wheat nav-title ">Caleb Villalba</div>
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
        <div className="nav-links">
          <a className="transition-wheat" href="#about">
            About
          </a>
          <a className="transition-wheat">Experience</a>
          <a className="transition-wheat">Projects</a>
          <a className="transition-wheat">Contact</a>
        </div>
      </div>
    </div>
  );
}
export default Navbar;
