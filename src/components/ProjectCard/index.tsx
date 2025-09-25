import { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";

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
  const [descExpanded, setDescExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const descRef = useRef<HTMLDivElement | null>(null);
  // Height-based truncation settings
  const maxTags = 6; // adjust how many tags to show
  const visibleTags = tags.slice(0, maxTags);
  const extraTagCount = Math.max(0, tags.length - maxTags);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;

    // Only measure when collapsed to determine if we can expand
    if (!descExpanded) {
      setCanExpand(el.scrollHeight > el.clientHeight);
    }
  }, [description, descExpanded]);
  return (
    <div className="w-[320px] sm:w-[360px] md:w-[400px] border border-white rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-shadow shadow-orange-500 transition-200">
      <img
        className="w-full rounded-t-lg h-32 sm:h-36 md:h-40 object-cover"
        src={image}
        alt="Autoexpress"
      />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h1 className="text-xl font-bold text-orange-200">{title}</h1>
        {/* Description: clamp by height; expand to show full content and grow card */}
        <div
          ref={descRef}
          className={`${
            descExpanded ? "" : "overflow-hidden"
          } text-sm leading-snug break-words ${
            descExpanded ? "" : "h-16 sm:h-20 md:h-24"
          }`}
        >
          {description}
        </div>
        {canExpand && (
          <button
            type="button"
            className="self-start text-orange-300  cursor-pointer text-xs font-medium hover:underline focus:outline-none"
            aria-expanded={descExpanded}
            onClick={() => setDescExpanded((v) => !v)}
          >
            {descExpanded ? (
              <FormattedMessage id="projectCard.showLess" />
            ) : (
              <FormattedMessage id="projectCard.showMore" />
            )}
          </button>
        )}
        {/* Tags: show first N and summarize remainder */}
        <div className="flex gap-2 flex-wrap">
          {visibleTags.map((tag, index) => (
            <span
              className="bg-gray-200 text-gray-900 px-2 py-1 rounded"
              key={index}
            >
              {tag}
            </span>
          ))}
          {extraTagCount > 0 && (
            <span className="bg-gray-200 text-gray-900 px-2 py-1 rounded">
              +{extraTagCount} more
            </span>
          )}
        </div>
        <div className="mt-auto flex gap-2">
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
