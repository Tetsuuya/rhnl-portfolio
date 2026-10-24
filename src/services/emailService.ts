import { supabase } from './supabaseClient';

export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const emailService = {
  /**
   * Securely saves contact form inquiries into Supabase contact_messages table.
   * Completely avoids exposing secret email/SMTP API keys in client-side bundles.
   */
  async sendEmail(data: EmailData): Promise<void> {
    const trimmedName = data.name.trim();
    const trimmedEmail = data.email.trim();
    const trimmedSubject = data.subject.trim();
    const trimmedMessage = data.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      throw new Error('All fields are required.');
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error('Please enter a valid email address (e.g. name@gmail.com).');
    }

    const { error } = await supabase.from('contact_messages').insert([
      {
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Failed to submit message to Supabase:', error.message);
      throw new Error(
        'Unable to send message at this time. Please try again or email directly at sajol.rhenel123@gmail.com'
      );
    }
  },
};
