import { useGithubData } from "../hooks/useGithubData";
import PinnedRepos from "./PinnedRepos";
import ContributionGraph from "./ContributionGraph";
import LanguageBar from "./LanguageBar";

interface GithubWidgetProps {
  username: string;
  token?: string;
}



export default function GithubWidget({ username, token }: GithubWidgetProps) {
  const { data, loading, error } = useGithubData(username, token);

  if (loading) return <div className="gw-root gw-root--loading">Loading…</div>;
  if (error) return <div className="gw-root gw-root--error">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="gw-root">
      <header className="gw-header">
        <img src={data.avatarUrl} alt={username} className="gw-header__avatar" />
        <div className="gw-header__info">
          <span className="gw-header__name">{data.name ?? username}</span>
          {data.bio && <p className="gw-header__bio">{data.bio}</p>}
        </div>
      </header>

      <section className="gw-section">
        <h2 className="gw-section__title">Pinned</h2>
        <PinnedRepos repos={data.pinnedRepos} />
      </section>

      <section className="gw-section">
        <h2 className="gw-section__title">Activity</h2>
        <ContributionGraph
          weeks={data.contributionWeeks}
          totalContributions={data.totalContributions}
        />
      </section>

      <section className="gw-section">
        <h2 className="gw-section__title">Languages</h2>
        <LanguageBar languages={data.languages} />
      </section>
    </div>
  );
}
