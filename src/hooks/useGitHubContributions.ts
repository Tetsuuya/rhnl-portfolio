import { useState, useEffect } from 'react';

const GITHUB_USERNAME = 'Tetsuuya';

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface GitHubContributions {
  total: number | null;
  days: ContributionDay[];
}

/**
 * Fetches GitHub contributions for the last year.
 * `total` stays null while loading or if the request fails, so callers can hide the tile.
 */
export const useGitHubContributions = (): GitHubContributions => {
  const [data, setData] = useState<GitHubContributions>({ total: null, days: [] });

  useEffect(() => {
    let isMounted = true;

    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((json) => {
        if (isMounted && typeof json?.total?.lastYear === 'number') {
          setData({ total: json.total.lastYear, days: json.contributions ?? [] });
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
};
