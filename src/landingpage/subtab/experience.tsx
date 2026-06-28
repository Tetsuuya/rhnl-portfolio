import { useExperience } from '../../hooks/useExperience';
import Tilt3D from '../../components/Tilt3D';

const ExperienceSubtab = () => {
  const { experienceItems, loading } = useExperience();

  return (
    <div className="min-h-[calc(100vh-120px)] w-full py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center">
          Work Experience
        </h2>
        <p className="text-base sm:text-lg text-center mb-12 text-gray-300">
          My professional journey and developer history.
        </p>

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-transparent border-t-pink-400 border-pink-400/20 rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm">Loading experience items...</p>
          </div>
        ) : experienceItems.length === 0 ? (
          <div className="bg-black/40 border-2 border-white/20 rounded-xl p-8 text-center backdrop-blur-sm">
            <p className="text-gray-400 text-lg">No work experience entries in the database yet.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2 hidden sm:block"></div>
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10 sm:hidden"></div>

            <div className="space-y-8 sm:space-y-12">
              {experienceItems.map((exp, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={exp.id} className={`relative flex flex-col sm:flex-row items-start sm:items-center ${isEven ? 'sm:flex-row-reverse' : ''}`}>
                    {/* Timeline circle node */}
                    <div className="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full border-2 border-pink-400 bg-neutral-900 -translate-x-1/2 z-10 transition-all duration-300 hover:scale-150 hover:shadow-[0_0_10px_rgba(236,72,153,1)] hidden sm:block"></div>
                    <div className="absolute left-8 w-4 h-4 rounded-full border-2 border-pink-400 bg-neutral-900 -translate-x-1/2 z-10 sm:hidden"></div>

                    {/* Card Content wrapper */}
                    <div className="w-full sm:w-[calc(50%-2rem)] ml-12 sm:ml-0">
                      <Tilt3D className="rounded-xl">
                        <div className="bg-black/40 border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 hover:border-pink-300/70 preserve-3d">
                          <div className="flex flex-wrap items-center gap-2 mb-3 translate-z-10">
                            <span className="inline-block px-3 py-1 bg-pink-950/45 border border-pink-700/40 text-[11px] font-bold text-pink-300 rounded-full">
                              {exp.duration}
                            </span>
                            {exp.location && (
                              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {exp.location}
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-1 translate-z-30">
                            {exp.role}
                          </h3>
                          <h4 className="text-sm font-semibold text-cyan-300 mb-4 translate-z-20">
                            {exp.company}{exp.job_type && ` · ${exp.job_type}`}
                          </h4>

                          {exp.description && (
                            <div className="bg-[#100e26]/60 border border-white/5 rounded-lg p-4 mb-4 text-gray-300 text-sm leading-relaxed translate-z-10">
                              {exp.description}
                            </div>
                          )}

                          {exp.key_achievements && exp.key_achievements.length > 0 && (
                            <div className="mb-5 translate-z-15">
                              <h5 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                Key Achievements:
                              </h5>
                              <ul className="space-y-2.5 text-gray-300 text-sm leading-relaxed pl-1">
                                {exp.key_achievements.map((ach, aIdx) => (
                                  <li key={aIdx} className="flex items-start gap-2.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                                    <span>{ach}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {exp.tech_stack && exp.tech_stack.length > 0 && (
                            <div className="border-t border-white/10 pt-4 mt-4 translate-z-10">
                              <h5 className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2.5">
                                Tech Stack
                              </h5>
                              <div className="flex flex-wrap gap-1.5">
                                {exp.tech_stack.map((tech) => (
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
                        </div>
                      </Tilt3D>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceSubtab;

