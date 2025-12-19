import { useState, useEffect } from 'react';
import type { GitHubRepo } from '../types/github';
import { githubService } from '../services/githubService';

interface UseGitHubReposReturn {
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

export const useGitHubRepos = (): UseGitHubReposReturn => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        // Fetch both user repos and featured repos in parallel
        const [userRepos, featuredRepos] = await Promise.all([
          githubService.fetchUserRepos().catch(() => []),
          githubService.fetchFeaturedRepos().catch(() => []),
        ]);

        // Get IDs of featured repos to avoid duplicates
        const featuredRepoIds = new Set(featuredRepos.map((repo) => repo.id));

        // Filter user repos (exclude forks and test repos, but keep featured repos even if they're forks)
        const filteredUserRepos = userRepos.filter(
          (repo) =>
            !repo.name.includes('git_test') &&
            (!repo.fork || featuredRepoIds.has(repo.id))
        );

        // Combine featured repos with user repos, ensuring featured repos appear first
        // Remove duplicates by ID (featured repos take priority)
        const allReposMap = new Map<number, GitHubRepo>();

        // Convert FeaturedRepo to GitHubRepo by adding fork property
        // Featured repos come from GitHub API via fetchRepo, so they should have fork property
        // But TypeScript types say FeaturedRepo, so we need to convert it
        featuredRepos.forEach((repo) => {
          // Since fetchRepo returns GitHubRepo, featured repos should have fork property
          // We'll check if it exists, otherwise default to false
          const githubRepo: GitHubRepo = {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            html_url: repo.html_url,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            updated_at: repo.updated_at,
            fork: 'fork' in repo ? (repo as GitHubRepo).fork : false,
          };
          allReposMap.set(githubRepo.id, githubRepo);
        });

        // Add user repos (skip if already in featured repos)
        filteredUserRepos.forEach((repo) => {
          if (!allReposMap.has(repo.id)) {
            allReposMap.set(repo.id, repo);
          }
        });

        // Convert map to array and sort by updated date (most recent first)
        const combinedRepos = Array.from(allReposMap.values()).sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

        // Limit to most recent repos (if needed)
        setRepos(combinedRepos.slice(0, 50));
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to load projects. Please try again later.';
        setError(errorMessage);
        console.error('Error fetching repos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return { repos, loading, error };
};

