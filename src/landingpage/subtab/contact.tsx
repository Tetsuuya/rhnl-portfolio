import { useState } from 'react';
import { emailService } from '../../services/emailService';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      await emailService.sendEmail(formData);
      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully! I\'ll get back to you soon.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to send message. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-[calc(100vh-120px)] w-full py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
            Contact Me
          </h2>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl">
            Have a question or want to work together? Feel free to get in touch with me.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
          {/* Left Column - Send a Message Form */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 border-2 border-white/20 rounded-lg p-4 sm:p-5 md:p-6 backdrop-blur-sm transition-all duration-300 hover:border-pink-300 hover:shadow-[0_10px_35px_rgba(236,72,153,0.6)] hover:translate-y-[-8px] hover:scale-105">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-5 md:mb-6">
                Send a Message
              </h3>
              
              {/* Status Message */}
              {submitStatus.type && (
                <div
                  className={`mb-4 p-4 rounded-lg ${
                    submitStatus.type === 'success'
                      ? 'bg-green-500/20 border border-green-500 text-green-300'
                      : 'bg-red-500/20 border border-red-500 text-red-300'
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-black/60 border border-white/20 rounded-lg text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-300/50 transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-black/60 border border-white/20 rounded-lg text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-300/50 transition-all"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-black/60 border border-white/20 rounded-lg text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-300/50 transition-all"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    required
                    rows={6}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-black/60 border border-white/20 rounded-lg text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-300/50 transition-all resize-y"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/50 disabled:cursor-not-allowed text-white text-sm sm:text-base font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 hover:shadow-[0_10px_35px_rgba(236,72,153,0.6)] hover:translate-y-[-4px] hover:scale-105 disabled:hover:translate-y-0 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            {/* Contact Information */}
            <div className="bg-black/40 border-2 border-white/20 rounded-lg p-4 sm:p-5 md:p-6 backdrop-blur-sm transition-all duration-300 hover:border-pink-300 hover:shadow-[0_10px_35px_rgba(236,72,153,0.6)] hover:translate-y-[-8px] hover:scale-105">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-5 md:mb-6">
                Contact Information
              </h3>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Email */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pink-500/20 border border-pink-300 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm sm:text-base font-semibold mb-1">Email:</p>
                    <p className="text-gray-300 text-xs sm:text-sm mb-1 break-all">sajol.rhenel123@gmail.com</p>
                    <a 
                      href="mailto:sajol.rhenel123@gmail.com" 
                      className="text-pink-300 hover:text-pink-400 text-xs sm:text-sm transition-colors"
                    >
                      Send an email
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pink-500/20 border border-pink-300 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm sm:text-base font-semibold mb-1">Phone:</p>
                    <p className="text-gray-300 text-xs sm:text-sm mb-1">09536145105</p>
                    <a 
                      href="tel:09536145105" 
                      className="text-pink-300 hover:text-pink-400 text-xs sm:text-sm transition-colors"
                    >
                      Give me a call
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pink-500/20 border border-pink-300 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm sm:text-base font-semibold mb-1">Location:</p>
                    <p className="text-gray-300 text-xs sm:text-sm">Cagayan de Oro City, Philippines</p>
                    <p className="text-gray-400 text-xs mt-1 wrap-break-word">University of Science and Technology of Southern Philippines</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Available For */}
            <div className="bg-black/40 border-2 border-white/20 rounded-lg p-4 sm:p-5 md:p-6 backdrop-blur-sm transition-all duration-300 hover:border-pink-300 hover:shadow-[0_10px_35px_rgba(236,72,153,0.6)] hover:translate-y-[-8px] hover:scale-105">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-5 md:mb-6">
                Available For
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0"></span>
                  <span className="text-white text-sm sm:text-base">Freelance</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0"></span>
                  <span className="text-white text-sm sm:text-base">Web Development Projects</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0"></span>
                  <span className="text-white text-sm sm:text-base">QA Testing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

