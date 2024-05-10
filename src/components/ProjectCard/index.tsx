import { FormattedMessage } from "react-intl";
import "./style.css";

interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  tags: string[];
  siteLink: string;
  githubLink: string;
}

function ProjectCard({
  image,
  title,
  description,
  tags,
  siteLink,
  githubLink,
}: ProjectCardProps) {
  return (
    <div className="project-card">
      <div className="project-card-image">
        <img className="project-image" src={image} alt="Autoexpress" />
      </div>
      <h1 className="project-card-title">{title}</h1>
      <p>{description}</p>
      <div className="project-tags">
        {tags.map((tag, index) => (
          <span className="project-tag" key={index}>
            {tag}
          </span>
        ))}
      </div>
      {githubLink && (
        <div className="icon-container">
          <a
            className="fa-brands fa-github-alt github-icon"
            href={githubLink}
            target="_blank"
          ></a>
        </div>
      )}
      <button className="project-button" onClick={() => window.open(siteLink)}>
        <FormattedMessage id="projectCard.button" />
      </button>
    </div>
  );
}
export default ProjectCard;
