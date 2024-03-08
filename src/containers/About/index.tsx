import { FormattedMessage } from "react-intl";
import "./style.css";
function AboutContainer() {
  return (
    <div className="about-container">
      <h1 className="about-title">About me</h1>
      <p className="about-text">
        <FormattedMessage id="about.paragraph.1" />
      </p>
      <p className="about-text">
        <FormattedMessage id="about.paragraph.2" />
      </p>
      <p className="about-text">
        <FormattedMessage id="about.paragraph.3" />
      </p>
      <h1 className="about-title section">My technology stack</h1>
      <div className="about-skills">
        <div className="main-skill">
          <h2>Frontend</h2>
          <div className="icons-container"></div>
        </div>
        <div className="divider"></div>
        <div className="main-skill">
          <h2>Backend</h2>
        </div>
      </div>
    </div>
  );
}
export default AboutContainer;
