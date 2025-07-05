
'use server';

import { Resend } from 'resend';
import WelcomeEmail from '@/emails/WelcomeEmail';

const fromEmail = 'onboarding@resend.dev';

export const sendWelcomeEmail = async (toEmail: string, name: string) => {
  const resendApiKey = process.env.RESEND_API_KEY;

  // More robust check for a valid API key.
  // It checks if the key is missing, is a placeholder, or is obviously invalid.
  if (!resendApiKey || resendApiKey.includes('your-resend-api-key')) {
    console.warn(`
    ********************************************************************************
    *
    *      RESEND EMAIL SKIPPED
    *
    *      To: ${toEmail}
    *      Subject: Welcome to Ahia!
    *
    *      Reason: RESEND_API_KEY is missing or is a placeholder in your .env file.
    *      This is not an error, the app will continue to function.
    *
    ********************************************************************************
    `);
    // We return a success-like object to prevent breaking the registration flow.
    return { data: null, error: null };
  }
  
  try {
    // Initialize Resend here, only when we're sure the key is likely valid.
    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: `Ahia <${fromEmail}>`,
      to: [toEmail],
      subject: 'Welcome to Ahia!',
      react: WelcomeEmail({ name }),
    });

    if (error) {
      console.error('Error sending welcome email via Resend:', error);
      // Return a structured error but do not throw, to avoid crashing the caller.
      return { data: null, error: { name: 'ResendError', message: error.message } };
    }

    console.log(`Welcome email sent to ${toEmail}: ${data?.id}`);
    return { data, error: null };

  } catch (error: unknown) {
    console.error('An unexpected error occurred in sendWelcomeEmail:', error);
    // This catches errors from the Resend constructor or other unexpected issues.
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { data: null, error: { name: 'UnexpectedError', message } };
  }
};
