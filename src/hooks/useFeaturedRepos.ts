import { useMemo } from 'react';
import type { Project } from '../data/projects';
import { projectsData } from '../data/projects';

interface UseFeaturedReposReturn {
  featuredRepos: Project[];
  loading: boolean;
  error: string | null;
}

export const useFeaturedRepos = (): UseFeaturedReposReturn => {
  const featuredRepos = useMemo(
    () => projectsData.filter((project) => project.featured),
    []
  );

  return { featuredRepos, loading: false, error: null };
};

