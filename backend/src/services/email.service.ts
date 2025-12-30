import nodemailer from 'nodemailer';
import logger from '../utils/logger.ts';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    if (!emailUser || emailUser === 'your-actual-email@gmail.com' || !emailUser.includes('@gmail.com')) {
      logger.warn('EMAIL_USER not configured properly in .env file');
      // Don't throw error, just log warning to allow app to start
      this.transporter = null as any;
      return;
    }
    
    if (!emailPass || emailPass === 'your-16-character-app-password' || emailPass.length < 10) {
      logger.warn('EMAIL_PASS not configured properly in .env file');
      // Don't throw error, just log warning to allow app to start
      this.transporter = null as any;
      return;
    }
    
    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      
      logger.info(`Email service initialized with user: ${emailUser}`);
    } catch (error: any) {
      logger.error(`Failed to initialize email service: ${error.message}`);
      this.transporter = null as any;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    if (!this.transporter) {
      logger.error('Email service not configured - cannot send password reset email');
      throw new Error('Email service unavailable');
    }
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/auth/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - RentEase',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4f46e5; color: white; padding: 20px; text-align: center;">
            <h1>🏢 RentEase</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #111827;">Password Reset Request</h2>
            <p style="color: #6b7280; line-height: 1.6;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #4f46e5; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
            </p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
              If the button doesn't work, copy and paste this link: ${resetUrl}
            </p>
          </div>
        </div>
      `
    };

    try {
      logger.info(`Attempting to send email to: ${email}`);
      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Password reset email sent successfully to: ${email}`, result.messageId);
    } catch (error: any) {
      logger.error(`Failed to send email to ${email}:`, error);
      throw new Error(`Failed to send reset email: ${error.message}`);
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('Email service connection verified successfully');
      return true;
    } catch (error: any) {
      logger.error('Email service connection failed:', error);
      return false;
    }
  }
}

export default new EmailService();