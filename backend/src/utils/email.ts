import nodemailer from 'nodemailer';
import logger from './logger.ts';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendPasswordResetEmail = async (email: string, name: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/auth/reset-password?token=${token}`;
  
  // Debug email configuration
  logger.info(`Email config: host=${process.env.SMTP_HOST || 'smtp.gmail.com'}, user=${process.env.EMAIL_USER}`);
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@rentease.com',
    to: email,
    subject: 'Password Reset Request - RentEase',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>You requested a password reset for your RentEase account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">RentEase - Your trusted rental platform</p>
      </div>
    `
  };

  try {
    logger.info(`Attempting to send email to: ${email}`);
    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent successfully to: ${email}`);
  } catch (error: any) {
    logger.error(`Failed to send password reset email: ${error.message}`);
    logger.error(`Full error:`, error);
    throw new Error('Failed to send reset email');
  }
};