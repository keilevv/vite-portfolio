import { FormattedMessage } from "react-intl";
import Concept7Logo from "../../assets/concept7_logo.jpg";
import FleksLogo from "../../assets/fleksworks_logo.jpg";
import Elemento43Logo from "../../assets/logo-e43.jpg";
import "./style.css";
function ExperienceContainer() {
  return (
    <div className="experience-container">
      <h1 className="experience-container-title">
        <FormattedMessage id="experience.title" />
      </h1>
      <div className="experience-content">
        <div className="experience-row">
          <div className="experience-image-container">
            <img
              src={Concept7Logo}
              className="experience-image"
              alt="Concept7"
            />
          </div>
          <div className="experience-text">
            <p className="experience-title">
              <FormattedMessage id="experience.1" />
            </p>
            <p className="experience-subtitle">Frontend web developer</p>
            <span>
              <FormattedMessage id="experience.1.date" />
            </span>
            <p>
              <FormattedMessage id="experience.1.description" />
            </p>
          </div>
        </div>
        <div className="divider" />
        <div className="experience-row">
          <div className="experience-image-container">
            <img src={FleksLogo} className="experience-image" alt="Fleks" />
          </div>
          <div className="experience-text">
            <p className="experience-title">
              <FormattedMessage id="experience.2" />
            </p>
            <p className="experience-subtitle">React frontend developer</p>
            <span>
              <FormattedMessage id="experience.2.date" />
            </span>
            <p>
              <FormattedMessage id="experience.2.description" />
            </p>
          </div>
        </div>
        <div className="divider" />
        <div className="experience-row">
          <div className="experience-image-container">
            <img
              src={Elemento43Logo}
              className="experience-image"
              alt="Elemento43"
            />
          </div>
          <div className="experience-text">
            <p className="experience-title">
              <FormattedMessage id="experience.3" />
            </p>
            <p className="experience-subtitle">Frontend web developer</p>
            <span>
              <FormattedMessage id="experience.3.date" />
            </span>

            <p>
              <FormattedMessage id="experience.3.description" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ExperienceContainer;
