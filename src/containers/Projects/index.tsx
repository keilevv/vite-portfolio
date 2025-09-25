import ProjectCard from "../../components/ProjectCard";
import AutoexpressImage from "../../assets/autoexpress.png";
import VoxelEngineImage from "../../assets/voxelengine.png";
import FleksImage from "../../assets/fleks.png";
import VonwoodImage from "../../assets/vonwood.png";
import LeafClassifierImage from "../../assets/leaf_classifier.png";
import BuceoAventuraImage from "../../assets/buceo_aventura.png";
import WorkwaveImage from "../../assets/workwave.png";

// import "./style.css";
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
      title: "Autoexpress",
      siteLink: "https://www.autoexpressas.com/",
      githubLink: "https://github.com/keilevv/autoexpress-client",
      image: AutoexpressImage,
      description: intl.formatMessage({ id: "projectCard.1.description" }),
      tags: [
        "React",
        "Javascript",
        "TailwindCSS",
        "Vite",
        "ExpressJs",
        "MongoDB",
        "Node.js",
      ],
    },
    {
      title: "Leaf Classifier",
      siteLink: "http://129.153.122.159/",
      githubLink: "https://github.com/keilevv/leaf-classifier",
      image: LeafClassifierImage,
      description: intl.formatMessage({
        id: "projectCard.leaf_classifier.description",
      }),
      tags: [
        "React",
        "Javascript",
        "TailwindCSS",
        "Vite",
        "ExpressJs",
        "PostgreSQL",
        "Bun.js",
      ],
    },
    {
      title: "Buceo Aventura",
      siteLink: "https://diving-center.vercel.app/",
      githubLink: "https://github.com/keilevv/diving-center",
      image: BuceoAventuraImage,
      description: intl.formatMessage({
        id: "projectCard.buceo_aventura.description",
      }),
      tags: [
        "React",
        "Typescript",
        "TailwindCSS",
        "Vite",
        "ExpressJs",
        "PostgreSQL",
        "Bun.js",
      ],
    },
    {
      title: "Voxelengine",
      siteLink: "https://voxelengine-lc43vw726-keilevvs-projects.vercel.app/",
      githubLink: "https://github.com/keilevv/voxelengine",
      image: VoxelEngineImage,
      description: intl.formatMessage({ id: "projectCard.2.description" }),
      tags: ["React", "Javascript ES6", "Three.js", "WebGL", "Vite"],
    },
    {
      title: "Nestor Castelblanco",
      siteLink: "https://workwave-hjox.onrender.com/",
      githubLink: "https://github.com/keilevv/workwave",
      image: WorkwaveImage,
      description: intl.formatMessage({
        id: "projectCard.workwave.description",
      }),
      tags: [
        "React",
        "Javascript",
        "TailwindCSS",
        "Vite",
        "ExpressJs",
        "MongoDB",
      ],
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
    <div className="md:p-8 p-2">
      <h1 className="text-3xl font-bold text-orange-500 mb-10 text-center">
        <FormattedMessage id="projects.owned" />
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {projects.map((project, index) => (
          <div className="max-w-[400px]" key={index}>
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
      <h1 className="text-3xl font-bold text-orange-500 my-10 text-center">
        <FormattedMessage id="projects.worked" />
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {workedOnProjects.map((project, index) => (
          <div className="" key={index}>
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
