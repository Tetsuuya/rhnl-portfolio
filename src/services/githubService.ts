import type { GitHubRepo, FeaturedRepo } from '../types/github';

const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getEnvVarOptional = (key: string): string | undefined => {
  return import.meta.env[key];
};

export const githubService = {
  /**
   * Fetches all repositories for a GitHub user
   */
  async fetchUserRepos(): Promise<GitHubRepo[]> {
    const githubApiBase = getEnvVar('VITE_GITHUB_API_BASE_URL');
    const githubUsername = getEnvVar('VITE_GITHUB_USERNAME');

    const response = await fetch(
      `${githubApiBase}/users/${githubUsername}/repos?sort=updated&per_page=100`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    return response.json();
  },

  /**
   * Fetches a specific repository by name
   * Supports both "repo-name" (assumes user's repo) and "owner/repo-name" formats
   */
  async fetchRepo(repoIdentifier: string): Promise<GitHubRepo | null> {
    try {
      const githubApiBase = getEnvVar('VITE_GITHUB_API_BASE_URL');
      const githubUsername = getEnvVar('VITE_GITHUB_USERNAME');

      // If repoIdentifier contains '/', treat it as "owner/repo"
      // Otherwise, assume it's from the user's account
      const repoPath = repoIdentifier.includes('/')
        ? repoIdentifier
        : `${githubUsername}/${repoIdentifier}`;

      const response = await fetch(
        `${githubApiBase}/repos/${repoPath}`
      );

      if (!response.ok) {
        return null;
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching repo ${repoIdentifier}:`, error);
      return null;
    }
  },

  /**
   * Fetches featured repositories
   * Supports both "repo-name" (assumes user's repo) and "owner/repo-name" formats
   */
  async fetchFeaturedRepos(): Promise<FeaturedRepo[]> {
    const repo1Identifier = getEnvVar('VITE_FEATURED_REPO_1');
    const repo2Identifier = getEnvVar('VITE_FEATURED_REPO_2');
    const repo3Identifier = getEnvVar('VITE_FEATURED_REPO_3');
    const automataRepoIdentifier = getEnvVarOptional('VITE_FEATURED_REPO_AUTOMATA');

    // Fetch all repos in parallel
    const reposToFetch = [
      this.fetchRepo(repo1Identifier),
      this.fetchRepo(repo2Identifier),
      this.fetchRepo(repo3Identifier),
    ];

    // Add automata simulator repo if identifier is provided
    if (automataRepoIdentifier) {
      reposToFetch.push(this.fetchRepo(automataRepoIdentifier));
    }

    const fetchedRepos = await Promise.all(reposToFetch);

    // Filter out null values and map to FeaturedRepo (GitHubRepo is compatible since FeaturedRepo is a subset)
    return fetchedRepos
      .filter((repo): repo is GitHubRepo => repo !== null)
      .map((repo): FeaturedRepo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        updated_at: repo.updated_at,
      }));
  },

  /**
   * Filters repositories to exclude forks and test repos
   */
  filterRepos(repos: GitHubRepo[]): GitHubRepo[] {
    return repos
      .filter((repo) => !repo.name.includes('git_test') && !repo.fork)
      .slice(0, 12); // Limit to 12 most recent
  },
};

