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

  const maxTags = 6;
  const visibleTags = tags.slice(0, maxTags);
  const extraTagCount = Math.max(0, tags.length - maxTags);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;

    if (!descExpanded) {
      setCanExpand(el.scrollHeight > el.clientHeight);
    }
  }, [description, descExpanded]);

  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-[#f3d9b1]/15 bg-[#1a1816]/85 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#df7a26]/60 hover:shadow-[0_12px_30px_-10px_rgba(223,122,38,0.3)]">
      {/* Image Header with zoom & gradient blend */}
      <div className="relative h-44 w-full overflow-hidden sm:h-48">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          width={400}
          height={192}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1816] via-[#1a1816]/20 to-transparent" />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col gap-3 p-5 pt-3">
        <h2 className="text-xl font-bold tracking-tight text-[#f3d9b1] transition-colors duration-200 group-hover:text-[#df7a26]">
          {title}
        </h2>

        {/* Description: clamp by height; expand to show full content */}
        <div
          ref={descRef}
          className={`break-words text-sm leading-relaxed text-neutral-300 ${
            descExpanded ? "" : "h-16 overflow-hidden sm:h-20"
          }`}
        >
          {description}
        </div>

        {canExpand && (
          <button
            type="button"
            className="self-start cursor-pointer text-xs font-medium text-[#df7a26] hover:underline focus:outline-none"
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

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {visibleTags.map((tag, index) => (
            <span
              className="rounded-full border border-[#df7a26]/25 bg-[#df7a26]/10 px-2.5 py-0.5 text-xs font-medium text-[#f3d9b1]/90"
              key={index}
            >
              {tag}
            </span>
          ))}
          {extraTagCount > 0 && (
            <span className="rounded-full border border-neutral-700/60 bg-neutral-800/80 px-2.5 py-0.5 text-xs font-medium text-neutral-400">
              +{extraTagCount} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-wrap gap-2.5 pt-3">
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#f3d9b1]/25 bg-transparent px-3 py-2 text-xs font-medium text-[#f3d9b1] transition-all duration-200 hover:border-[#df7a26] hover:bg-[#df7a26]/15 hover:text-[#df7a26]"
            >
              <i className="fa-brands fa-github-alt text-sm" />
              <span>View Repo</span>
            </a>
          )}
          {siteLink && (
            <a
              href={siteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#df7a26] px-3 py-2 text-xs font-semibold text-[#121110] transition-all duration-200 hover:bg-[#f3923d] hover:shadow-[0_0_15px_rgba(223,122,38,0.4)]"
            >
              <i className="fa-solid fa-eye text-sm" />
              <FormattedMessage id="projectCard.button" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
