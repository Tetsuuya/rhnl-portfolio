import { supabase } from './supabaseClient';
import { normalizeContact, validateContact, type ContactFields } from '../utils/contactValidation';
import { SITE } from '../config/site';

export type EmailData = ContactFields;

export const emailService = {
  /**
   * Securely saves contact form inquiries into Supabase contact_messages table.
   * Completely avoids exposing secret email/SMTP API keys in client-side bundles.
   */
  async sendEmail(data: EmailData): Promise<void> {
    const clean = normalizeContact(data);

    // Re-validate here so the service is safe even if called without the form
    const errors = validateContact(clean);
    const firstError = Object.values(errors)[0];
    if (firstError) {
      throw new Error(firstError);
    }

    // created_at and read are set by the database (see supabase_security.sql)
    const { error } = await supabase.from('contact_messages').insert([clean]);

    if (error) {
      console.error('Failed to submit message to Supabase:', error.message);
      if (error.message.includes('rate_limited')) {
        throw new Error(
          `You've already sent a few messages recently. Please try again in an hour, or email ${SITE.email} directly.`
        );
      }
      throw new Error(
        `Unable to send message at this time. Please try again or email directly at ${SITE.email}`
      );
    }
  },
};
