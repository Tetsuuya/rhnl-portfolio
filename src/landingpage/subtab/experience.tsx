import { useExperience } from '../../hooks/useExperience';

const ExperienceSubtab = () => {
  const { experienceItems, loading } = useExperience();

  return (
    <div className="min-h-[calc(100vh-120px)] w-full py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl">
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
                      <div className="bg-black/40 border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 hover:border-pink-300 hover:shadow-[0_10px_35px_rgba(236,72,153,0.6)] hover:translate-y-[-6px] hover:scale-[1.02]">
                        <span className="inline-block px-3 py-1 bg-pink-950/45 border border-pink-700/40 text-[11px] font-bold text-pink-300 rounded-full mb-3">
                          {exp.duration}
                        </span>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {exp.role}
                        </h3>
                        <h4 className="text-sm font-semibold text-cyan-300 mb-4">
                          {exp.company}
                        </h4>
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                          {exp.description}
                        </p>
                      </div>
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
