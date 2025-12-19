interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const emailService = {
  /**
   * Sends an email using Brevo API
   */
  async sendEmail(data: EmailData): Promise<void> {
    const brevoApiKey = getEnvVar('VITE_BREVO_API_KEY');
    const recipientEmail = 'sajol.rhenel123@gmail.com'; // Your email where you want to receive messages

    // Escape HTML to prevent XSS
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const emailPayload = {
      sender: {
        name: 'Portfolio Contact Form',
        email: recipientEmail, // Use verified sender email
      },
      replyTo: {
        email: data.email,
        name: data.name,
      },
      to: [
        {
          email: recipientEmail,
          name: 'Rhenel Jhon Sajol',
        },
      ],
      subject: `Portfolio Contact: ${data.subject}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #ec4899; padding-bottom: 10px;">
              New Contact Form Message
            </h2>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ec4899;">
              <p style="margin: 8px 0; color: #333;">
                <strong style="color: #ec4899;">From:</strong> ${escapeHtml(data.name)}
              </p>
              <p style="margin: 8px 0; color: #333;">
                <strong style="color: #ec4899;">Email:</strong> 
                <a href="mailto:${escapeHtml(data.email)}" style="color: #ec4899; text-decoration: none;">
                  ${escapeHtml(data.email)}
                </a>
              </p>
              <p style="margin: 8px 0; color: #333;">
                <strong style="color: #ec4899;">Subject:</strong> ${escapeHtml(data.subject)}
              </p>
            </div>
            
            <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e5e5; border-radius: 5px; margin-top: 20px;">
              <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">Message:</h3>
              <p style="color: #666; line-height: 1.8; white-space: pre-wrap; margin: 0;">${escapeHtml(data.message)}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #999; font-size: 12px;">
              <p>This message was sent from your portfolio contact form.</p>
              <p>You can reply directly to this email to respond to ${escapeHtml(data.name)}.</p>
            </div>
          </div>
        </div>
      `,
      textContent: `
New Contact Form Message

From: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

---
This message was sent from your portfolio contact form.
You can reply directly to this email to respond to ${data.name}.
      `,
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to send email: ${response.statusText}`
      );
    }
  },
};

