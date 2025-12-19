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

// Cache for API responses (5 minutes TTL)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Get cached data or null if expired
const getCached = (key: string): any | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  if (cached) {
    cache.delete(key);
  }
  return null;
};

// Set cache data
const setCached = (key: string, data: any): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Create fetch headers with optional authentication
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  // Add GitHub token if available (optional but recommended)
  const githubToken = getEnvVarOptional('VITE_GITHUB_TOKEN');
  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }
  
  return headers;
};

// Fetch with retry logic, error handling, and caching
const fetchWithRetry = async <T>(
  url: string,
  cacheKey: string,
  retries = 2
): Promise<{ data: T; status: number }> => {
  // Check cache first
  const cached = getCached(cacheKey);
  if (cached !== null) {
    return { data: cached as T, status: 200 };
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: getHeaders(),
      });

      // Handle rate limiting
      if (response.status === 403) {
        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        const rateLimitReset = response.headers.get('X-RateLimit-Reset');
        
        if (rateLimitRemaining === '0') {
          const resetTime = rateLimitReset 
            ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString()
            : 'later';
          throw new Error(
            `GitHub API rate limit exceeded. Please try again after ${resetTime}. ` +
            `To increase the limit, add a GitHub Personal Access Token to your .env file as VITE_GITHUB_TOKEN.`
          );
        }
      }

      if (!response.ok && response.status !== 404) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      // Cache successful responses
      if (response.ok) {
        const data = await response.json();
        setCached(cacheKey, data);
        return { data: data as T, status: response.status };
      }

      return { data: null as T, status: response.status };
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      // Exponential backoff: wait 1s, 2s, 4s
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  throw new Error('Failed to fetch after retries');
};

export const githubService = {
  /**
   * Fetches all repositories for a GitHub user
   */
  async fetchUserRepos(): Promise<GitHubRepo[]> {
    const githubApiBase = getEnvVar('VITE_GITHUB_API_BASE_URL');
    const githubUsername = getEnvVar('VITE_GITHUB_USERNAME');
    const url = `${githubApiBase}/users/${githubUsername}/repos?sort=updated&per_page=100`;
    const cacheKey = `user_repos_${githubUsername}`;

    const { data, status } = await fetchWithRetry<GitHubRepo[]>(url, cacheKey);

    if (status !== 200) {
      throw new Error('Failed to fetch repositories');
    }

    return data;
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

      const url = `${githubApiBase}/repos/${repoPath}`;
      const cacheKey = `repo_${repoPath}`;

      const { data, status } = await fetchWithRetry<GitHubRepo>(url, cacheKey);

      if (status !== 200) {
        if (status === 404) {
          console.warn(`Repository not found: ${repoPath}`);
        }
        return null;
      }

      return data;
    } catch (error) {
      console.error(`Error fetching repo ${repoIdentifier}:`, error);
      // If it's a rate limit error, re-throw it so it can be handled properly
      if (error instanceof Error && error.message.includes('rate limit')) {
        throw error;
      }
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

    // Fetch all repos in parallel with error handling
    const reposToFetch = [
      this.fetchRepo(repo1Identifier).catch((err) => {
        console.error(`Error fetching featured repo 1 (${repo1Identifier}):`, err);
        return null;
      }),
      this.fetchRepo(repo2Identifier).catch((err) => {
        console.error(`Error fetching featured repo 2 (${repo2Identifier}):`, err);
        return null;
      }),
      this.fetchRepo(repo3Identifier).catch((err) => {
        console.error(`Error fetching featured repo 3 (${repo3Identifier}):`, err);
        return null;
      }),
    ];

    // Add automata simulator repo if identifier is provided
    if (automataRepoIdentifier) {
      reposToFetch.push(
        this.fetchRepo(automataRepoIdentifier).catch((err) => {
          console.error(`Error fetching automata repo (${automataRepoIdentifier}):`, err);
          return null;
        })
      );
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

