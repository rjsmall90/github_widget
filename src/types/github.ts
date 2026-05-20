export interface Language {
  name: string;
  color: string;
}

export interface RepositoryTopic {
  topic: { name: string };
}

export interface PinnedRepo {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  primaryLanguage: Language | null;
  repositoryTopics: { nodes: RepositoryTopic[] };
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface LanguageStat {
  name: string;
  color: string;
  size: number;
}

export interface GithubData {
  pinnedRepos: PinnedRepo[];
  totalContributions: number;
  contributionWeeks: ContributionWeek[];
  languages: LanguageStat[];
  avatarUrl: string;
  name: string | null;
  bio: string | null;
}
