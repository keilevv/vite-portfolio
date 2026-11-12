import { FormattedMessage } from "react-intl";
import AutoexpressLogo from "../../assets/autoexpress-logo.png";
import Concept7Logo from "../../assets/concept7_logo.jpg";
import FleksLogo from "../../assets/fleksworks_logo.jpg";
import Elemento43Logo from "../../assets/logo-e43.jpg";
import "./style.css";

interface ExperienceItem {
  id: string;
  image?: string;
  fallbackIcon?: string;
  skills: string[];
}

const experiences: ExperienceItem[] = [
  {
    id: "1",
    image: AutoexpressLogo,
    skills: ["MongoDB", "Express.js", "React", "Node.js", "Redux", "Tailwind CSS"],
  },
  {
    id: "2",
    fallbackIcon: "fa-solid fa-cube",
    skills: ["MongoDB", "Express.js", "React", "Node.js", "Meteor.js", "Python", "REST APIs"],
  },
  {
    id: "3",
    image: Concept7Logo,
    skills: ["React", "UI/UX", "Web Performance", "JavaScript", "HTML/CSS"],
  },
  {
    id: "4",
    image: FleksLogo,
    skills: ["React", "Redux", "Node.js", "HTML", "SASS", "REST APIs", "AWS", "Figma"],
  },
  {
    id: "5",
    image: Elemento43Logo,
    skills: ["React", "JavaScript", "HTML", "CSS", "Redux", "Agile"],
  },
];

function ExperienceContainer() {
  return (
    <div className="experience-container">
      <h1 className="experience-container-title text-2xl">
        <FormattedMessage id="experience.title" />
      </h1>
      <div className="experience-content">
        {experiences.map((exp, index) => (
          <div key={exp.id}>
            {index > 0 && <div className="divider" />}
            <div className="experience-row">
              <div className="experience-image-container">
                {exp.image ? (
                  <img
                    src={exp.image}
                    className="experience-image"
                    alt={`Experience ${exp.id}`}
                  />
                ) : (
                  <div className="experience-icon-fallback">
                    <i className={exp.fallbackIcon || "fa-solid fa-briefcase"} />
                  </div>
                )}
              </div>
              <div className="experience-text">
                <div className="experience-header">
                  <p className="experience-title">
                    <FormattedMessage id={`experience.${exp.id}`} />
                  </p>
                  <span className="experience-location">
                    <i className="fa-solid fa-location-dot location-icon" />
                    <FormattedMessage id={`experience.${exp.id}.location`} />
                  </span>
                </div>
                <div className="experience-meta">
                  <p className="experience-subtitle">
                    <FormattedMessage id={`experience.${exp.id}.role`} />
                  </p>
                  <span className="experience-date">
                    <FormattedMessage id={`experience.${exp.id}.date`} />
                  </span>
                </div>
                <p className="experience-description">
                  <FormattedMessage id={`experience.${exp.id}.description`} />
                </p>
                <div className="experience-skills">
                  {exp.skills.map((skill) => (
                    <span key={skill} className="skill-pill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExperienceContainer;
