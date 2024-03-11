import ProjectCard from "../../components/ProjectCard";
import AutoexpressImage from "../../assets/autoexpress.png";
import VoxelEngineImage from "../../assets/voxelengine.png";
import "./style.css";
import { FormattedMessage } from "react-intl";
import { injectIntl } from "react-intl";

interface Props {
  intl: any;
}
function ProjectsContainer({ intl }: Props) {
  interface ProjectCardProps {
    title: string;
    siteLink: string;
    githubLink: string;
    image: string;
    description: string;
    tags: string[];
  }

  const projects: ProjectCardProps[] = [
    {
      title: "Autoexpress Client",
      siteLink: "https://www.autoexpressas.com/",
      githubLink: "https://github.com/keilevv/autoexpress-client",
      image: AutoexpressImage,
      description: intl.formatMessage({ id: "projectCard.1.description" }),
      tags: ["React", "Express", "Javascript ES6", "MongoDB"],
    },
    {
      title: "Voxelengine",
      siteLink: "https://voxelengine-lc43vw726-keilevvs-projects.vercel.app/",
      githubLink: "https://github.com/keilevv/voxelengine",
      image: VoxelEngineImage,
      description: intl.formatMessage({ id: "projectCard.2.description" }),
      tags: ["React", "Javascript ES6", "Three.js"],
    },
    {
      title: "Autoexpress Server",
      siteLink: "https://www.autoexpressas.com/",
      githubLink: "https://github.com/keilevv/autoexpress-server",
      image: AutoexpressImage,
      description: intl.formatMessage({ id: "projectCard.3.description" }),
      tags: ["ExpressJs", "MongoDB", "Mongoose", "Node.js"],
    },
  ];
  return (
    <div className="projects-container">
      <h1 className="projects-title">
        <FormattedMessage id="projects.title" />
      </h1>
      <div className="projects-content">
        {projects.map((project, index) => (
          <div className="project-card-container" key={index}>
            <ProjectCard
              title={project.title}
              siteLink={project.siteLink}
              githubLink={project.githubLink}
              image={project.image}
              description={project.description}
              tags={project.tags}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default injectIntl(ProjectsContainer);
