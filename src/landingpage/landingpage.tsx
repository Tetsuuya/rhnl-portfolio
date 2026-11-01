import { useRef, useState, useEffect, type ReactNode } from 'react';
import profilePicture from '../assets/Gemini_Generated_Image_nwsi8fnwsi8fnwsi.jpeg';
import { useFeaturedRepos } from '../hooks/useFeaturedRepos';
import { useTechStack } from '../hooks/useTechStack';
import { useExperience } from '../hooks/useExperience';
import { useGitHubContributions } from '../hooks/useGitHubContributions';
import { SITE } from '../config/site';
import { sanitizeSvg } from '../utils/sanitizeSvg';

const EMAIL = 'sajol.rhenel123@gmail.com';

// On laptops and up, each home section fills one screen (minus the nav) with its content centered
const SCREEN_SECTION = 'flex flex-col justify-center py-12 sm:py-16 lg:py-12 lg:min-h-[calc(100svh-5rem)]';

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
  const github = useGitHubContributions();

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

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-8 md:pt-12 max-w-7xl relative">
        {/* Hero (original layout) */}
        {/* Soft atmospheric ambient glow */}
        <div className="absolute top-1/4 right-10 w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] bg-radial from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-radial from-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div id="hero-content" className="flex flex-col lg:flex-row items-center justify-center lg:justify-between min-h-[calc(100svh-6rem)] lg:min-h-[calc(100vh-220px)] gap-6 sm:gap-10 lg:gap-16 xl:gap-24 mb-8 sm:mb-12 lg:mb-16">
          {/* Right Content Area (Top on mobile, Right on desktop) - Profile Picture */}
          <div className="order-first lg:order-last flex-1 flex justify-center items-center w-full mb-2 lg:mb-0">
            <div className="flex flex-col items-center">
              {/* Outer 3D square glass frame container */}
              <div className="glass-3d w-52 h-52 min-[400px]:w-60 min-[400px]:h-60 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[370px] lg:h-[370px] xl:w-[400px] xl:h-[400px] max-w-[85vw] max-h-[85vw] rounded-3xl flex items-center justify-center relative transition-all duration-300 hover:border-white/30 p-2.5 sm:p-4.5">
                {/* Inner square image wrapper with cut bevel rim */}
                <div className="w-full h-full rounded-2xl overflow-hidden border border-white/20 relative shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_0_25px_rgba(0,0,0,0.6)]">
                  <img 
                    src={profilePicture} 
                    alt="Rhenel" 
                    fetchPriority="high"
                    loading="eager"
                    decoding="sync"
                    className="w-full h-full object-cover object-center pointer-events-none relative z-10 sepia-[0.25] saturate-[0.88] contrast-[1.12] brightness-[0.96]"
                    draggable={false}
                  />
                  {/* Subtle warm film vignette and tone overlay */}
                  <div className="absolute inset-0 pointer-events-none z-20 rounded-2xl bg-radial from-transparent via-black/10 to-black/45 mix-blend-multiply" />
                  <div className="absolute inset-0 pointer-events-none z-20 rounded-2xl bg-amber-500/5 mix-blend-color" />
                </div>
              </div>

              {/* Clean minimalist FULL-STACK DEVELOPER title below avatar (Desktop only to prevent mobile duplication) */}
              <div className="hidden lg:block mt-5 sm:mt-6 text-center">
                <span className="text-white text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.25em] text-gray-200">
                  FULL-STACK DEVELOPER
                </span>
              </div>
            </div>
          </div>

          {/* Left Content Area (Below portrait on mobile, Left on desktop) */}
          <div className="order-last lg:order-first flex-1 max-w-2xl text-center lg:text-left w-full">
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-gray-300 text-base md:text-lg lg:text-xl mb-2 sm:mb-3 font-medium cursor-default">
                Hi, I'm Rhenel,
              </p>
              <h1 className="text-white text-[2rem] min-[400px]:text-[2.15rem] sm:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-5 leading-[1.18] sm:leading-[1.15] tracking-tight cursor-default">
                <span className="block whitespace-nowrap">I'M A FULL-STACK</span>
                <span className="block text-[1.7rem] sm:text-4xl lg:text-5xl text-gray-200">DEVELOPER</span>
              </h1>
              <p className="text-gray-400 text-[15px] sm:text-sm md:text-base mb-6 sm:mb-8 leading-relaxed max-w-xl cursor-default px-1 sm:px-0">
                I specialize in building modern, scalable web applications with a focus on clean code, great user experiences, and robust backend solutions. Passionate about turning ideas into reality through technology.
              </p>

              {/* Proof stats (replaces the old tech logos) */}
              <dl className="w-full max-w-md grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 mb-6 sm:mb-8">
                {[
                  { label: 'GitHub contributions', value: github.total === null ? '—' : github.total.toLocaleString() },
                  { label: 'Projects shipped', value: loading ? '—' : featuredRepos.length },
                  { label: 'Technologies', value: techLoading ? '—' : `${techItems.length}+` },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col-reverse gap-0.5 py-3.5 px-3 sm:px-4 first:pl-0 text-center lg:text-left">
                    <dt className="text-[11px] sm:text-xs text-gray-500">{stat.label}</dt>
                    <dd className="text-white text-xl sm:text-2xl font-bold tracking-tight">{stat.value}</dd>
                  </div>
                ))}
              </dl>

              {/* View My Projects Button (Matching Mockup's sleek bordered button style) */}
              <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4">
                <a 
                  href="#projects" 
                  className="glass-3d inline-flex items-center justify-center px-7 py-3 sm:px-6 sm:py-2.5 rounded-xl text-white text-base font-semibold transition-all duration-300 hover:scale-105 hover:border-white/40"
                >
                  <span className="relative z-10">View My Projects</span>
                </a>
                {/* Social links */}
                <div className="flex items-center gap-1">
                  {[
                    { label: 'Instagram', href: SITE.instagram, path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                    { label: 'GitHub', href: SITE.github, path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
                    { label: 'LinkedIn', href: SITE.linkedin, path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d={social.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Projects */}
        <div ref={workSectionRef} id="work" className={`${SCREEN_SECTION} scroll-mt-20`}>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 ${featuredRepos.length <= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
              {featuredRepos.slice(0, 6).map((repo) => (
                <article
                  key={repo.id}
                  className="group flex flex-col rounded-3xl border border-white/10 bg-[#0b0d14]/80 hover:border-white/25 hover:bg-[#0e1019] transition-all duration-300 overflow-hidden"
                >
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block m-2.5 mb-0 aspect-[16/10] rounded-2xl overflow-hidden bg-black/60 border border-white/5 relative"
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
                  </a>

                  <div className="flex flex-col flex-1 p-4">
                    <h3 className="text-white text-base sm:text-lg font-bold tracking-tight mb-1.5 line-clamp-1">
                      {repo.name}
                    </h3>

                    <p className="text-gray-400 text-[13px] leading-relaxed line-clamp-2 mb-3">
                      {repo.description}
                    </p>

                    {repo.techStack && repo.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {repo.techStack.slice(0, 3).map((tech) => (
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
                        className="inline-flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-lg bg-white text-gray-950 text-[13px] font-semibold hover:bg-gray-200 transition-colors"
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
                          className="inline-flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-lg border border-white/15 text-gray-200 text-[13px] font-semibold hover:bg-white/5 hover:border-white/30 transition-colors"
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
        <div className={SCREEN_SECTION}>
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
                  <div className="md:col-span-5 flex flex-col gap-1.5 sm:gap-2">
                    {experienceItems.map((exp) => {
                      const isSelected = activeExp?.id === exp.id;
                      return (
                        <button
                          key={exp.id}
                          type="button"
                          onClick={() => setSelectedExpId(exp.id)}
                          className={`shrink-0 text-left rounded-2xl px-4 py-3 sm:px-5 sm:py-4 border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-white/[0.06] border-white/15'
                              : 'border-transparent hover:bg-white/[0.03]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isSelected ? 'bg-cyan-300' : 'bg-gray-600'}`} />
                            <h3 className={`text-sm sm:text-base font-semibold tracking-tight ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                              {exp.role}
                            </h3>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1 pl-3.5">
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
        <div className={SCREEN_SECTION}>
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
                                dangerouslySetInnerHTML={{ __html: sanitizeSvg(tech.icon) }}
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
        className="relative w-full overflow-hidden bg-[#07080c] py-14 sm:py-24 md:py-32 min-h-[500px] sm:min-h-[560px] lg:min-h-[calc(100svh-5rem)] flex flex-col justify-center"
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
