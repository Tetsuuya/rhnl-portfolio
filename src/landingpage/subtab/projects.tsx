import { useState } from 'react';
import { useGitHubRepos } from '../../hooks/useGitHubRepos';
import Tilt3D from '../../components/Tilt3D';
import type { Project } from '../../data/projects';

const Projects = () => {
  const { repos, loading, error } = useGitHubRepos();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
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

  if (selectedProject) {
    return (
      <div className="min-h-[calc(100vh-120px)] w-full pt-1 sm:pt-2 pb-8 sm:pb-12 animate-modal-fade-in">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl">
          {/* Back Button */}
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 px-4 py-2 mb-4 text-sm font-semibold rounded-lg border border-white/20 text-gray-300 bg-white/5 hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </button>

          {/* Project Detailed View Card */}
          <div className="bg-black/40 border-2 border-white/20 rounded-2xl overflow-hidden backdrop-blur-sm p-6 sm:p-8 space-y-6 animate-modal-scale-up">
            {/* Banner Image */}
            {selectedProject.image && (
              <div className="w-full h-40 sm:h-64 rounded-xl overflow-hidden bg-black/60">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.name}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: selectedProject.image_position || 'center center' }}
                  draggable={false}
                />
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight">
                {selectedProject.name}
              </h3>

              {/* Technologies */}
              {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-[#181630] border border-cyan-500/30 px-3.5 py-1 text-xs font-semibold text-cyan-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex gap-6 text-sm text-gray-400 py-2 border-y border-white/10">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Stars: <strong className="text-white">{selectedProject.stargazers_count}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
                  </svg>
                  Forks: <strong className="text-white">{selectedProject.forks_count}</strong>
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2 pt-2">
                <h4 className="text-pink-300 text-sm font-bold uppercase tracking-wider">Project Description</h4>
                <p className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
                  {selectedProject.description}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4 pt-6">
                {selectedProject.repo_url && (
                  <a
                    href={selectedProject.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border border-white/20 text-gray-300 bg-white/5 hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-200 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                    View Code
                  </a>
                )}
                <a
                  href={selectedProject.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl border-2 border-pink-400/60 text-pink-300 bg-pink-950/20 hover:bg-pink-500/20 hover:border-pink-400 hover:text-pink-100 transition-all duration-200 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] w-full py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 sm:mb-10 md:mb-12 text-center px-4">
          My Projects
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {repos.map((repo) => (
            <Tilt3D 
              key={repo.id} 
              className="flex flex-col h-full rounded-lg"
              onClick={() => setSelectedProject(repo)}
            >
              <div
                className="flex flex-col h-full bg-black/40 border-2 border-white/20 rounded-lg overflow-hidden transition-all duration-300 hover:border-pink-300/70 backdrop-blur-sm preserve-3d cursor-pointer"
              >
                {repo.image && (
                  <div className="h-40 sm:h-36 md:h-40 overflow-hidden bg-black/60 translate-z-10">
                    <img
                      src={repo.image}
                      alt={repo.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      style={{ objectPosition: repo.image_position || 'center center' }}
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
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4 translate-z-10">
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
                  {/* Action Buttons */}
                  <div className="relative z-10 flex items-center justify-between gap-2 mt-auto pt-1">
                    {/* Repo - left, only if repo_url exists */}
                    {repo.repo_url ? (
                      <a
                        href={repo.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-white/20 text-gray-400 bg-white/5 hover:bg-white/10 hover:border-white/40 hover:text-gray-200 transition-all duration-200"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                        </svg>
                        Repo
                      </a>
                    ) : (
                      <span />
                    )}
                    {/* Live Demo - always on right */}
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border-2 border-pink-400/60 text-pink-300 bg-pink-950/20 hover:bg-pink-500/20 hover:border-pink-400 transition-all duration-200 hover:shadow-[0_0_12px_rgba(236,72,153,0.4)] ml-auto"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  </div>
                </div>
              </div>
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


