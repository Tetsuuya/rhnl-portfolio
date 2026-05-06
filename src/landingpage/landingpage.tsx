import profilePicture from '../assets/profilepicutre.png';
import { useFeaturedRepos } from '../hooks/useFeaturedRepos';

const LandingPage = () => {
  const { featuredRepos, loading } = useFeaturedRepos();

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
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-120px)] gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16">
          {/* Left Content Area */}
          <div className="flex-1 max-w-2xl text-center lg:text-left w-full">
            <p className="text-white text-base sm:text-lg md:text-xl mb-3 sm:mb-4 transition-all duration-300 hover:translate-y-[-8px] hover:translate-x-2 hover:shadow-[0_10px_30px_rgba(255,255,255,0.4)] hover:scale-105 cursor-default">Hi, I'm Rhenel,</p>
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-bold mb-4 sm:mb-6 leading-tight transition-all duration-300 hover:translate-y-[-10px] hover:translate-x-2 hover:shadow-[0_15px_40px_rgba(255,255,255,0.5)] hover:scale-[1.02] cursor-default">
              <span className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl whitespace-nowrap">I'M A FULL-STACK</span>
              <br />
              <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">DEVELOPER</span>
            </h1>
            <p className="text-white text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed transition-all duration-300 hover:translate-y-[-8px] hover:translate-x-2 hover:shadow-[0_10px_30px_rgba(255,255,255,0.4)] hover:scale-105 cursor-default px-2 sm:px-0">
              I specialize in building modern, scalable web applications with a focus on clean code, great user experiences, and robust backend solutions. Passionate about turning ideas into reality through technology.
            </p>
            <a 
              href="#projects" 
              className="inline-block text-white text-sm sm:text-base md:text-lg font-medium relative pb-1 group px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-300 hover:shadow-[0_10px_30px_rgba(6,182,212,0.9)] hover:bg-cyan-500/10 hover:translate-y-[-8px] hover:translate-x-2 hover:scale-105"
              style={{ color: 'white' }}
            >
              View My Projects
              <span className="absolute bottom-0 left-[-8px] right-[-8px] h-[2px] bg-cyan-400 group-hover:shadow-[0_0_10px_rgba(6,182,212,1)]"></span>
            </a>
          </div>

          {/* Right Content Area - Profile Picture */}
          <div className="flex-1 flex justify-center items-center w-full">
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] xl:w-[550px] xl:h-[550px] rounded-full border-2 border-white mb-4 sm:mb-6 overflow-visible relative flex items-center justify-center transition-all duration-300 hover:shadow-[0_15px_50px_rgba(255,255,255,0.6)] hover:border-white/80 hover:scale-110 hover:translate-y-[-10px]">
                <img 
                  src={profilePicture} 
                  alt="Rhenel" 
                  className="w-full h-full rounded-full object-contain"
                  style={{
                    objectPosition: 'center center'
                  }}
                />
                <div className="absolute bottom-[-15px] sm:bottom-[-20px] left-1/2 transform -translate-x-1/2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 border-2 border-pink-300 rounded-lg bg-black/80 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_35px_rgba(236,72,153,0.9)] hover:border-pink-400 hover:translate-y-[-8px] hover:scale-110">
                  <span className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold uppercase tracking-wide whitespace-nowrap">
                    FULL-STACK DEVELOPER
                  </span>
                </div>
              </div>
            </div>
          </div>
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
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col bg-black/40 border-2 border-white/20 rounded-lg overflow-hidden transition-all duration-300 hover:border-pink-300 hover:shadow-[0_10px_35px_rgba(236,72,153,0.6)] hover:translate-y-[-8px] hover:scale-105 backdrop-blur-sm"
                  >
                    {repo.image && (
                      <div className="h-48 sm:h-40 md:h-48 overflow-hidden bg-black/60">
                        <img
                          src={repo.image}
                          alt={repo.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                      <h3 className="text-white text-lg sm:text-xl font-bold mb-2 hover:text-pink-300 transition-colors">
                        {repo.name}
                      </h3>
                      {repo.description && (
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2 flex-1">
                          {repo.description}
                        </p>
                      )}
                      {renderTechStack(repo.techStack)}
                      <div className="flex items-center gap-4 text-sm text-gray-400">
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
                ))}
              </div>
              <div className="flex justify-center mt-8 sm:mt-10 md:mt-12">
                <a 
                  href="#projects" 
                  className="inline-block text-white text-sm sm:text-base md:text-lg font-medium px-6 sm:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg border-2 border-pink-300 bg-black/80 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_10px_35px_rgba(236,72,153,0.9)] hover:border-pink-400 hover:translate-y-[-8px] hover:scale-105"
                  style={{ color: 'white' }}
                >
                  View More
                </a>
              </div>
            </>
          )}
        </div>

        {/* Specialized Skills Section */}
        <div className="mt-12 sm:mt-16 md:mt-24 mb-12 sm:mb-16">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-center px-4">
            Specialized Skills
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-center mb-8 sm:mb-10 md:mb-12 text-gray-300 px-4">
            I specialize in backend development and database management
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 md:gap-8">
            {/* Backend Skills */}
            <div className="bg-black/40 border-2 border-white/20 rounded-lg p-4 sm:p-5 md:p-6 backdrop-blur-sm transition-all duration-300 hover:border-pink-300 hover:shadow-[0_10px_35px_rgba(236,72,153,0.6)] hover:translate-y-[-8px] hover:scale-105">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-pink-300">
                Backend
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs sm:text-sm transition-all duration-300 hover:bg-pink-500/20 hover:border-pink-300 hover:scale-105">
                  Django
                </span>
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs sm:text-sm transition-all duration-300 hover:bg-pink-500/20 hover:border-pink-300 hover:scale-105">
                  Flask
                </span>
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs sm:text-sm transition-all duration-300 hover:bg-pink-500/20 hover:border-pink-300 hover:scale-105">
                  FastAPI
                </span>
              </div>
            </div>

            {/* Database & Backend Services */}
            <div className="bg-black/40 border-2 border-white/20 rounded-lg p-4 sm:p-5 md:p-6 backdrop-blur-sm transition-all duration-300 hover:border-pink-300 hover:shadow-[0_10px_35px_rgba(236,72,153,0.6)] hover:translate-y-[-8px] hover:scale-105">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-pink-300">
                Database & Backend Services
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs sm:text-sm transition-all duration-300 hover:bg-pink-500/20 hover:border-pink-300 hover:scale-105">
                  Supabase (Auth, Database, Storage)
                </span>
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs sm:text-sm transition-all duration-300 hover:bg-pink-500/20 hover:border-pink-300 hover:scale-105">
                  Firebase (Auth, Firestore, Realtime Database)
                </span>
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs sm:text-sm transition-all duration-300 hover:bg-pink-500/20 hover:border-pink-300 hover:scale-105">
                  PostgreSQL
                </span>
                <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white text-xs sm:text-sm transition-all duration-300 hover:bg-pink-500/20 hover:border-pink-300 hover:scale-105">
                  MySQL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;

