import { useState, useEffect } from 'react';
import type { Project } from '../data/projects';
import { projectService } from '../services/projectService';

interface UseFeaturedReposReturn {
  featuredRepos: Project[];
  loading: boolean;
  error: string | null;
}

export const useFeaturedRepos = (): UseFeaturedReposReturn => {
  const [featuredRepos, setFeaturedRepos] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadFeaturedProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.fetchProjects();
        if (isMounted) {
          const featured = data.filter((project) => project.featured);
          setFeaturedRepos(featured);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load featured projects');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadFeaturedProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return { featuredRepos, loading, error };
};


