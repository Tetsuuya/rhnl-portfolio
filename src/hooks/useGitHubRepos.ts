import { useState, useEffect } from 'react';
import type { Project } from '../data/projects';
import { projectService } from '../services/projectService';

interface UseGitHubReposReturn {
  repos: Project[];
  loading: boolean;
  error: string | null;
}

export const useGitHubRepos = (): UseGitHubReposReturn => {
  const [repos, setRepos] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.fetchProjects();
        if (isMounted) {
          // Sort by updated_at descending
          const sorted = [...data].sort(
            (a, b) => {
              const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
              const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
              return bTime - aTime;
            }
          );
          setRepos(sorted);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load projects');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return { repos, loading, error };
};


