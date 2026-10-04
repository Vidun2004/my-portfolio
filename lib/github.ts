export type ContributionDay = {
  date: string;
  count: number;
};

export type ContributionData = {
  login: string;
  total: number;
  weeks: ContributionDay[][];
};

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

/**
 * GitHub contribution calendar via the GraphQL API. Needs GITHUB_TOKEN
 * (any classic PAT) + GITHUB_USERNAME. Cached hourly. Null when
 * unconfigured — the section hides itself.
 */
export async function getContributions(): Promise<ContributionData | null> {
  const token = process.env.GITHUB_TOKEN;
  const login =
    process.env.GITHUB_USERNAME ??
    (() => {
      const url = process.env.NEXT_PUBLIC_GITHUB_URL ?? "";
      const m = url.match(/github\.com\/([^/]+)/i);
      return m?.[1] ?? null;
    })();
  if (!token || !login) return null;
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: {
              totalContributions?: number;
              weeks?: { contributionDays?: { date: string; contributionCount: number }[] }[];
            };
          };
        };
      };
    };
    const cal = json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal?.weeks?.length) return null;
    return {
      login,
      total: cal.totalContributions ?? 0,
      weeks: cal.weeks.map(
        (w) =>
          w.contributionDays?.map((d) => ({ date: d.date, count: d.contributionCount })) ?? [],
      ),
    };
  } catch {
    return null;
  }
}
