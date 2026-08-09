// sendEmail utility
// This module is a placeholder for email sending functionality.
// To enable real emails, install nodemailer: npm install nodemailer
// and configure the environment variables below.
//
// Required .env variables:
//   EMAIL_HOST=smtp.gmail.com
//   EMAIL_PORT=587
//   EMAIL_USER=your_email@gmail.com
//   EMAIL_PASS=your_app_password
//   EMAIL_FROM=no-reply@yourdomain.com

/**
 * Send an email.
 * @param {object} options
 * @param {string} options.to      - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.text    - Plain text body
 * @param {string} [options.html]  - Optional HTML body
 * @returns {Promise<void>}
 */
const sendEmail = async ({ to, subject, text, html }) => {
  // ── Uncomment below after installing nodemailer ──────────────────────────
  // import nodemailer from 'nodemailer';
  //
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: Number(process.env.EMAIL_PORT) || 587,
  //   secure: false,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS,
  //   },
  // });
  //
  // await transporter.sendMail({
  //   from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
  //   to,
  //   subject,
  //   text,
  //   html,
  // });
  // ─────────────────────────────────────────────────────────────────────────

  // Fallback: log to console in development
  console.log(`[sendEmail] To: ${to} | Subject: ${subject}`);
  if (text) console.log(`[sendEmail] Text: ${text}`);
  if (html) console.log(`[sendEmail] HTML: ${html}`);
};

export default sendEmail;
