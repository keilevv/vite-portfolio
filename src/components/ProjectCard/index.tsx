import { FormattedMessage } from "react-intl";
import { useState } from "react";

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
  const [expanded, setExpanded] = useState(false);
  const charLimit = 140; // adjust as desired
  const isLong = description && description.length > charLimit;
  const visibleText =
    expanded || !isLong ? description : description.slice(0, charLimit).trim();
  return (
    <div className="max-w-[400px] border border-white rounded-lg min-h-[400px] hover:shadow-lg transition-shadow shadow-gray-200">
      <img
        className="w-full rounded-t-lg h-[150px] object-cover"
        src={image}
        alt="Autoexpress"
      />

      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-orange-200">{title}</h1>
        <p>
          {visibleText}
          {!expanded && isLong ? "... " : " "}
          {isLong && (
            <button
              type="button"
              className="text-orange-300 font-medium hover:underline focus:outline-none cursor-pointer"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "show less" : "show more"}
            </button>
          )}
        </p>
        <div className="flex gap-2 flex-wrap ">
          {tags.map((tag, index) => (
            <span
              className="bg-gray-200 text-gray-900 px-2 py-1 rounded"
              key={index}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          {githubLink && (
            <button className="flex gap-2 items-center border border-white rounded px-2 py-1 hover:bg-orange-500 hover:text-black cursor-pointer transition-colors">
              <a
                className="fa-brands fa-github-alt github-icon"
                href={githubLink}
                target="_blank"
              ></a>
              View Repo
            </button>
          )}
          <button
            className="flex gap-2 items-center border border-white rounded px-2 py-1 hover:bg-orange-500 hover:text-black cursor-pointer transition-colors"
            onClick={() => window.open(siteLink)}
          >
            <div className="fa-solid fa-eye github-icon" />
            <FormattedMessage id="projectCard.button" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProjectCard;
