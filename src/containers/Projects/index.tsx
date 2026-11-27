import ProjectCard from "../../components/ProjectCard";
import AutoexpressImage from "../../assets/autoexpress.webp";
import LeafClassifierImage from "../../assets/leaf_classifier.webp";
import BuceoAventuraImage from "../../assets/buceo_aventura.webp";
import WorkwaveImage from "../../assets/workwave.webp";
import MovifisioImage from "../../assets/movifisio.webp";
import EatCloudImage from "../../assets/eatcloud.webp";

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
    <div className="md:px-8 px-6 py-20">
      <h1 className="section-title mb-10" data-parallax-speed="0.08">
        <FormattedMessage id="projects.owned" />
      </h1>
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-6 md:gap-8">
        {projects.map((project, index) => (
          <div
            className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1.35rem)] max-w-[400px]"
            key={index}
            data-parallax-speed={(index % 3 === 0 ? 0.04 : index % 3 === 1 ? -0.03 : 0.02).toString()}
          >
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
