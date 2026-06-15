import { useGitHubRepos } from '../../hooks/useGitHubRepos';
import Tilt3D from '../../components/Tilt3D';

const Projects = () => {
  const { repos, loading, error } = useGitHubRepos();

  const renderTechStack = (techStack?: string[]) => {
    if (!techStack || techStack.length === 0) {
      return null;
    }

    return (
      <div className="mb-4 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-md bg-[#1d1a3d] px-3 py-1 text-xs font-medium text-[#b6abff]"
          >
            {tech}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-120px)] w-full py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 sm:mb-10 md:mb-12 text-center px-4">
            My Projects
          </h2>
          
          {/* Loading Skeleton Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-black/40 border-2 border-white/20 rounded-lg p-4 sm:p-5 md:p-6 backdrop-blur-sm animate-pulse"
              >
                <div className="h-6 bg-white/10 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-white/10 rounded mb-2 w-full"></div>
                <div className="h-4 bg-white/10 rounded mb-4 w-5/6"></div>
                <div className="flex items-center justify-between mt-4">
                  <div className="h-4 bg-white/10 rounded w-20"></div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-white/10 rounded w-12"></div>
                    <div className="h-4 bg-white/10 rounded w-12"></div>
                  </div>
                </div>
                <div className="h-3 bg-white/10 rounded w-24 mt-4"></div>
              </div>
            ))}
          </div>
          
          {/* Loading Spinner */}
          <div className="flex items-center justify-center mt-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-pink-300/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-pink-300 rounded-full animate-spin"></div>
              </div>
              <p className="text-white text-lg">Loading projects...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-120px)] w-full flex items-center justify-center py-8 sm:py-12 md:py-16 px-4">
        <div className="text-red-400 text-base sm:text-lg md:text-xl text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] w-full py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 sm:mb-10 md:mb-12 text-center px-4">
          My Projects
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {repos.map((repo) => (
            <Tilt3D key={repo.id} className="flex flex-col h-full rounded-lg">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col h-full bg-black/40 border-2 border-white/20 rounded-lg overflow-hidden transition-all duration-300 hover:border-pink-300/70 backdrop-blur-sm preserve-3d"
              >
                {repo.image && (
                  <div className="h-40 sm:h-36 md:h-40 overflow-hidden bg-black/60 translate-z-10">
                    <img
                      src={repo.image}
                      alt={repo.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      draggable={false}
                    />
                  </div>
                )}
                <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col preserve-3d">
                  <h3 className="text-white text-lg sm:text-xl font-bold mb-2 hover:text-pink-300 transition-colors translate-z-30">
                    {repo.name}
                  </h3>
                  {repo.description && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2 flex-1 translate-z-20">
                      {repo.description}
                    </p>
                  )}
                  <div className="translate-z-20">
                    {renderTechStack(repo.techStack)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-auto translate-z-10">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                      </svg>
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                      </svg>
                      {repo.forks_count}
                    </span>
                  </div>
                </div>
              </a>
            </Tilt3D>
          ))}
        </div>

        {repos.length === 0 && (
          <div className="text-center text-white text-base sm:text-lg md:text-xl mt-8 sm:mt-10 md:mt-12 px-4">
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;


