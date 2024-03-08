import { FormattedMessage } from "react-intl";
import "./style.css";
import {
  IconAmazons3,
  IconCss3,
  IconExpress,
  IconHtml5,
  IconJavascript,
  IconMongodb,
  IconNodejs,
  IconReact,
  IconRedux,
  IconThreedotjs,
  IconRabbitmq,
} from "../../assets/logos";
function AboutContainer() {
  const iconProps = {
    width: 50,
    height: 50,
    color: "#ff8408",
    className: "transition-wheat",
  };
  const frontendSkills = [
    { title: "React.js", icon: <IconReact {...iconProps} /> },
    { title: "HTML", icon: <IconHtml5 {...iconProps} /> },
    { title: "CSS", icon: <IconCss3 {...iconProps} /> },
    { title: "Redux", icon: <IconRedux {...iconProps} /> },
    { title: "Three.js", icon: <IconThreedotjs {...iconProps} /> },
    { title: "Javascript ES6", icon: <IconJavascript {...iconProps} /> },
  ];

  const backendSkills = [
    { title: "Node.js", icon: <IconNodejs {...iconProps} /> },
    { title: "Express.js", icon: <IconExpress {...iconProps} /> },
    { title: "MongoDB", icon: <IconMongodb {...iconProps} /> },
    { title: "RabbitMQ", icon: <IconRabbitmq {...iconProps} /> },
    { title: "AmazonS3", icon: <IconAmazons3 {...iconProps} /> },
  ];
  return (
    <div className="about-container">
      <h1 className="about-title"><FormattedMessage id="about.title"/></h1>
      <p className="about-text">
        <FormattedMessage id="about.paragraph.1" />
      </p>
      <p className="about-text">
        <FormattedMessage id="about.paragraph.2" />
      </p>
      <p className="about-text">
        <FormattedMessage id="about.paragraph.3" />
      </p>
      <h1 className="about-title section">
        <FormattedMessage id="about.skills" />
      </h1>
      <div className="about-skills">
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
