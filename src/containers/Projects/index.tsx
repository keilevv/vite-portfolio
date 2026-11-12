import ProjectCard from "../../components/ProjectCard";
import AutoexpressImage from "../../assets/autoexpress.png";
import LeafClassifierImage from "../../assets/leaf_classifier.png";
import BuceoAventuraImage from "../../assets/buceo_aventura.png";
import WorkwaveImage from "../../assets/workwave.png";
import MovifisioImage from "../../assets/movifisio.png";
import EatCloudImage from "../../assets/eatcloud.png";

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
      title: "SAPSAI",
      siteLink: "https://sapsai.iscoutb.dev/",
      githubLink: "https://github.com/keilevv/sapsai",
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
      title: "Movifisio",
      siteLink: "https://www.movifisioctg.com/",
      githubLink: "https://github.com/keilevv/frontend-movi",
      image: MovifisioImage,
      description: intl.formatMessage({
        id: "projectCard.movifisio.description",
      }),
      tags: [
        "React",
        "TypeScript",
        "TailwindCSS",
        "Vite",
        "ExpressJs",
        "PostgreSQL",
        "Node.js",
        "Cloudflare R2",
      ],
    },
        {
      title: "EatCloud",
      siteLink: "https://eatcloud-frontend.vercel.app/",
      githubLink: "https://github.com/keilevv/eatcloud-frontend",
      image: EatCloudImage,
      description: intl.formatMessage({
        id: "projectCard.movifisio.description",
      }),
      tags: [
        "Next.js",
        "React",
        "TypeScript",
        "TailwindCSS",
        "ExpressJs",
        "PostgreSQL",
        "Node.js",
        "Stadia Maps"
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

  // const workedOnProjects: ProjectCardProps[] = [
  //   {
  //     title: "Fleks",
  //     siteLink: "https://app.fleks.works/",
  //     githubLink: "",
  //     image: FleksImage,
  //     description: intl.formatMessage({ id: "projectCard.4.description" }),
  //     tags: ["React", "Javascript", "Redux", "Webpack", "Node.js", "Antd"],
  //   },
  //   {
  //     title: "Vonwood",
  //     siteLink: "https://vonwood.com/",
  //     githubLink: "",
  //     image: VonwoodImage,
  //     description: intl.formatMessage({ id: "projectCard.5.description" }),
  //     tags: ["React", "Typescript", "Redux", "Webpack", "Node.js", "Antd"],
  //   },
  // ];
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
      {/* <h1 className="text-3xl font-bold text-orange-500 my-10 text-center">
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
      </div> */}
    </div>
  );
}

export default injectIntl(ProjectsContainer);
