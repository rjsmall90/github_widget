import type { GithubData, LanguageStat } from "../types/github";

const GITHUB_GRAPHQL = process.env.GITHUB_GRAPHQL_ENDPOINT;

const QUERY = `
  query($username: String!) {
    user(login: $username) {
      name
      bio
      avatarUrl
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            primaryLanguage { name color }
            repositoryTopics(first: 5) {
              nodes { topic { name } }
            }
          }
        }
      }
      contributionsCollection {
        totalCommitContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
        nodes {
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node { name color }
            }
          }
        }
      }
    }
  }
`;

function aggregateLanguages(repos: {
  languages: { edges: { size: number; node: { name: string; color: string } }[] };
}[]): LanguageStat[] {
  const totals = new Map<string, { color: string; size: number }>();

  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      const existing = totals.get(edge.node.name);
      if (existing) {
        existing.size += edge.size;
      } else {
        totals.set(edge.node.name, { color: edge.node.color, size: edge.size });
      }
    }
  }

  return Array.from(totals.entries())
    .map(([name, { color, size }]) => ({ name, color, size }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 6);
}

export async function fetchGithubData(
  username: string,
  token?: string
): Promise<GithubData> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `bearer ${token}`;

  const res = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query: QUERY, variables: { username } }),
  });

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);

  const user = json.data.user;
  const calendar = user.contributionsCollection.contributionCalendar;

  return {
    name: user.name,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    pinnedRepos: user.pinnedItems.nodes,
    totalContributions: calendar.totalContributions,
    contributionWeeks: calendar.weeks,
    languages: aggregateLanguages(user.repositories.nodes),
  };
}
