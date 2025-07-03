'use server';

import { Resend } from 'resend';
import WelcomeEmail from '@/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = 'onboarding@resend.dev';

export const sendWelcomeEmail = async (toEmail: string, name: string) => {
  if (!process.env.RESEND_API_KEY) {
    console.log("RESEND_API_KEY is not set. Skipping email sending.");
    // Log the email content for debugging in dev environments without a key
    console.log({
        to: toEmail,
        from: fromEmail,
        subject: 'Welcome to Ahia!',
        htmlBody: `<h1>Welcome, ${name}!</h1><p>Thanks for joining Ahia.</p>`
    });
    return {
        error: "RESEND_API_KEY is not set."
    };
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: `Ahia <${fromEmail}>`,
      to: [toEmail],
      subject: 'Welcome to Ahia!',
      react: WelcomeEmail({ name }),
    });

    if (error) {
        console.error('Error sending welcome email:', error);
        return { error };
    }

    console.log(`Welcome email sent to ${toEmail}: ${data?.id}`);
    return { data };

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { error };
  }
};
