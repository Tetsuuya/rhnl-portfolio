import { useEffect, useRef, useState } from 'react';
import { emailService } from '../../services/emailService';
import {
  CONTACT_LIMITS,
  validateContact,
  validateContactField,
  type ContactErrors,
  type ContactFields,
} from '../../utils/contactValidation';
import { SITE } from '../../config/site';

type FieldName = keyof ContactFields;

const EMPTY_FORM: ContactFields = { name: '', email: '', subject: '', message: '' };

// Real people take a few seconds to fill the form; instant submissions are bots
const MIN_FILL_TIME_MS = 3000;

const FIELD_ORDER: FieldName[] = ['name', 'email', 'subject', 'message'];

const Contact = () => {
  const [formData, setFormData] = useState<ContactFields>(EMPTY_FORM);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const startedAt = useRef(Date.now());
  const fieldRefs = useRef<Partial<Record<FieldName, HTMLInputElement | HTMLTextAreaElement | null>>>({});

  useEffect(() => {
    startedAt.current = Date.now();
  }, [sent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as FieldName;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitError('');
    // Once a field has been visited, re-check it live so errors clear as soon as they're fixed
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateContactField(field, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as FieldName;
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateContactField(field, e.target.value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const nextErrors = validateContact(formData);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, subject: true, message: true });

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    // Bot checks: hidden field filled in, or form submitted impossibly fast. Pretend it worked.
    if (honeypot || Date.now() - startedAt.current < MIN_FILL_TIME_MS) {
      setSent(true);
      return;
    }

    setLoading(true);
    setSubmitError('');
    try {
      await emailService.sendEmail(formData);
      setSent(true);
      setFormData(EMPTY_FORM);
      setTouched({});
      setErrors({});
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to send message. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (field: FieldName) =>
    `glass-3d-input w-full px-4 py-3 rounded-xl text-white text-base placeholder-gray-500 focus:outline-none ${
      errors[field] ? '!border-red-400/70' : ''
    }`;

  const renderError = (field: FieldName) =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-1.5 text-xs sm:text-sm text-red-300 flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        {errors[field]}
      </p>
    ) : null;

  const fieldA11y = (field: FieldName) => ({
    id: `contact-${field}`,
    name: field,
    value: formData[field],
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
    ref: (el: HTMLInputElement | HTMLTextAreaElement | null) => {
      fieldRefs.current[field] = el;
    },
  });

  const messageLength = formData.message.trim().length;

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
            <div className="glass-3d rounded-2xl p-6 sm:p-8 h-full">
              {sent ? (
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center py-10" role="status">
                  <span className="w-14 h-14 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mb-5">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <h3 className="text-white text-2xl font-bold">Message sent!</h3>
                  <p className="text-gray-400 mt-2 max-w-sm">
                    Thanks for reaching out. I usually reply within 1–2 days.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-6 px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="relative z-10 text-white text-xl sm:text-2xl font-bold mb-6">
                    Send a Message
                  </h3>

                  {submitError && (
                    <div role="alert" className="relative z-10 mb-5 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-200 text-sm">
                      {submitError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate className="relative z-10 space-y-4">
                    {/* Honeypot: hidden from people and screen readers, bots tend to fill it */}
                    <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                      <label htmlFor="contact-website">Website</label>
                      <input
                        id="contact-website"
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-300 mb-1.5">
                          Name
                        </label>
                        <input
                          {...fieldA11y('name')}
                          type="text"
                          autoComplete="name"
                          maxLength={CONTACT_LIMITS.name.max}
                          placeholder="Your name"
                          className={fieldClass('name')}
                        />
                        {renderError('name')}
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300 mb-1.5">
                          Email
                        </label>
                        <input
                          {...fieldA11y('email')}
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          spellCheck={false}
                          maxLength={CONTACT_LIMITS.email.max}
                          placeholder="you@company.com"
                          className={fieldClass('email')}
                        />
                        {renderError('email')}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-300 mb-1.5">
                        Subject
                      </label>
                      <input
                        {...fieldA11y('subject')}
                        type="text"
                        maxLength={CONTACT_LIMITS.subject.max}
                        placeholder="Job opportunity, project inquiry…"
                        className={fieldClass('subject')}
                      />
                      {renderError('subject')}
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300">
                          Message
                        </label>
                        <span
                          className={`text-xs tabular-nums ${
                            messageLength > CONTACT_LIMITS.message.max * 0.9 ? 'text-amber-300' : 'text-gray-500'
                          }`}
                          aria-live="polite"
                        >
                          {messageLength} / {CONTACT_LIMITS.message.max}
                        </span>
                      </div>
                      <textarea
                        {...fieldA11y('message')}
                        rows={6}
                        maxLength={CONTACT_LIMITS.message.max}
                        placeholder="Tell me a bit about the role or project…"
                        className={`${fieldClass('message')} resize-y`}
                      />
                      {renderError('message')}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      aria-busy={loading}
                      className="w-full bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 text-sm sm:text-base font-semibold py-3 px-6 rounded-xl transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                          </svg>
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                      Prefer email? Write to{' '}
                      <a href={`mailto:${SITE.email}`} className="text-gray-300 hover:text-white underline underline-offset-2">
                        {SITE.email}
                      </a>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            {/* Contact Information */}
            <div className="glass-3d rounded-2xl p-6 sm:p-8 hover:border-white/30 transition-all duration-300">
              <h3 className="relative z-10 text-white text-xl sm:text-2xl font-bold mb-6">
                Contact Information
              </h3>
              <div className="relative z-10 space-y-5">
                {/* Email */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="glass-3d-disc w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan- relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm sm:text-base font-semibold mb-1">Email:</p>
                    <p className="text-gray-300 text-xs sm:text-sm mb-1 break-all">sajol.rhenel123@gmail.com</p>
                    <a
                      href="mailto:sajol.rhenel123@gmail.com"
                      className="text-cyan- hover:text-cyan- text-xs sm:text-sm transition-colors"
                    >
                      Send an email
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="glass-3d-disc w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan- relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm sm:text-base font-semibold mb-1">Phone:</p>
                    <p className="text-gray-300 text-xs sm:text-sm mb-1">09536145105</p>
                    <a
                      href="tel:09536145105"
                      className="text-cyan- hover:text-cyan- text-xs sm:text-sm transition-colors"
                    >
                      Give me a call
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="glass-3d-disc w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan- relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="glass-3d rounded-2xl p-6 sm:p-8 hover:border-white/30 transition-all duration-300">
              <h3 className="relative z-10 text-white text-xl sm:text-2xl font-bold mb-4">
                Available For
              </h3>
              <ul className="relative z-10 space-y-3">
                <li className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0"></span>
                  <span className="text-white text-sm sm:text-base">Freelance</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0"></span>
                  <span className="text-white text-sm sm:text-base">Web Development Projects</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] shrink-0"></span>
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

