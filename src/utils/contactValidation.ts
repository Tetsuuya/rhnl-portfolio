// Single source of truth for contact form rules. The database enforces the same limits
// (see supabase_security.sql), so a bypassed client still can't store bad data.

export interface ContactFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  subject: { min: 3, max: 120 },
  message: { min: 10, max: 2000 },
} as const;

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const normalizeContact = (fields: ContactFields): ContactFields => ({
  name: fields.name.trim().replace(/\s+/g, ' '),
  email: fields.email.trim().toLowerCase(),
  subject: fields.subject.trim().replace(/\s+/g, ' '),
  message: fields.message.trim(),
});

export const validateContactField = (field: keyof ContactFields, raw: string): string | undefined => {
  const value = field === 'email' ? raw.trim().toLowerCase() : raw.trim();

  switch (field) {
    case 'name':
      if (!value) return 'Please enter your name.';
      if (value.length < CONTACT_LIMITS.name.min) return 'Name must be at least 2 characters.';
      if (value.length > CONTACT_LIMITS.name.max) return `Name must be under ${CONTACT_LIMITS.name.max} characters.`;
      if (!/\p{L}/u.test(value)) return 'Name should contain letters.';
      return undefined;
    case 'email':
      if (!value) return 'Please enter your email address.';
      if (/\s/.test(raw.trim())) return 'Email address can’t contain spaces.';
      if (value.length > CONTACT_LIMITS.email.max || !EMAIL_PATTERN.test(value)) {
        return 'Enter a valid email address, like name@example.com.';
      }
      return undefined;
    case 'subject':
      if (!value) return 'Please add a subject.';
      if (value.length < CONTACT_LIMITS.subject.min) return 'Subject must be at least 3 characters.';
      if (value.length > CONTACT_LIMITS.subject.max) return `Subject must be under ${CONTACT_LIMITS.subject.max} characters.`;
      return undefined;
    case 'message':
      if (!value) return 'Please write a message.';
      if (value.length < CONTACT_LIMITS.message.min) return `Message must be at least ${CONTACT_LIMITS.message.min} characters.`;
      if (value.length > CONTACT_LIMITS.message.max) return `Message must be under ${CONTACT_LIMITS.message.max} characters.`;
      return undefined;
  }
};

export const validateContact = (fields: ContactFields): ContactErrors => {
  const errors: ContactErrors = {};
  (Object.keys(fields) as (keyof ContactFields)[]).forEach((field) => {
    const error = validateContactField(field, fields[field]);
    if (error) errors[field] = error;
  });
  return errors;
};
