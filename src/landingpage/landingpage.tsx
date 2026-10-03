import { useRef, useState, useEffect } from 'react';
import profilePicture from '../assets/Gemini_Generated_Image_nwsi8fnwsi8fnwsi.jpeg';
import awsLogo from '../assets/tech-logos/amazonwebservices.svg';
import k8sLogo from '../assets/tech-logos/kubernetes.svg';
import goLogo from '../assets/tech-logos/go.svg';
import rustLogo from '../assets/tech-logos/rust.svg';
import reactLogo from '../assets/tech-logos/react.svg';
import postgresLogo from '../assets/tech-logos/postgresql.svg';
import tfLogo from '../assets/tech-logos/tensorflow.svg';
import pytorchLogo from '../assets/tech-logos/pytorch.svg';
import huggingfaceLogo from '../assets/tech-logos/huggingface.svg';
import langchainLogo from '../assets/tech-logos/langchain.svg';
import vectordbLogo from '../assets/tech-logos/vectordb.svg';
import { useFeaturedRepos } from '../hooks/useFeaturedRepos';
import { useTechStack } from '../hooks/useTechStack';
import { useExperience } from '../hooks/useExperience';

const LandingPage = () => {
  const { featuredRepos, loading } = useFeaturedRepos();
  const { techItems, loading: techLoading } = useTechStack();
  const { experienceItems, loading: expLoading } = useExperience();
  const [selectedExpId, setSelectedExpId] = useState<number | null>(null);
  const [emailCopied, setEmailCopied] = useState<boolean>(false);

  // Scroll-Linked Curtain Fill State
  const buildSectionRef = useRef<HTMLElement>(null);
  const [curtainProgress, setCurtainProgress] = useState<number>(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (buildSectionRef.current) {
            const rect = buildSectionRef.current.getBoundingClientRect();
            const vh = window.innerHeight;
            // Curtain starts filling from bottom when section top touches vh * 0.95
            // Reaches full 100% coverage when comfortably in view at vh * 0.25
            const start = vh * 0.95;
            const end = vh * 0.25;
            const rawProgress = (start - rect.top) / (start - end);
            const progress = Math.min(Math.max(rawProgress, 0), 1);
            setCurtainProgress(progress);
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
    navigator.clipboard.writeText('sajol.rhenel123@gmail.com');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2500);
  };

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section Container with subtle dark ambient glow matching mockup */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-10 pb-8 sm:pb-12 md:pb-16 max-w-7xl relative">
        {/* Soft atmospheric ambient glow */}
        <div className="absolute top-1/4 right-10 w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] bg-radial from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-radial from-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div id="hero-content" className="flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-220px)] gap-10 sm:gap-12 lg:gap-16 xl:gap-24 mb-12 sm:mb-16">
          {/* Left Content Area - Grounded & Stable without motion wobble */}
          <div className="flex-1 max-w-2xl text-center lg:text-left w-full">
            <div className="flex flex-col items-center lg:items-start">
              <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3 font-medium cursor-default">
                Hi, I'm Rhenel,
              </p>
              <h1 className="text-white text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-5 leading-[1.18] sm:leading-[1.15] tracking-tight cursor-default">
                <span className="block break-words sm:whitespace-nowrap">I'M A FULL-STACK</span>
                <span className="block text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-200">DEVELOPER</span>
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 leading-relaxed max-w-xl cursor-default px-1 sm:px-0">
                I specialize in building modern, scalable web applications with a focus on clean code, great user experiences, and robust backend solutions. Passionate about turning ideas into reality through technology.
              </p>

              {/* Technologies & Tools Stack Showcase (Matching Mockup) */}
              <div className="w-full flex flex-col items-center lg:items-start gap-4 mb-6">
                {/* Row 1: Brand Technology Logos */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 md:gap-7 py-1">
                  {/* AWS */}
                  <div className="flex items-center justify-center h-7 sm:h-8 transition-transform duration-300 hover:scale-110" title="AWS">
                    <img src={awsLogo} alt="AWS" className="h-5 sm:h-6 md:h-7 w-auto object-contain" />
                  </div>
                  {/* Kubernetes */}
                  <div className="flex items-center justify-center h-7 sm:h-8 transition-transform duration-300 hover:scale-110" title="Kubernetes">
                    <img src={k8sLogo} alt="Kubernetes" className="h-6 sm:h-7 md:h-8 w-6 sm:w-7 md:w-8 object-contain" />
                  </div>
                  {/* Go */}
                  <div className="flex items-center justify-center h-7 sm:h-8 transition-transform duration-300 hover:scale-110" title="Go (Golang)">
                    <img src={goLogo} alt="Go" className="h-5 sm:h-6 md:h-7 w-auto object-contain" />
                  </div>
                  {/* Rust */}
                  <div className="flex items-center justify-center h-7 sm:h-8 transition-transform duration-300 hover:scale-110" title="Rust">
                    <img src={rustLogo} alt="Rust" className="h-6 sm:h-7 md:h-8 w-6 sm:w-7 md:w-8 object-contain" />
                  </div>
                  {/* React */}
                  <div className="flex items-center justify-center h-7 sm:h-8 transition-transform duration-300 hover:scale-110" title="React">
                    <img src={reactLogo} alt="React" className="h-6 sm:h-7 md:h-8 w-6 sm:w-7 md:w-8 object-contain" />
                  </div>
                  {/* PostgreSQL */}
                  <div className="flex items-center justify-center h-7 sm:h-8 transition-transform duration-300 hover:scale-110" title="PostgreSQL">
                    <img src={postgresLogo} alt="PostgreSQL" className="h-6 sm:h-7 md:h-8 w-6 sm:w-7 md:w-8 object-contain" />
                  </div>
                </div>

                {/* Row 2: 5 Modern 3D Glass Tech Cards */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-2.5 md:gap-3">
                  {/* TensorFlow */}
                  <div className="glass-3d flex flex-col items-center justify-center w-[66px] xs:w-[74px] sm:w-[82px] h-[64px] xs:h-[72px] sm:h-[78px] rounded-xl hover:border-amber-400/50 transition-all duration-300 group">
                    <img src={tfLogo} alt="TensorFlow" className="relative z-10 w-5 xs:w-6 h-5 xs:h-6 mb-1 object-contain" />
                    <span className="relative z-10 text-[9px] xs:text-[10px] sm:text-[11px] text-gray-200 font-medium tracking-tight">TensorFlow</span>
                  </div>

                  {/* PyTorch */}
                  <div className="glass-3d flex flex-col items-center justify-center w-[66px] xs:w-[74px] sm:w-[82px] h-[64px] xs:h-[72px] sm:h-[78px] rounded-xl hover:border-red-400/50 transition-all duration-300 group">
                    <img src={pytorchLogo} alt="PyTorch" className="relative z-10 w-5 xs:w-6 h-5 xs:h-6 mb-1 object-contain" />
                    <span className="relative z-10 text-[9px] xs:text-[10px] sm:text-[11px] text-gray-200 font-medium tracking-tight">PyTorch</span>
                  </div>

                  {/* Hugging Face */}
                  <div className="glass-3d flex flex-col items-center justify-center w-[66px] xs:w-[74px] sm:w-[82px] h-[64px] xs:h-[72px] sm:h-[78px] rounded-xl hover:border-yellow-400/50 transition-all duration-300 group">
                    <img src={huggingfaceLogo} alt="Hugging Face" className="relative z-10 w-5 xs:w-6 h-5 xs:h-6 mb-1 object-contain" />
                    <span className="relative z-10 text-[9px] xs:text-[10px] sm:text-[11px] text-gray-200 font-medium tracking-tight">Hugging Face</span>
                  </div>

                  {/* LangChain */}
                  <div className="glass-3d flex flex-col items-center justify-center w-[66px] xs:w-[74px] sm:w-[82px] h-[64px] xs:h-[72px] sm:h-[78px] rounded-xl hover:border-emerald-400/50 transition-all duration-300 group">
                    <img src={langchainLogo} alt="LangChain" className="relative z-10 w-5 xs:w-6 h-5 xs:h-6 mb-1 object-contain" />
                    <span className="relative z-10 text-[9px] xs:text-[10px] sm:text-[11px] text-gray-200 font-medium tracking-tight">LangChain</span>
                  </div>

                  {/* Vector DB */}
                  <div className="glass-3d flex flex-col items-center justify-center w-[66px] xs:w-[74px] sm:w-[82px] h-[64px] xs:h-[72px] sm:h-[78px] rounded-xl hover:border-cyan-400/50 transition-all duration-300 group">
                    <img src={vectordbLogo} alt="Vector DB" className="relative z-10 w-5 xs:w-6 h-5 xs:h-6 mb-1 object-contain" />
                    <span className="relative z-10 text-[9px] xs:text-[10px] sm:text-[11px] text-gray-200 font-medium tracking-tight">Vector DB</span>
                  </div>
                </div>

                {/* Subtitle label */}
                <p className="text-gray-400 text-xs sm:text-sm font-medium mt-1 tracking-wide">
                  Technologies & Tools
                </p>
              </div>

              {/* View My Projects Button (Matching Mockup's sleek bordered button style) */}
              <div className="pt-2">
                <a 
                  href="#projects" 
                  className="glass-3d inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-white text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 hover:border-white/40"
                >
                  <span className="relative z-10">View My Projects</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Content Area - Profile Picture (High-end 3D Glass Square Portrait with beveled rims) */}
          <div className="flex-1 flex justify-center items-center w-full mt-4 lg:mt-0">
            <div className="flex flex-col items-center">
              {/* Outer 3D square glass frame container */}
              <div className="glass-3d w-52 h-52 xs:w-60 xs:h-60 sm:w-72 sm:h-72 md:w-84 md:h-84 lg:w-[370px] lg:h-[370px] xl:w-[400px] xl:h-[400px] max-w-[85vw] max-h-[85vw] rounded-3xl flex items-center justify-center relative transition-all duration-300 hover:border-white/30 p-3 sm:p-4.5">
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

              {/* Clean minimalist FULL-STACK DEVELOPER title below avatar */}
              <div className="mt-5 sm:mt-6 text-center">
                <span className="text-white text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.25em] text-gray-200">
                  FULL-STACK DEVELOPER
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Projects Section (Horizontal Slider in Clean Dark 3D Glass Theme) */}
        <div className="mt-12 sm:mt-16 md:mt-24 mb-16 sm:mb-20">
          {/* Header row with Title and Single GET IN TOUCH Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-10 px-4 max-w-7xl mx-auto">
            <div>
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-center sm:text-left">
                Featured Projects
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 text-center sm:text-left">
                Selected full-stack platforms, APIs, and real-time systems
              </p>
            </div>

            <a 
              href="#contacts"
              className="border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl uppercase tracking-wider transition-all duration-200 inline-flex items-center gap-2 group cursor-pointer"
            >
              <span>Get In Touch</span>
              <span className="text-gray-400 group-hover:text-white transition-colors">→</span>
            </a>
          </div>
          
          {loading ? (
            <div className="text-center text-white text-base py-16">
              Loading featured projects...
            </div>
          ) : (
            <div className="relative max-w-7xl mx-auto px-2 sm:px-4">
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Desktop Left Arrow Button */}
                <button
                  type="button"
                  onClick={scrollPrev}
                  className="hidden sm:flex w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#0c0e1a] hover:bg-[#16192e] border border-white/20 hover:border-white/50 text-white items-center justify-center transition-all duration-200 cursor-pointer shadow-lg shrink-0 z-20 hover:scale-105 active:scale-95 group"
                  aria-label="Previous Project"
                  title="Previous Project"
                >
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:-translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Horizontal Scrollable Row of Dark 3D Glass Cards */}
                <div 
                  ref={carouselRef}
                  className="flex-1 flex gap-3.5 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-1"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {featuredRepos.map((repo) => {
                    // Dynamically derive clean action label from project title (no hardcoded constants)
                    const cleanTitle = repo.name.split(/[-:(]/)[0].trim();
                    const actionLabel = cleanTitle.length <= 22 ? `Explore ${cleanTitle}` : 'Explore Project';

                    // Dynamic project status based on actual project links and stack
                    const statLabel = repo.html_url && repo.repo_url 
                      ? 'Live Demo • Open Source' 
                      : repo.html_url 
                      ? 'Live Production Web App' 
                      : `${repo.techStack?.[0] || 'Full-Stack'} Platform`;

                    return (
                      <div
                        key={repo.id}
                        className="snap-start shrink-0 w-[265px] xs:w-[280px] sm:w-[290px] md:w-[305px] lg:w-[calc(25%-16px)] glass-3d text-white rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:border-white/30 hover:-translate-y-1.5 group"
                      >
                        <div>
                          {/* Project Image / Visual Area */}
                          <div className="h-36 sm:h-40 rounded-2xl overflow-hidden bg-black/60 border border-white/10 mb-3.5 relative flex items-center justify-center shadow-inner">
                            {repo.image ? (
                              <img
                                src={repo.image}
                                alt={repo.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                style={{ objectPosition: repo.image_position || 'center center' }}
                                draggable={false}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-white font-bold text-base sm:text-lg mb-1.5 leading-snug line-clamp-1 tracking-tight group-hover:text-white transition-colors">
                            {repo.name}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-300 text-xs sm:text-[13px] leading-relaxed mb-3 line-clamp-2">
                            {repo.description}
                          </p>

                          {/* Tech Stack Pills */}
                          {repo.techStack && repo.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2.5">
                              {repo.techStack.slice(0, 3).map((tech) => (
                                <span
                                  key={tech}
                                  className="bg-[#18192e] text-[#c4b5fd] border border-purple-500/20 text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-tight"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Metric / Stat Label (Clean, no pulsing neon dot) */}
                          <div className="text-gray-400 text-[11px] font-medium mb-3 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                            <span>{statLabel}</span>
                          </div>
                        </div>

                        {/* Primary Button with Clean Floating Tooltip */}
                        <div className="relative group/btn mt-2">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#131524] hover:bg-[#1e2139] border border-white/15 hover:border-white/30 text-white text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                          >
                            <span className="truncate">{actionLabel}</span>
                          </a>

                          {/* Floating Pill on hover matching mockup */}
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 pointer-events-none group-hover/btn:pointer-events-auto transition-all duration-200 z-30 flex items-center gap-2 bg-[#0c0e1a] text-white text-[11px] font-medium py-1 px-3 rounded-full shadow-xl border border-white/20 backdrop-blur-md whitespace-nowrap">
                            {repo.repo_url && (
                              <>
                                <a 
                                  href={repo.repo_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:text-white text-gray-300 transition-colors flex items-center gap-1"
                                >
                                  <span>Repo</span>
                                </a>
                                <span className="text-gray-600">•</span>
                              </>
                            )}
                            <a 
                              href={repo.html_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-white text-gray-300 transition-colors flex items-center gap-1"
                            >
                              <span>Live Demo</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Right Arrow Button */}
                <button
                  type="button"
                  onClick={scrollNext}
                  className="hidden sm:flex w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#0c0e1a] hover:bg-[#16192e] border border-white/20 hover:border-white/50 text-white items-center justify-center transition-all duration-200 cursor-pointer shadow-lg shrink-0 z-20 hover:scale-105 active:scale-95 group"
                  aria-label="Next Project"
                  title="Next Project"
                >
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Mobile Carousel Navigation Controls */}
              <div className="flex sm:hidden items-center justify-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={scrollPrev}
                  className="w-10 h-10 rounded-xl bg-[#0c0e1a] border border-white/20 text-white flex items-center justify-center active:scale-95 cursor-pointer shadow-md"
                  aria-label="Previous Project"
                >
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-[11px] text-gray-500 font-mono tracking-wide">Swipe or tap</span>
                <button
                  type="button"
                  onClick={scrollNext}
                  className="w-10 h-10 rounded-xl bg-[#0c0e1a] border border-white/20 text-white flex items-center justify-center active:scale-95 cursor-pointer shadow-md"
                  aria-label="Next Project"
                >
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-3.5 xl:gap-4 max-w-7xl mx-auto">
              {/* Render Categories across 5 columns */}
              {['Language', 'Framework', 'Database', 'DevOps & Cloud Platforms', 'Tool', 'Design'].map((category) => {
                const items = techItems.filter((t) => t.category === category);
                if (items.length === 0) return null;
                
                return (
                  <div 
                    key={category}
                    className="w-full flex flex-col"
                  >
                    <div className="glass-3d rounded-2xl p-4 sm:p-4.5 flex flex-col h-full hover:border-white/30 transition-all duration-300">
                      <h3 className="relative z-10 text-base sm:text-lg font-bold mb-3.5 text-white border-b border-white/10 pb-2 flex items-center justify-between">
                        <span className="truncate">
                          {category === 'Language' ? 'Languages' : 
                           category === 'Framework' ? 'Frameworks' : 
                           category === 'Database' ? 'Databases' : 
                           category === 'DevOps & Cloud Platforms' ? 'DevOps & Cloud' :
                           category === 'Tool' ? 'Tools' : category}
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-normal text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 ml-1.5 shrink-0">
                          {items.length}
                        </span>
                      </h3>
                      <div className="relative z-10 flex flex-col gap-2.5 flex-grow">
                        {items.map((tech) => (
                          <div 
                            key={tech.id} 
                            className="glass-3d-pill flex items-center gap-2.5 rounded-xl p-2 hover:border-white/40 transition-all duration-200 group"
                          >
                            <div className="relative z-10 w-6 h-6 flex-shrink-0 text-white flex items-center justify-center">
                              {tech.icon.trim().toLowerCase().startsWith('<svg') ? (
                                <div 
                                  className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain" 
                                  dangerouslySetInnerHTML={{ __html: tech.icon }} 
                                />
                              ) : (
                                <img 
                                  src={tech.icon} 
                                  alt={tech.name} 
                                  className="w-full h-full object-contain"
                                />
                              )}
                            </div>
                            <span className="relative z-10 text-white text-xs sm:text-[13px] font-semibold group-hover:text-white transition-colors truncate">
                              {tech.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Work Experience Section - Interactive Split 1-Section (Matching Inspo Reference) */}
        <div className="mt-14 sm:mt-20 md:mt-28 mb-16 sm:mb-20">
          <div className="max-w-7xl mx-auto px-4 mb-8 sm:mb-10 text-center">
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Work Experience
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1.5">
              Roles, engineering responsibilities, and professional milestones
            </p>
          </div>

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
                <div className="max-w-7xl mx-auto px-2 sm:px-4">
                  {/* Single Unified Dark Container with Subtle Tech Grid */}
                  <div className="relative rounded-3xl bg-[#080910] border border-white/10 p-4 sm:p-8 md:p-14 lg:p-16 overflow-hidden shadow-2xl">
                    {/* Subtle Engineering Grid Background */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-25"
                      style={{
                        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)`,
                        backgroundSize: '36px 36px',
                      }}
                    />

                    {/* Interactive Split Grid */}
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-12 lg:gap-16 items-center">
                      {/* Mobile Horizontal Role Selector (md:hidden) */}
                      <div className="flex md:hidden overflow-x-auto no-scrollbar gap-2 pb-1.5 -mx-1 px-1 w-full">
                        {experienceItems.map((exp) => {
                          const isSelected = activeExp?.id === exp.id;
                          return (
                            <button
                              key={exp.id}
                              type="button"
                              onClick={() => setSelectedExpId(exp.id)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                                isSelected
                                  ? 'bg-white text-gray-900 shadow-md font-bold scale-[1.02]'
                                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                              }`}
                            >
                              {exp.role}
                            </button>
                          );
                        })}
                      </div>

                      {/* Desktop Left Side: Roles & Timeline List (hidden md:flex) */}
                      <div className="hidden md:flex md:col-span-5 flex-col gap-7 sm:gap-9">
                        {experienceItems.map((exp) => {
                          const isSelected = activeExp?.id === exp.id;
                          return (
                            <div
                              key={exp.id}
                              onClick={() => setSelectedExpId(exp.id)}
                              onMouseEnter={() => setSelectedExpId(exp.id)}
                              className="cursor-pointer group text-left transition-all duration-200"
                            >
                              <h3
                                className={`text-base sm:text-lg md:text-xl font-bold tracking-tight transition-all duration-200 ${
                                  isSelected
                                    ? 'text-white translate-x-1'
                                    : 'text-gray-500 group-hover:text-gray-300'
                                }`}
                              >
                                {exp.role}
                              </h3>
                              <p
                                className={`text-xs sm:text-sm mt-1 transition-colors duration-200 ${
                                  isSelected
                                    ? 'text-gray-300'
                                    : 'text-gray-600 group-hover:text-gray-400'
                                }`}
                              >
                                {exp.company}
                              </p>
                              <p
                                className={`text-[11px] sm:text-xs font-mono mt-0.5 transition-colors duration-200 ${
                                  isSelected
                                    ? 'text-gray-400'
                                    : 'text-gray-700 group-hover:text-gray-500'
                                }`}
                              >
                                {exp.duration}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Right Side: Floating Dark Glass Description Card */}
                      <div className="md:col-span-7 w-full">
                        {activeExp && (
                          <div className="bg-[#10121d]/95 border border-white/15 rounded-2xl p-5 sm:p-7 md:p-8 shadow-2xl backdrop-blur-md transition-all duration-300">
                            {/* Mobile Active Header badge */}
                            <div className="md:hidden pb-3 mb-3 border-b border-white/10 flex items-center justify-between">
                              <div>
                                <h4 className="text-white text-sm font-bold">{activeExp.company}</h4>
                                <span className="text-[11px] text-gray-400 font-mono">{activeExp.duration}</span>
                              </div>
                              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                                Active Role
                              </span>
                            </div>

                            <p className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed">
                              {activeExp.description}
                            </p>

                            {activeExp.key_achievements && activeExp.key_achievements.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                                {activeExp.key_achievements.slice(0, 2).map((ach, aIdx) => (
                                  <div key={aIdx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-400">
                                    <span className="text-gray-500 mt-0.5">•</span>
                                    <span>{ach}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {activeExp.tech_stack && activeExp.tech_stack.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/10">
                                {activeExp.tech_stack.map((tech) => (
                                  <span
                                    key={tech}
                                    className="bg-white/5 border border-white/10 text-gray-300 text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-md"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Clean Navigation Link */}
                  <div className="mt-8 text-center">
                    <a
                      href="#experience"
                      className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span>View Full Experience Journey</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      </div>

      {/* Scroll-Linked Curtain Fill Section */}
      <section 
        ref={buildSectionRef} 
        className="relative w-full overflow-hidden bg-[#07080c] py-14 sm:py-24 md:py-32 min-h-[500px] sm:min-h-[560px]"
      >
        {/* ======================================================== */}
        {/* LAYER 1 (Base): Dark Theme Content                      */}
        {/* ======================================================== */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl relative z-0 text-center">
          {/* Availability Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs sm:text-sm font-semibold text-gray-300 mb-5 sm:mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available for new projects &amp; opportunities</span>
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
        {/* LAYER 2 (Overlay): Rising Light Curtain (#f4f5f8)        */}
        {/* Visibly sweeps up from 0% to 100% as you scroll down     */}
        {/* ======================================================== */}
        <div 
          className="absolute inset-0 bg-[#f4f5f8] z-10 flex flex-col justify-center overflow-hidden py-14 sm:py-24 md:py-32 pointer-events-auto"
          style={{
            clipPath: `inset(${(1 - curtainProgress) * 100}% 0 0 0)`,
            willChange: 'clip-path',
          }}
        >
          {/* Subtle Architectural Dot Grid Pattern on Light Canvas */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `radial-gradient(#00000018 1.5px, transparent 1.5px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Soft Ambient Radial Highlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-white/80 rounded-full blur-3xl pointer-events-none" />

          {/* Light Theme Content */}
          <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl relative z-10 text-center">
            {/* Availability Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] border border-black/10 text-xs sm:text-sm font-semibold text-gray-700 mb-5 sm:mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for new projects &amp; opportunities</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#0a0c16] mb-5 sm:mb-6 leading-[1.2] sm:leading-[1.18]">
              <span className="block pb-1">Let's build something</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-950 via-gray-700 to-gray-500 pb-2">
                exceptional together.
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed font-normal px-2">
              Have a project in mind, need a full-stack platform, or want to collaborate on real-time web systems? Let's turn your vision into code.
            </p>

            {/* Email Showcase Box with Copy Button */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 bg-white rounded-2xl sm:rounded-full border border-gray-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.1)] transition-all duration-300 max-w-xl mx-auto mb-6 sm:mb-8 w-full sm:w-auto">
              <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-mono text-xs sm:text-base md:text-lg font-bold text-gray-900 select-all tracking-tight break-all sm:break-normal">
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
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-300/80 text-gray-800 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Open Contact Form</span>
                <span className="text-gray-500">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Luminous Leading Edge Beam on the Rising Curtain */}
        <div 
          className="absolute inset-x-0 z-20 pointer-events-none transition-opacity duration-200"
          style={{
            top: `${(1 - curtainProgress) * 100}%`,
            opacity: curtainProgress > 0.02 && curtainProgress < 0.98 ? 1 : 0,
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
