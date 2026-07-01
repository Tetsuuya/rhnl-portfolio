import { useState, useEffect } from 'react';
import LandingPage from './landingpage/landingpage';
import Projects from './landingpage/subtab/projects';
import About from './landingpage/subtab/about';
import Contact from './landingpage/subtab/contact';
import ExperienceSubtab from './landingpage/subtab/experience';
import AdminPage from './admin/AdminPage';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ElasticBackground from './components/ElasticBackground';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [introX, setIntroX] = useState<number>(0);
  const [introActive, setIntroActive] = useState<boolean>(true);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Subscribe to snake intro position custom events
  useEffect(() => {
    const handleIntro = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIntroX(customEvent.detail.x);
      setIntroActive(customEvent.detail.active);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('snake-intro', handleIntro);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('snake-intro', handleIntro);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentView(hash);
      // Close sidebar when navigating
      setSidebarOpen(false);
    };

    // Set initial view
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (sidebarOpen && !target.closest('.sidebar') && !target.closest('.hamburger-button')) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen w-full relative text-white overflow-x-hidden">
      {/* Dynamic Elastic Rubber Sheet Background */}
      <ElasticBackground />

      {/* Page Content Wrapper (unfolds in the wake of the slithering snake) */}
      <div
        style={{
          clipPath: introActive ? `inset(0 ${Math.max(0, windowWidth - introX)}px 0 0)` : 'none',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Navigation Bar - Desktop */}
      <nav className="w-full py-4 sm:py-6 fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm hidden md:block">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 flex flex-row items-center justify-between max-w-7xl">
          <div className="flex-1 max-w-2xl">
            <div className="text-white text-base sm:text-lg md:text-xl font-semibold">
              Rhenel.s
            </div>
          </div>
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="flex items-center gap-4">
              <a href="#home" className="text-white hover:text-white transition-all duration-300 text-sm md:text-base px-3 py-2 rounded-lg hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] hover:bg-pink-500/10 hover:translate-y-[-6px] hover:scale-105">Home</a>
              <a href="#projects" className="text-white hover:text-white transition-all duration-300 text-sm md:text-base px-3 py-2 rounded-lg hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] hover:bg-pink-500/10 hover:translate-y-[-6px] hover:scale-105">Projects</a>
              <a href="#about" className="text-white hover:text-white transition-all duration-300 text-sm md:text-base px-3 py-2 rounded-lg hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] hover:bg-pink-500/10 hover:translate-y-[-6px] hover:scale-105">About</a>
              <a href="#experience" className="text-white hover:text-white transition-all duration-300 text-sm md:text-base px-3 py-2 rounded-lg hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] hover:bg-pink-500/10 hover:translate-y-[-6px] hover:scale-105">Experience</a>
              <a href="#contacts" className="text-white hover:text-white transition-all duration-300 text-sm md:text-base px-3 py-2 rounded-lg hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] hover:bg-pink-500/10 hover:translate-y-[-6px] hover:scale-105">Contacts</a>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/rhnl.s/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white transition-all duration-300 p-2 rounded-lg hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] hover:bg-pink-500/10 hover:translate-y-[-6px] hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://github.com/Tetsuuya" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white transition-all duration-300 p-2 rounded-lg hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] hover:bg-pink-500/10 hover:translate-y-[-6px] hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/rhenel-jhon-sajol-360275324/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white transition-all duration-300 p-2 rounded-lg hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] hover:bg-pink-500/10 hover:translate-y-[-6px] hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Header with Hamburger */}
      <header className="w-full py-4 sm:py-6 fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm md:hidden">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="text-white text-base sm:text-lg font-semibold">
            Rhenel.s
          </div>
          <button
            className="hamburger-button text-white p-2 rounded-lg hover:bg-pink-500/10 transition-all duration-300"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile/Tablet */}
      <aside
        className={`sidebar fixed top-0 right-0 h-full w-64 sm:w-80 bg-black/95 backdrop-blur-md z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Close button */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-white text-lg font-semibold">Menu</div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white p-2 rounded-lg hover:bg-pink-500/10 transition-all duration-300"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-4 flex-1">
            <a
              href="#home"
              onClick={() => setSidebarOpen(false)}
              className="text-white text-lg px-4 py-3 rounded-lg hover:bg-pink-500/10 hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] transition-all duration-300 hover:translate-x-2"
            >
              Home
            </a>
            <a
              href="#projects"
              onClick={() => setSidebarOpen(false)}
              className="text-white text-lg px-4 py-3 rounded-lg hover:bg-pink-500/10 hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] transition-all duration-300 hover:translate-x-2"
            >
              Projects
            </a>
            <a
              href="#about"
              onClick={() => setSidebarOpen(false)}
              className="text-white text-lg px-4 py-3 rounded-lg hover:bg-pink-500/10 hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] transition-all duration-300 hover:translate-x-2"
            >
              About
            </a>
            <a
              href="#experience"
              onClick={() => setSidebarOpen(false)}
              className="text-white text-lg px-4 py-3 rounded-lg hover:bg-pink-500/10 hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] transition-all duration-300 hover:translate-x-2"
            >
              Experience
            </a>
            <a
              href="#contacts"
              onClick={() => setSidebarOpen(false)}
              className="text-white text-lg px-4 py-3 rounded-lg hover:bg-pink-500/10 hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] transition-all duration-300 hover:translate-x-2"
            >
              Contacts
            </a>
          </nav>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 pt-6 border-t border-white/20">
            <a
              href="https://www.instagram.com/rhnl.s/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white p-3 rounded-lg hover:bg-pink-500/10 hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://github.com/Tetsuuya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white p-3 rounded-lg hover:bg-pink-500/10 hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/rhenel-jhon-sajol-360275324/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white p-3 rounded-lg hover:bg-pink-500/10 hover:shadow-[0_8px_25px_rgba(236,72,153,0.7)] transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content - Changes based on route */}
      <div className="pt-20 sm:pt-24 min-h-screen flex flex-col">
        <div className="flex-1">
          {currentView === 'projects' ? (
            <Projects />
          ) : currentView === 'about' ? (
            <About />
          ) : currentView === 'experience' ? (
            <ExperienceSubtab />
          ) : currentView === 'contacts' ? (
            <Contact />
          ) : currentView === 'admin' ? (
            <AdminPage />
          ) : (
            <LandingPage />
          )}
        </div>
        <Footer />
      </div>
      
        {/* Snake Interactive Food Hint Banner */}
        <div className="fixed bottom-6 left-6 z-40 max-w-xs bg-black/60 backdrop-blur-md border border-pink-500/30 rounded-xl p-3 shadow-lg pointer-events-none hidden sm:block">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">👍</span>
            <div>
              <p className="text-xs text-pink-300 font-bold uppercase tracking-wider">Interactive Grid</p>
              <p className="text-[11px] text-gray-300">Click empty grid space to feed the Python a Like!</p>
            </div>
          </div>
        </div>

        {/* Chatbot */}
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
