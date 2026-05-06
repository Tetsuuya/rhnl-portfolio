import { useMemo } from 'react';
import type { Project } from '../data/projects';
import { projectsData } from '../data/projects';

interface UseGitHubReposReturn {
  repos: Project[];
  loading: boolean;
  error: string | null;
}

export const useGitHubRepos = (): UseGitHubReposReturn => {
  const repos = useMemo(
    () =>
      [...projectsData].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ),
    []
  );

  return { repos, loading: false, error: null };
};

