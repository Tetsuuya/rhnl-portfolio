import { useState, useEffect } from 'react';
import type { FeaturedRepo } from '../types/github';
import { githubService } from '../services/githubService';

interface UseFeaturedReposReturn {
  featuredRepos: FeaturedRepo[];
  loading: boolean;
  error: string | null;
}

export const useFeaturedRepos = (): UseFeaturedReposReturn => {
  const [featuredRepos, setFeaturedRepos] = useState<FeaturedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedRepos = async () => {
      try {
        const repos = await githubService.fetchFeaturedRepos();
        setFeaturedRepos(repos);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Missing required environment variables. Please check your .env file.';
        setError(errorMessage);
        console.error('Error fetching featured repos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRepos();
  }, []);

  return { featuredRepos, loading, error };
};

