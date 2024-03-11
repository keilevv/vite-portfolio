import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Dropdown, type MenuProps } from "antd";
import { useStore } from "../../store/useStore";

import "./style.css";
function Navbar() {
  const { setLanguage } = useStore();
  const [expanded, setExpanded] = useState(false);

  const onClick: MenuProps["onClick"] = ({ key }) => {
    setLanguage(key);
  };

  const items: MenuProps["items"] = [
    {
      label: <FormattedMessage id="navbar.language.english" />,
      key: "en",
    },
    {
      label: <FormattedMessage id="navbar.language.spanish" />,
      key: "es",
    },
  ];
  return (
    <div className={`nav ${expanded ? "expanded" : ""}`}>
      <div className="nav-content">
        <input type="checkbox" id="nav-check" />
        <div className="nav-header">
          <a className="transition-wheat nav-title" href="#header">
            Caleb Villaba
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
          <Dropdown
            menu={{ items, onClick }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <div className="language-picker">
              <i className="fa-solid fa-globe language-picker-icon transition-wheat"></i>
            </div>
          </Dropdown>

          <div className="nav-links">
            <a className="transition-wheat" href="#about">
              <FormattedMessage id="navbar.about" />
            </a>
            <a className="transition-wheat" href="#experience">
              <FormattedMessage id="navbar.experience" />
            </a>
            <a className="transition-wheat">
              <FormattedMessage id="navbar.projects" />
            </a>
            <a className="transition-wheat">
              <FormattedMessage id="navbar.contact" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Navbar;
