import { useExperience } from '../../hooks/useExperience';

const isCurrentRole = (duration: string) => /present|current/i.test(duration);

const ExperienceSubtab = () => {
  const { experienceItems, loading } = useExperience();
  const currentCount = experienceItems.filter((exp) => isCurrentRole(exp.duration)).length;

  return (
    <div className="min-h-[calc(100vh-120px)] w-full py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Experience
          </h1>
          <p className="text-gray-400 text-base sm:text-lg mt-3 max-w-2xl">
            Where I've worked, what I built, and the tools I used to ship it.
          </p>
          {!loading && experienceItems.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs sm:text-sm">
                <span className="text-white font-semibold">{experienceItems.length}</span>
                {experienceItems.length === 1 ? 'role' : 'roles'}
              </span>
              {currentCount > 0 && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/25 text-emerald-300 text-xs sm:text-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {currentCount} current
                </span>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 animate-pulse">
                <div className="h-4 w-32 rounded bg-white/10 mb-4" />
                <div className="h-6 w-1/2 rounded bg-white/10 mb-3" />
                <div className="h-4 w-full rounded bg-white/5 mb-2" />
                <div className="h-4 w-2/3 rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : experienceItems.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#0b0d14]/80 p-8 text-center">
            <p className="text-gray-400 text-lg">No work experience entries yet.</p>
          </div>
        ) : (
          <ol className="relative">
            {/* Timeline rail */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" aria-hidden />

            {experienceItems.map((exp) => {
              const current = isCurrentRole(exp.duration);
              return (
                <li key={exp.id} className="relative pl-8 sm:pl-10 pb-8 sm:pb-10 last:pb-0">
                  {/* Timeline dot */}
                  <span className="absolute left-0 top-1.5 flex w-[15px] h-[15px] items-center justify-center" aria-hidden>
                    {current && <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400/40 animate-ping" />}
                    <span className={`relative w-[15px] h-[15px] rounded-full border-2 ${current ? 'border-emerald-400 bg-emerald-400/30' : 'border-white/30 bg-[#07080c]'}`} />
                  </span>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-3 text-xs sm:text-sm">
                    <span className="font-mono text-gray-300">{exp.duration}</span>
                    {current && (
                      <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                    {exp.job_type && <span className="text-gray-500">· {exp.job_type}</span>}
                    {exp.location && <span className="text-gray-500">· {exp.location}</span>}
                  </div>

                  {/* Card */}
                  <article className="rounded-3xl border border-white/10 bg-[#0b0d14]/80 hover:border-white/20 transition-colors p-5 sm:p-7">
                    <h2 className="text-white text-xl sm:text-2xl font-bold tracking-tight">{exp.role}</h2>
                    <p className="text-cyan-300 text-sm sm:text-base font-medium mt-1">{exp.company}</p>

                    {exp.description && (
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4">
                        {exp.description}
                      </p>
                    )}

                    {exp.key_achievements && exp.key_achievements.length > 0 && (
                      <ul className="mt-5 space-y-2.5">
                        {exp.key_achievements.map((ach, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2.5 text-sm sm:text-[15px] text-gray-400 leading-relaxed">
                            <svg className="w-4 h-4 text-emerald-400 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {exp.tech_stack && exp.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-5 pt-5 border-t border-white/10">
                        {exp.tech_stack.map((tech) => (
                          <span
                            key={tech}
                            className="font-mono text-[11px] text-gray-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                </li>
              );
            })}
          </ol>
        )}

        {/* Closing CTA */}
        {!loading && experienceItems.length > 0 && (
          <div className="mt-14 sm:mt-20 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">Want me on your team?</h2>
              <p className="text-gray-400 text-sm sm:text-base mt-2">I'm open to full-time roles and freelance work.</p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href="#contacts"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-gray-950 text-sm sm:text-base font-semibold hover:bg-gray-200 transition-colors"
              >
                Let's talk
              </a>
              <a
                href="#projects"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white text-sm sm:text-base font-semibold transition-colors"
              >
                See projects
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceSubtab;
