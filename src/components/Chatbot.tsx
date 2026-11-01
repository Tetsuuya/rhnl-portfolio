import { useState, useRef, useEffect, type ReactNode } from 'react';
import profilePicture from '../assets/Gemini_Generated_Image_nwsi8fnwsi8fnwsi.jpeg';
import { chatbotService } from '../services/chatbotService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

const SUGGESTIONS = [
  'What are Rhenel’s strongest projects?',
  'What’s the tech stack?',
  'Tell me about the work experience',
  'Is Rhenel open to work?',
];

// Inline Markdown: **bold**, URLs and emails become links
const renderInline = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    if (/^https?:\/\//.test(part)) {
      const href = part.replace(/[.,]$/, '');
      return (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline underline-offset-2 decoration-cyan-300/40 hover:decoration-cyan-300 break-all">
          {href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
        </a>
      );
    }
    if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className="text-cyan-300 underline underline-offset-2 decoration-cyan-300/40 hover:decoration-cyan-300 whitespace-nowrap">
          {part}
        </a>
      );
    }
    return part;
  });

// Block Markdown: paragraphs and "- " bullet lists
const renderMarkdown = (content: string): ReactNode[] => {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="space-y-1.5 my-1">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-2 w-1 h-1 rounded-full bg-cyan-300 shrink-0" />
            <span>{renderInline(b)}</span>
          </li>
        ))}
      </ul>
    );
    bullets = [];
  };

  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    const bullet = trimmed.match(/^[-*•]\s+(.*)/);
    if (bullet) {
      bullets.push(bullet[1]);
    } else {
      flushBullets();
      if (trimmed) blocks.push(<p key={`p-${blocks.length}`}>{renderInline(trimmed)}</p>);
    }
  });
  flushBullets();

  return blocks;
};

const Avatar = ({ size = 'w-8 h-8' }: { size?: string }) => (
  <span className={`relative inline-block ${size} shrink-0`}>
    <img src={profilePicture} alt="" className="w-full h-full rounded-full object-cover border border-white/15" draggable={false} />
    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0b0d14]" />
  </span>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Auto-grow the textarea up to a few lines
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  const sendMessage = async (text: string) => {
    const userText = text.trim();
    if (!userText || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage(userText);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      // Keep technical details in the console; visitors get a helpful fallback
      console.error('Chatbot error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          isError: true,
          content:
            "Sorry, I can't answer right now. You can reach Rhenel directly at sajol.rhenel123@gmail.com or through the Contacts page.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <>
      {/* Floating Trigger */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 flex items-center gap-2.5 pl-1.5 pr-1.5 sm:pr-4 py-1.5 rounded-full bg-[#0b0d14]/90 backdrop-blur-xl border border-white/15 hover:border-white/30 text-white shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
          aria-label="Open chat assistant"
        >
          <Avatar size="w-10 h-10" />
          <span className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-semibold">Ask about me</span>
            <span className="text-[11px] text-gray-400 group-hover:text-gray-300">Quick answers</span>
          </span>
        </button>
      )}

      {/* Chat Window: full screen on mobile, floating panel on larger screens */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat assistant"
          className="fixed inset-0 sm:inset-auto sm:bottom-8 sm:right-8 sm:w-[420px] sm:h-[620px] sm:max-h-[calc(100vh-4rem)] z-[60] flex flex-col overflow-hidden bg-[#0b0d14] sm:bg-[#0b0d14]/95 sm:backdrop-blur-2xl sm:border sm:border-white/15 sm:rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] animate-modal-fade-in sm:origin-bottom-right"
        >
          {/* Header */}
          <div className="px-4 sm:px-5 py-3.5 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar size="w-10 h-10" />
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-white truncate">Ask about Rhenel</h3>
                <p className="text-xs text-gray-400 truncate">Quick answers about my work</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setMessages([])}
                  disabled={isLoading}
                  className="w-9 h-9 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40"
                  aria-label="New chat"
                  title="New chat"
                >
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-4 min-h-0 no-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-end">
                <div className="mb-6">
                  <Avatar size="w-12 h-12" />
                  <p className="text-white text-lg font-semibold mt-4">Hi there 👋</p>
                  <p className="text-gray-400 text-sm leading-relaxed mt-1">
                    I can answer questions about Rhenel's projects, skills and experience. Try one of these:
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => sendMessage(s)}
                      className="text-left text-sm text-gray-200 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/25 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      {s}
                      <span className="text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all">→</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) =>
                msg.role === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md bg-white text-gray-950 text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex items-start gap-2.5">
                    <Avatar size="w-7 h-7" />
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-md text-sm leading-relaxed space-y-2 break-words ${
                        msg.isError
                          ? 'bg-amber-500/10 border border-amber-500/20 text-amber-100'
                          : 'bg-white/[0.05] border border-white/10 text-gray-200'
                      }`}
                    >
                      {renderMarkdown(msg.content)}
                    </div>
                  </div>
                )
              )
            )}

            {isLoading && (
              <div className="flex items-start gap-2.5">
                <Avatar size="w-7 h-7" />
                <div className="bg-white/[0.05] border border-white/10 rounded-2xl rounded-tl-md px-4 py-3.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-white/10">
            <div className="flex items-end gap-2 rounded-2xl bg-white/[0.04] border border-white/15 focus-within:border-white/35 transition-colors pl-4 pr-1.5 py-1.5">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Rhenel…"
                disabled={isLoading}
                className="flex-1 resize-none bg-transparent py-2 text-base sm:text-sm text-white placeholder-gray-500 focus:outline-none disabled:opacity-50 no-scrollbar"
              />
              <button
                type="submit"
                disabled={!canSend}
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  canSend
                    ? 'bg-white text-gray-950 hover:bg-gray-200 cursor-pointer'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
            <p className="text-[11px] text-gray-500 text-center mt-2">
              Need something specific? Email{' '}
              <a href="mailto:sajol.rhenel123@gmail.com" className="text-gray-400 hover:text-white underline underline-offset-2">
                Rhenel directly
              </a>
              .
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
