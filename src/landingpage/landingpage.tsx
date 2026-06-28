import profilePicture from '../assets/profilepicutre.png';
import { useFeaturedRepos } from '../hooks/useFeaturedRepos';
import { useTechStack } from '../hooks/useTechStack';
import { useExperience } from '../hooks/useExperience';
import Tilt3D from '../components/Tilt3D';

const LandingPage = () => {
  const { featuredRepos, loading } = useFeaturedRepos();
  const { techItems, loading: techLoading } = useTechStack();
  const { experienceItems, loading: expLoading } = useExperience();

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

  return (
    <>
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 pt-2 sm:pt-4 md:pt-6 pb-8 sm:pb-12 md:pb-16 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-200px)] gap-8 sm:gap-10 lg:gap-24 xl:gap-32 mb-12 sm:mb-16">
          {/* Left Content Area */}
          <Tilt3D className="flex-1 max-w-2xl text-center lg:text-left w-full">
            <div className="preserve-3d">
              <p className="text-white text-base sm:text-lg md:text-xl mb-3 sm:mb-4 transition-all duration-300 hover:translate-y-[-8px] hover:translate-x-2 hover:shadow-[0_10px_30px_rgba(255,255,255,0.4)] hover:scale-105 cursor-default translate-z-10">Hi, I'm Rhenel,</p>
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight transition-all duration-300 hover:translate-y-[-10px] hover:translate-x-2 hover:shadow-[0_15px_40px_rgba(255,255,255,0.5)] hover:scale-[1.02] cursor-default translate-z-30">
                <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl whitespace-nowrap">I'M A FULL-STACK</span>
                <br />
                <span className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">DEVELOPER</span>
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm md:text-sm mb-6 sm:mb-8 leading-relaxed max-w-lg transition-all duration-300 hover:translate-y-[-8px] hover:translate-x-2 hover:shadow-[0_10px_30px_rgba(255,255,255,0.4)] hover:scale-105 cursor-default px-2 sm:px-0 translate-z-20 line-clamp-3">
                I specialize in building modern, scalable web applications with a focus on clean code, great user experiences, and robust backend solutions. Passionate about turning ideas into reality through technology.
              </p>
              <a 
                href="#projects" 
                className="inline-block text-white text-sm sm:text-base md:text-lg font-medium relative pb-1 group px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 hover:shadow-[0_10px_30px_rgba(6,182,212,0.9)] hover:bg-cyan-500/10 hover:translate-y-[-8px] hover:translate-x-2 hover:scale-105 translate-z-10"
                style={{ color: 'white' }}
              >
                View My Projects
                <span className="absolute bottom-0 left-[-8px] right-[-8px] h-[2px] bg-cyan-400 group-hover:shadow-[0_0_10px_rgba(6,182,212,1)]"></span>
              </a>
            </div>
          </Tilt3D>

          {/* Right Content Area - Profile Picture */}
          <Tilt3D className="flex-1 flex justify-center items-center w-full">
            <div className="flex flex-col items-center preserve-3d">
              <div className="w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-[320px] lg:h-[320px] xl:w-[390px] xl:h-[390px] rounded-full border-2 border-white mb-4 sm:mb-6 overflow-visible relative flex items-center justify-center transition-all duration-300 hover:shadow-[0_15px_50px_rgba(255,255,255,0.6)] hover:border-white/80 hover:scale-110 hover:translate-y-[-10px] translate-z-30">
                <img 
                  src={profilePicture} 
                  alt="Rhenel" 
                  className="w-full h-full rounded-full object-contain"
                  style={{
                    objectPosition: 'center center'
                  }}
                  draggable={false}
                />
                <div className="absolute bottom-[-15px] sm:bottom-[-20px] left-1/2 transform -translate-x-1/2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 border-2 border-pink-300 rounded-lg bg-black/80 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_35px_rgba(236,72,153,0.9)] hover:border-pink-400 hover:translate-y-[-8px] hover:scale-110 translate-z-20">
                  <span className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold uppercase tracking-wide whitespace-nowrap">
                    FULL-STACK DEVELOPER
                  </span>
                </div>
              </div>
            </div>
          </Tilt3D>
        </div>

        {/* Featured Projects Section */}
        <div className="mt-12 sm:mt-16 md:mt-24 mb-12 sm:mb-16">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 sm:mb-10 md:mb-12 text-center px-4">
            Featured Projects
          </h2>
          
          {loading ? (
            <div className="text-center text-white text-xl py-16">
              Loading featured projects...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {featuredRepos.map((repo) => (
                  <Tilt3D key={repo.id} className="flex flex-col h-full rounded-lg">
                    <div
                      className="flex flex-col h-full bg-black/40 border-2 border-white/20 rounded-lg overflow-hidden transition-all duration-300 hover:border-pink-300/70 backdrop-blur-sm preserve-3d"
                    >
                      {repo.image && (
                        <div className="h-48 sm:h-40 md:h-48 overflow-hidden bg-black/60 translate-z-10">
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
                        <div className="relative z-10 flex items-center gap-2 mt-auto pt-1">
                          {/* Repo - left, only if repo_url exists */}
                          {repo.repo_url && (
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
              <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
                <a 
                  href="#projects" 
                  className="inline-block text-white text-sm sm:text-base md:text-lg font-medium px-6 sm:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg border-2 border-pink-300 bg-black/85 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_35px_rgba(236,72,153,0.9)] hover:border-pink-400 hover:translate-y-[-8px] hover:scale-105"
                  style={{ color: 'white' }}
                >
                  View More
                </a>
              </div>
            </>
          )}
        </div>

        {/* Tech Stack & Tools Section */}
        <div className="mt-12 sm:mt-16 md:mt-24 mb-12 sm:mb-16">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-center px-4">
            Tech Stack & Tools
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-center mb-8 sm:mb-10 md:mb-12 text-gray-300 px-4">
            The languages, frameworks, databases, and tools I use to bring ideas to life.
          </p>
          
          {techLoading ? (
            <div className="flex flex-col items-center py-12 gap-4">
              <div className="w-10 h-10 border-4 border-transparent border-t-pink-400 border-pink-400/20 rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">Loading tech stack...</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {/* Render Categories */}
              {['Language', 'Framework', 'Database', 'Design', 'Tool'].map((category) => {
                const items = techItems.filter((t) => t.category === category);
                if (items.length === 0) return null;
                
                return (
                  <Tilt3D 
                    key={category}
                    className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-16px)] xl:w-[calc(20%-20px)] min-w-[220px] max-w-[280px] rounded-xl"
                  >
                    <div className="bg-black/40 border-2 border-white/20 rounded-xl p-5 backdrop-blur-sm transition-all duration-300 hover:border-pink-300/70 flex flex-col h-full preserve-3d">
                      <h3 className="text-lg font-bold mb-4 text-pink-300 border-b border-white/10 pb-2 translate-z-20">
                        {category === 'Language' ? 'Languages' : 
                         category === 'Framework' ? 'Frameworks' : 
                         category === 'Database' ? 'Databases' : 
                         category === 'Tool' ? 'Tools' : category}
                      </h3>
                      <div className="flex flex-col gap-3 flex-grow preserve-3d translate-z-10">
                        {items.map((tech) => (
                          <div 
                            key={tech.id} 
                            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-2.5 hover:border-pink-300/50 hover:bg-pink-500/5 transition-all duration-300 hover:scale-105 group"
                          >
                            <div 
                              className="w-7 h-7 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain group-hover:scale-110 transition-transform duration-300 text-white" 
                              dangerouslySetInnerHTML={{ __html: tech.icon }} 
                            />
                            <span className="text-white text-xs sm:text-sm font-semibold group-hover:text-pink-300 transition-colors">
                              {tech.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Tilt3D>
                );
              })}
            </div>
          )}
        </div>

        {/* Work Experience Section - Glimpse */}
        <div className="mt-12 sm:mt-16 md:mt-24 mb-12 sm:mb-16">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-center px-4">
            Work Experience
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-center mb-10 text-gray-300 px-4">
            A quick glimpse of my latest professional engagement.
          </p>

          {expLoading ? (
            <div className="flex flex-col items-center py-12 gap-4">
              <div className="w-10 h-10 border-4 border-transparent border-t-pink-400 border-pink-400/20 rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">Loading experience glimpse...</p>
            </div>
          ) : experienceItems.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No work experience entries found. Add some in the Admin Portal!</p>
          ) : (
            <div className="max-w-2xl mx-auto px-4">
              {/* Show only the latest item (first index) */}
              {(() => {
                const latestExp = experienceItems[0];
                return (
                  <Tilt3D className="rounded-xl">
                    <div className="bg-black/40 border-2 border-white/20 rounded-xl p-6 sm:p-8 backdrop-blur-sm transition-all duration-300 hover:border-pink-300/70 relative overflow-hidden group preserve-3d">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-all"></div>
                      
                      <div className="flex flex-col gap-2 mb-4 border-b border-white/10 pb-4 preserve-3d">
                        <div className="flex flex-wrap items-center gap-2 mb-1 translate-z-10">
                          <span className="inline-block px-3 py-1 bg-pink-950/45 border border-pink-700/40 text-xs font-bold text-pink-300 rounded-full">
                            {latestExp.duration}
                          </span>
                          {latestExp.location && (
                            <span className="flex items-center gap-1.5 text-xs text-gray-400">
                              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {latestExp.location}
                            </span>
                          )}
                        </div>

                        <div className="translate-z-20">
                          <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-pink-300 transition-colors">
                            {latestExp.role}
                          </h3>
                          <h4 className="text-base font-semibold text-cyan-300">
                            {latestExp.company}{latestExp.job_type && ` · ${latestExp.job_type}`}
                          </h4>
                        </div>
                      </div>
                      
                      {latestExp.description && (
                        <div className="bg-[#100e26]/60 border border-white/5 rounded-lg p-4 mb-4 text-gray-300 text-sm leading-relaxed translate-z-10">
                          {latestExp.description}
                        </div>
                      )}

                      {latestExp.key_achievements && latestExp.key_achievements.length > 0 && (
                        <div className="mb-5 translate-z-15">
                          <h5 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                            Key Achievements:
                          </h5>
                          <ul className="space-y-2.5 text-gray-300 text-sm leading-relaxed pl-1">
                            {latestExp.key_achievements.slice(0, 2).map((ach, aIdx) => (
                              <li key={aIdx} className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                                <span>{ach}</span>
                              </li>
                            ))}
                            {latestExp.key_achievements.length > 2 && (
                              <li className="text-xs text-gray-400 italic pl-4">
                                + {latestExp.key_achievements.length - 2} more achievements
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {latestExp.tech_stack && latestExp.tech_stack.length > 0 && (
                        <div className="border-t border-white/10 pt-4 mt-4 mb-6 translate-z-10">
                          <h5 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2.5">
                            Tech Stack
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {latestExp.tech_stack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full bg-[#181630] border border-cyan-500/30 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:border-cyan-400 transition-all duration-200"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-center translate-z-10">
                        <a 
                          href="#experience"
                          className="inline-block text-white text-sm sm:text-base font-semibold px-6 py-2.5 rounded-lg border-2 border-pink-300 bg-black/85 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_35px_rgba(236,72,153,0.8)] hover:border-pink-400 hover:translate-y-[-4px] hover:scale-105"
                        >
                          View Full Experience Journey
                        </a>
                      </div>
                    </div>
                  </Tilt3D>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LandingPage;
