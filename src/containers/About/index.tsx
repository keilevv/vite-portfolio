import { FormattedMessage } from "react-intl";
import "./style.css";
import {
  IconAmazons3,
  IconCss3,
  IconExpress,
  IconFastapi,
  IconHtml5,
  IconJavascript,
  IconMongodb,
  IconNodejs,
  IconPostgresql,
  IconPython,
  IconReact,
  IconRedux,
  IconRabbitmq,
  IconTailwind,
  IconThreedotjs,
  IconTypescript,
  IconZustand,
  IconGithub,
} from "../../assets/logos";
function AboutContainer() {
  const iconProps = {
    color: "#ff8408",
    className: "transition-wheat",
  };
  const frontendSkills = [
    { title: "React.js", icon: <IconReact {...iconProps} /> },
    { title: "HTML", icon: <IconHtml5 {...iconProps} /> },
    { title: "CSS", icon: <IconCss3 {...iconProps} /> },
    { title: "Redux", icon: <IconRedux {...iconProps} /> },
    { title: "Three.js", icon: <IconThreedotjs {...iconProps} /> },
    { title: "JavaScript", icon: <IconJavascript {...iconProps} /> },
    { title: "TypeScript", icon: <IconTypescript {...iconProps} /> },
    { title: "Zustand", icon: <IconZustand {...iconProps} /> },
    { title: "Tailwind", icon: <IconTailwind {...iconProps} /> },
  ];

  const backendSkills = [
    { title: "Node.js", icon: <IconNodejs {...iconProps} /> },
    { title: "Express.js", icon: <IconExpress {...iconProps} /> },
    { title: "MongoDB", icon: <IconMongodb {...iconProps} /> },
    { title: "RabbitMQ", icon: <IconRabbitmq {...iconProps} /> },
    { title: "AmazonS3", icon: <IconAmazons3 {...iconProps} /> },
    { title: "PostgreSQL", icon: <IconPostgresql {...iconProps} /> },
    { title: "Python", icon: <IconPython {...iconProps} /> },
    { title: "FastAPI", icon: <IconFastapi {...iconProps} /> },
    { title: "GitHub Actions", icon: <IconGithub {...iconProps} /> },
  ];
  return (
    <div className="about-container">
      <h1 className="about-title section-title" data-parallax-speed="0.08">
        <FormattedMessage id="about.title" />
      </h1>
      <p className="about-text mb-4" data-parallax-speed="0.03">
        <FormattedMessage id="about.paragraph.1" />
      </p>
      <p className="about-text mb-4" data-parallax-speed="0.04">
        <FormattedMessage id="about.paragraph.2" />
      </p>
      <p className="about-text mb-4" data-parallax-speed="0.05">
        <FormattedMessage id="about.paragraph.3" />
      </p>
      <h1
        className="about-title section-title section"
        data-parallax-speed="0.08"
      >
        <FormattedMessage id="about.skills" />
      </h1>
      <div className="about-skills" data-parallax-speed="-0.04">
        <div className="main-skill">
          <h2>Frontend</h2>
          <div className="icons-container">
            {frontendSkills.map((skill, index) => {
              return (
                <div className="icon" key={index}>
                  {skill.icon}
                  <p>{skill.title}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="divider"></div>
        <div className="main-skill">
          <h2>Backend</h2>
          <div className="icons-container">
            {backendSkills.map((skill, index) => {
              return (
                <div className="icon" key={index}>
                  {skill.icon}
                  <p>{skill.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default AboutContainer;
