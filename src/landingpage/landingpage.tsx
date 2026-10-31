import { useRef, useState, useEffect, type ReactNode } from 'react';
import profilePicture from '../assets/Gemini_Generated_Image_nwsi8fnwsi8fnwsi.jpeg';
import { useFeaturedRepos } from '../hooks/useFeaturedRepos';
import { useTechStack } from '../hooks/useTechStack';
import { useExperience } from '../hooks/useExperience';

const EMAIL = 'sajol.rhenel123@gmail.com';

const categoryLabels: Record<string, string> = {
  Language: 'Languages',
  Framework: 'Frameworks',
  Database: 'Databases',
  'DevOps & Cloud Platforms': 'DevOps & Cloud',
  Tool: 'Tools',
  Design: 'Design',
};

// Consistent numbered header used by every landing section
const SectionHeader = ({ index, eyebrow, title, subtitle, action }: {
  index: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
    <div>
      <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-cyan-300/90 mb-3">
        <span className="text-gray-500">{index} /</span> {eyebrow}
      </p>
      <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
        {title}
      </h2>
      <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-xl">
        {subtitle}
      </p>
    </div>
    {action}
  </div>
);

const LandingPage = () => {
  const { featuredRepos, loading } = useFeaturedRepos();
  const { techItems, loading: techLoading } = useTechStack();
  const { experienceItems, loading: expLoading } = useExperience();
  const [selectedExpId, setSelectedExpId] = useState<number | null>(null);
  const [emailCopied, setEmailCopied] = useState<boolean>(false);

  // Scroll-Linked Curtain Fill State (Direct DOM manipulation for 0 React re-renders on scroll)
  const buildSectionRef = useRef<HTMLElement>(null);
  const curtainLayerRef = useRef<HTMLDivElement>(null);
  const curtainBeamRef = useRef<HTMLDivElement>(null);
  const workSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (buildSectionRef.current && curtainLayerRef.current && curtainBeamRef.current) {
            const rect = buildSectionRef.current.getBoundingClientRect();
            const vh = window.innerHeight;
            // Curtain starts filling from bottom when section top touches vh * 0.95
            // Reaches full 100% coverage when comfortably in view at vh * 0.25
            const start = vh * 0.95;
            const end = vh * 0.25;
            const rawProgress = (start - rect.top) / (start - end);
            const progress = Math.min(Math.max(rawProgress, 0), 1);

            const insetVal = (1 - progress) * 100;
            curtainLayerRef.current.style.clipPath = `inset(${insetVal}% 0 0 0)`;
            curtainBeamRef.current.style.top = `${insetVal}%`;
            curtainBeamRef.current.style.opacity = progress > 0.02 && progress < 0.98 ? '1' : '0';
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2500);
  };

  // Hash links switch views in this app, so in-page jumps scroll directly
  const scrollToWork = () => {
    workSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-8 md:pt-12 pb-6 sm:pb-12 max-w-7xl relative">
        {/* Hero */}
        <section id="hero-content" className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-14 lg:min-h-[min(calc(100vh-200px),720px)]">
          {/* Copy */}
          <div className="lg:col-span-7 order-last lg:order-first text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/25 text-emerald-300 text-xs sm:text-sm font-medium mb-6">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
              </span>
              Open to full-time roles &amp; freelance work
            </div>

            <p className="text-gray-300 text-base sm:text-lg font-medium mb-3">
              Hi, I'm <span className="text-white font-semibold">Rhenel Jhon Sajol</span> — Full-Stack Developer
            </p>

            <h1 className="text-white text-[2.1rem] leading-[1.08] xs:text-4xl sm:text-5xl md:text-6xl xl:text-[4.25rem] font-extrabold tracking-tight mb-5 sm:mb-6">
              I build fast, production-ready web apps{' '}
              <span className="text-gray-500">from database to UI.</span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              I ship real products end-to-end with React, Next.js, TypeScript, Django, FastAPI and Supabase —
              clean code, secure backends, and interfaces people enjoy using.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 mb-10">
              <button
                type="button"
                onClick={scrollToWork}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-950 text-sm sm:text-base font-semibold hover:bg-gray-200 transition-colors shadow-[0_8px_30px_rgba(255,255,255,0.12)] cursor-pointer group"
              >
                View my work
                <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              <a
                href="#contacts"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white text-sm sm:text-base font-semibold transition-colors"
              >
                Let's talk
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-gray-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                title="Copy email to clipboard"
              >
                {emailCopied ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Email copied
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy email
                  </>
                )}
              </button>
            </div>

            {/* Quick proof stats */}
            <dl className="grid grid-cols-3 max-w-lg mx-auto lg:mx-0 divide-x divide-white/10 border-y border-white/10 py-4">
              <div className="px-2 sm:px-4 first:pl-0 flex flex-col-reverse text-center lg:text-left">
                <dt className="text-[11px] sm:text-xs text-gray-500">Live projects</dt>
                <dd className="text-white text-2xl sm:text-3xl font-bold tracking-tight">{loading ? '—' : featuredRepos.length}</dd>
              </div>
              <div className="px-2 sm:px-4 flex flex-col-reverse text-center lg:text-left">
                <dt className="text-[11px] sm:text-xs text-gray-500">Technologies</dt>
                <dd className="text-white text-2xl sm:text-3xl font-bold tracking-tight">{techLoading ? '—' : `${techItems.length}+`}</dd>
              </div>
              <div className="px-2 sm:px-4 flex flex-col-reverse text-center lg:text-left">
                <dt className="text-[11px] sm:text-xs text-gray-500">Based in</dt>
                <dd className="text-white text-base sm:text-lg font-bold tracking-tight leading-[2.25rem]">CDO, PH</dd>
              </div>
            </dl>
          </div>

          {/* Portrait */}
          <div className="lg:col-span-5 order-first lg:order-last flex justify-center lg:justify-end">
            <div className="relative w-56 xs:w-64 sm:w-72 md:w-80 lg:w-full lg:max-w-[400px]">
              <div className="absolute -inset-6 bg-radial from-cyan-500/20 via-blue-500/5 to-transparent blur-2xl pointer-events-none -z-10" />
              <div className="glass-3d aspect-[4/5] rounded-3xl p-2.5 sm:p-3">
                <div className="w-full h-full rounded-2xl overflow-hidden border border-white/15 relative">
                  <img
                    src={profilePicture}
                    alt="Rhenel Jhon Sajol"
                    fetchPriority="high"
                    loading="eager"
                    decoding="sync"
                    className="w-full h-full object-cover object-center pointer-events-none relative z-10 saturate-[0.9] contrast-[1.08]"
                    draggable={false}
                  />
                  <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
              </div>

              {/* Name card overlapping the portrait */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 lg:left-auto lg:-left-8 lg:translate-x-0 z-30 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0c0e16]/90 border border-white/15 backdrop-blur-md shadow-2xl whitespace-nowrap">
                <span className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg className="w-4.5 h-4.5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </span>
                <div className="text-left">
                  <p className="text-white text-sm font-semibold leading-tight">Full-Stack Developer</p>
                  <p className="text-gray-400 text-xs">CS @ USTP · Remote-ready</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <div ref={workSectionRef} id="work" className="pt-20 sm:pt-28 scroll-mt-20 content-auto">
          <SectionHeader
            index="01"
            eyebrow="Selected work"
            title="Featured projects"
            subtitle="Full-stack products I've designed, built and deployed — all live and clickable."
            action={
              <a
                href="#projects"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-300 hover:text-white transition-colors group shrink-0"
              >
                All projects
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            }
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 animate-pulse">
                  <div className="aspect-[16/9] rounded-2xl bg-white/5 mb-4" />
                  <div className="h-5 w-1/3 rounded bg-white/10 mb-3" />
                  <div className="h-4 w-full rounded bg-white/5 mb-2" />
                  <div className="h-4 w-2/3 rounded bg-white/5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {featuredRepos.map((repo, i) => (
                <article
                  key={repo.id}
                  className="group flex flex-col rounded-3xl border border-white/10 bg-[#0b0d14]/80 hover:border-white/25 hover:bg-[#0e1019] transition-all duration-300 overflow-hidden"
                >
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block m-3 mb-0 aspect-[16/9] rounded-2xl overflow-hidden bg-black/60 border border-white/5 relative"
                    aria-label={`Open ${repo.name} live demo`}
                  >
                    {repo.image ? (
                      <img
                        src={repo.image}
                        alt={`${repo.name} screenshot`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        style={{ objectPosition: repo.image_position || 'center top' }}
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 font-mono text-[11px] px-2 py-1 rounded-md bg-black/60 border border-white/10 text-gray-300 backdrop-blur-sm">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </a>

                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-white text-lg sm:text-xl font-bold tracking-tight">
                        {repo.name}
                      </h3>
                      <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Live
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                      {repo.description}
                    </p>

                    {repo.techStack && repo.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {repo.techStack.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="font-mono text-[11px] text-gray-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto flex items-center gap-2.5">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-gray-950 text-sm font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Live demo
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H8M17 7v9" />
                        </svg>
                      </a>
                      {repo.repo_url && (
                        <a
                          href={repo.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/15 text-gray-200 text-sm font-semibold hover:bg-white/5 hover:border-white/30 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                          </svg>
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Work Experience - Interactive split */}
        <div className="pt-20 sm:pt-28 content-auto">
          <SectionHeader
            index="02"
            eyebrow="Experience"
            title="Where I've been building"
            subtitle="Roles, responsibilities and what I delivered."
            action={
              <a
                href="#experience"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-300 hover:text-white transition-colors group shrink-0"
              >
                Full timeline
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            }
          />

          {expLoading ? (
            <div className="flex flex-col items-center py-16 gap-4">
              <div className="w-9 h-9 border-2 border-transparent border-t-white border-white/20 rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">Loading experience...</p>
            </div>
          ) : experienceItems.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No work experience entries found.</p>
          ) : (
            (() => {
              const activeExp = experienceItems.find((e) => e.id === selectedExpId) || experienceItems[0];

              return (
                <div className="relative rounded-3xl bg-[#0b0d14]/80 border border-white/10 p-3 sm:p-4 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
                  {/* Role list */}
                  <div className="md:col-span-5 flex md:flex-col gap-2 overflow-x-auto no-scrollbar">
                    {experienceItems.map((exp) => {
                      const isSelected = activeExp?.id === exp.id;
                      return (
                        <button
                          key={exp.id}
                          type="button"
                          onClick={() => setSelectedExpId(exp.id)}
                          className={`shrink-0 text-left rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-white/[0.06] border-white/15'
                              : 'border-transparent hover:bg-white/[0.03]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isSelected ? 'bg-cyan-300' : 'bg-gray-600'}`} />
                            <h3 className={`text-sm sm:text-base font-semibold tracking-tight whitespace-nowrap md:whitespace-normal ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                              {exp.role}
                            </h3>
                          </div>
                          <p className="hidden md:block text-xs sm:text-sm text-gray-500 mt-1 pl-3.5">
                            {exp.company} · <span className="font-mono">{exp.duration}</span>
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Detail */}
                  {activeExp && (
                    <div key={activeExp.id} className="md:col-span-7 rounded-2xl bg-[#10121b] border border-white/10 p-5 sm:p-7 animate-modal-fade-in">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                        <div>
                          <h4 className="text-white text-lg sm:text-xl font-bold tracking-tight">{activeExp.role}</h4>
                          <p className="text-cyan-300/90 text-sm font-medium">{activeExp.company}</p>
                        </div>
                        <span className="font-mono text-[11px] sm:text-xs text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                          {activeExp.duration}
                        </span>
                      </div>

                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        {activeExp.description}
                      </p>

                      {activeExp.key_achievements && activeExp.key_achievements.length > 0 && (
                        <ul className="mt-5 space-y-2.5">
                          {activeExp.key_achievements.slice(0, 3).map((ach, aIdx) => (
                            <li key={aIdx} className="flex items-start gap-2.5 text-sm text-gray-400 leading-relaxed">
                              <svg className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {activeExp.tech_stack && activeExp.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-5 pt-5 border-t border-white/10">
                          {activeExp.tech_stack.map((tech) => (
                            <span
                              key={tech}
                              className="font-mono text-[11px] text-gray-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </div>

        {/* Tech Stack */}
        <div className="pt-20 sm:pt-28 pb-8 content-auto">
          <SectionHeader
            index="03"
            eyebrow="Toolkit"
            title="Tech stack"
            subtitle="The languages, frameworks and platforms I reach for to ship."
          />

          {techLoading ? (
            <div className="flex flex-col items-center py-12 gap-4">
              <div className="w-9 h-9 border-2 border-transparent border-t-white border-white/20 rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">Loading tech stack...</p>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-[#0b0d14]/80 divide-y divide-white/10">
              {Object.keys(categoryLabels).map((category) => {
                const items = techItems.filter((t) => t.category === category);
                if (items.length === 0) return null;

                return (
                  <div key={category} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 p-5 sm:p-6">
                    <h3 className="md:col-span-3 flex items-center gap-2 text-sm font-semibold text-white">
                      {categoryLabels[category]}
                      <span className="font-mono text-[11px] text-gray-500">{items.length}</span>
                    </h3>
                    <div className="md:col-span-9 flex flex-wrap gap-2">
                      {items.map((tech) => (
                        <div
                          key={tech.id}
                          className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/25 px-2.5 py-1.5 transition-colors"
                        >
                          <div className="w-4.5 h-4.5 shrink-0 text-white flex items-center justify-center">
                            {tech.icon.trim().toLowerCase().startsWith('<svg') ? (
                              <div
                                className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                                dangerouslySetInnerHTML={{ __html: tech.icon }}
                              />
                            ) : (
                              <img src={tech.icon} alt="" className="w-full h-full object-contain" />
                            )}
                          </div>
                          <span className="text-gray-200 text-xs sm:text-[13px] font-medium">{tech.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Scroll-Linked Curtain Fill Section */}
      <section 
        ref={buildSectionRef} 
        className="relative w-full overflow-hidden bg-[#07080c] py-14 sm:py-24 md:py-32 min-h-[500px] sm:min-h-[560px] content-auto"
      >
        {/* ======================================================== */}
        {/* LAYER 1 (Base): Dark Theme Content                      */}
        {/* ======================================================== */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl relative z-0 text-center">
          {/* Availability Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs sm:text-sm font-semibold text-gray-300 mb-5 sm:mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open to full-time roles &amp; freelance work</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-5 sm:mb-6 leading-[1.2] sm:leading-[1.18]">
            <span className="block pb-1">Let's build something</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-500 pb-2">
              exceptional together.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed font-normal px-2">
            Have a project in mind, need a full-stack platform, or want to collaborate on real-time web systems? Let's turn your vision into code.
          </p>

          {/* Email Showcase Box with Copy Button */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 bg-white/5 rounded-2xl sm:rounded-full border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)] max-w-xl mx-auto mb-6 sm:mb-8 backdrop-blur-md w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-mono text-xs sm:text-base md:text-lg font-bold text-white select-all tracking-tight break-all sm:break-normal">
                sajol.rhenel123@gmail.com
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl sm:rounded-full bg-white text-gray-900 hover:bg-gray-100 text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer shrink-0"
              title="Copy email to clipboard"
            >
              {emailCopied ? (
                <>
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>

          {/* Direct CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto w-full">
            <a
              href="mailto:sajol.rhenel123@gmail.com"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-gray-900 hover:bg-gray-100 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Send an Email</span>
              <span className="text-gray-600">↗</span>
            </a>
            <a
              href="#contacts"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Open Contact Form</span>
              <span className="text-gray-400">→</span>
            </a>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ======================================================== */}
        {/* LAYER 2 (Overlay): Rising Muted Curtain                  */}
        {/* Soft, non-dazzling titanium tone comfortable on eyes     */}
        {/* ======================================================== */}
        <div 
          ref={curtainLayerRef}
          className="absolute inset-0 bg-gradient-to-b from-[#d8dce6] via-[#cbd2de] to-[#c2c8d5] z-10 flex flex-col justify-center overflow-hidden py-14 sm:py-24 md:py-32 pointer-events-auto will-change-[clip-path]"
          style={{
            clipPath: 'inset(100% 0 0 0)',
          }}
        >
          {/* Subtle Architectural Dot Grid Pattern on Canvas */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `radial-gradient(#00000020 1.5px, transparent 1.5px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Soft, Non-Glaring Ambient Radial Highlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-white/20 rounded-full blur-3xl pointer-events-none" />

          {/* Light Theme Content */}
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl relative z-10 text-center">
            {/* Availability Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.06] border border-black/10 text-xs sm:text-sm font-semibold text-gray-800 mb-5 sm:mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Open to full-time roles &amp; freelance work</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#0a0c16] mb-5 sm:mb-6 leading-[1.2] sm:leading-[1.18]">
              <span className="block pb-1">Let's build something</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-950 via-gray-800 to-gray-600 pb-2">
                exceptional together.
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-gray-700 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed font-normal px-2">
              Have a project in mind, need a full-stack platform, or want to collaborate on real-time web systems? Let's turn your vision into code.
            </p>

            {/* Email Showcase Box with Copy Button */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 bg-white/85 rounded-2xl sm:rounded-full border border-gray-400/40 shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.12)] transition-all duration-300 max-w-xl mx-auto mb-6 sm:mb-8 w-full sm:w-auto backdrop-blur-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-mono text-xs sm:text-base md:text-lg font-bold text-gray-950 select-all tracking-tight break-all sm:break-normal">
                  sajol.rhenel123@gmail.com
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl sm:rounded-full bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer shrink-0"
                title="Copy email to clipboard"
              >
                {emailCopied ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto w-full">
              <a
                href="mailto:sajol.rhenel123@gmail.com"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Send an Email</span>
                <span className="text-gray-400">↗</span>
              </a>
              <a
                href="#contacts"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/90 hover:bg-white border border-gray-400/50 text-gray-800 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Open Contact Form</span>
                <span className="text-gray-600">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Luminous Leading Edge Beam on the Rising Curtain */}
        <div 
          ref={curtainBeamRef}
          className="absolute inset-x-0 z-20 pointer-events-none transition-opacity duration-150 will-change-[top,opacity]"
          style={{
            top: '100%',
            opacity: 0,
            transform: 'translateY(-50%)',
          }}
        >
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.9)]" />
        </div>
      </section>
    </>
  );
};

export default LandingPage;
