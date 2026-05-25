import type { PinnedRepo } from "../types/github";
import StatBadge from "./StatBadge";

interface PinnedReposProps {
  repos: PinnedRepo[];
}

export default function PinnedRepos({ repos }: PinnedReposProps) {
  return (
    <ul className="gw-pinned">
      {repos.map((repo) => (
        <li key={repo.name} className="gw-pinned__card">
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="gw-pinned__name"
          >
            {repo.name}
          </a>
          {repo.description && (
            <p className="gw-pinned__description">{repo.description}</p>
          )}
          <div className="gw-pinned__meta">
            {repo.primaryLanguage && (
              <span className="gw-pinned__lang">
                <span
                  className="gw-pinned__lang-dot"
                  style={{ backgroundColor: repo.primaryLanguage.color }}
                />
                {repo.primaryLanguage.name}
              </span>
            )}
            {repo.stargazerCount > 0 && (
              <StatBadge label="stars" value={repo.stargazerCount} />
            )}
          </div>
          {repo.repositoryTopics.nodes.length > 0 && (
            <ul className="gw-pinned__topics">
              {repo.repositoryTopics.nodes.map(({ topic }) => (
                <li key={topic.name} className="gw-pinned__topic">
                  {topic.name}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
