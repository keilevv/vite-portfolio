import ProjectCard from "../../components/ProjectCard";
import AutoexpressImage from "../../assets/autoexpress.png";
import VoxelEngineImage from "../../assets/voxelengine.png";
import FleksImage from "../../assets/fleks.png";
import VonwoodImage from "../../assets/vonwood.png";

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
      tags: [
        "React",
        "Javascript",
        "Redux",
        "HTML",
        "CSS",
        "TailwindCSS",
        "Vite",
      ],
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

  const workedOnProjects: ProjectCardProps[] = [
    {
      title: "Fleks",
      siteLink: "https://app.fleks.works/",
      githubLink: "",
      image: FleksImage,
      description: intl.formatMessage({ id: "projectCard.4.description" }),
      tags: ["React", "Javascript", "Redux", "Webpack", "Node.js", "Antd"],
    },
    {
      title: "Vonwood",
      siteLink: "https://vonwood.com/",
      githubLink: "",
      image: VonwoodImage,
      description: intl.formatMessage({ id: "projectCard.5.description" }),
      tags: ["React", "Typescript", "Redux", "Webpack", "Node.js", "Antd"],
    },
  ];
  return (
    <div className="projects-container">
      <div className="projects-content">
        <h1 className="projects-title">
          <FormattedMessage id="projects.owned" />
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
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
        <h1 className="projects-title" style={{ marginTop: "80px" }}>
          <FormattedMessage id="projects.worked" />
        </h1>
        {workedOnProjects.map((project, index) => (
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
