import { useState, useRef, useEffect } from 'react';
import { chatbotService } from '../services/chatbotService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! Ask me anything about Rhenel's skills, projects, or experience.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMessage: Message = { role: 'user', content: userText };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await chatbotService.sendMessage(userText, history);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            error instanceof Error
              ? error.message
              : 'Sorry, I ran into an issue. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0c0d16] hover:bg-[#161826] text-white border-2 border-white/30 hover:border-white/60 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(255,255,255,0.15)] transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
          aria-label="Open chat"
        >
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* Spacious Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-[calc(100vw-3rem)] sm:w-[440px] md:w-[480px] max-w-[calc(100vw-3rem)] h-[580px] sm:h-[640px] max-h-[calc(100vh-6rem)] bg-[#090a12]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_30px_rgba(255,255,255,0.05)] flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">Assistant</h3>
                <p className="text-xs text-gray-400">Ask anything about Rhenel</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white border border-white/20 flex items-center justify-center cursor-pointer transition-all active:scale-95 text-base font-bold shadow-sm"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 min-h-0 text-sm sm:text-base custom-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 sm:px-4.5 py-3 sm:py-3.5 rounded-2xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-white text-black rounded-tr-sm font-medium shadow-md'
                      : 'bg-white/[0.06] border border-white/10 text-gray-200 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm sm:text-[15px]">{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                  <span
                    className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  ></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3.5 sm:p-4 border-t border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={isLoading}
                className="flex-1 bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shrink-0 ${
                  input.trim() && !isLoading
                    ? 'bg-white text-black hover:bg-gray-200 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95'
                    : 'bg-white/20 text-white/50 border border-white/10 cursor-not-allowed'
                }`}
                aria-label="Send"
              >
                <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Send</span>
                <svg className="w-4 h-4 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
