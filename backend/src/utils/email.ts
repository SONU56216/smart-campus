import nodemailer from 'nodemailer';

// Create a transporter using environment variables with graceful fallback
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }

  // Developer Ethereal email or simulated logger if no custom SMTP provided
  return {
    sendMail: async (options: any) => {
      console.log('===================================================');
      console.log(`[EMAIL DISPATCH] To: ${options.to}`);
      console.log(`[EMAIL DISPATCH] Subject: ${options.subject}`);
      console.log(`[EMAIL DISPATCH] HTML Preview Excerpt:\n${options.html.substring(0, 400)}...\n[Truncated]`);
      console.log('===================================================');
      return { messageId: `local-simulated-id-${Date.now()}` };
    }
  } as any;
};

const transporter = createTransporter();
const EMAIL_FROM = process.env.SMTP_FROM || '"CampusPass System" <no-reply@campuspass.edu>';
const COLLEGE_NAME = 'CAMPUSPASS UNIVERSITY';
const PRIMARY_COLOR = '#6200EE'; // CampusM3PrimaryPurple
const ACCENT_COLOR = '#3700B3'; // CampusM3DeepPurple

/**
 * Base email layout wrapper with professional styling
 */
const getHtmlLayout = (content: string, title: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f6f9fc;
          margin: 0;
          padding: 0;
          color: #333333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e1e8ed;
        }
        .header {
          background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${ACCENT_COLOR} 100%);
          padding: 30px;
          text-align: center;
          color: #ffffff;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }
        .header p {
          margin: 5px 0 0 0;
          font-size: 12px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
          line-height: 1.6;
        }
        .content h2 {
          color: ${ACCENT_COLOR};
          font-size: 20px;
          margin-top: 0;
        }
        .btn {
          display: inline-block;
          background-color: ${PRIMARY_COLOR};
          color: #ffffff !important;
          text-decoration: none;
          padding: 12px 28px;
          border-radius: 8px;
          font-weight: bold;
          margin: 25px 0;
          font-size: 15px;
          text-align: center;
        }
        .btn:hover {
          background-color: ${ACCENT_COLOR};
        }
        .footer {
          background-color: #f8fafc;
          padding: 24px 30px;
          text-align: center;
          border-top: 1px solid #eaedf0;
          font-size: 11px;
          color: #718096;
        }
        .footer p {
          margin: 4px 0;
        }
        .highlight {
          background-color: #f0ebfa;
          border-left: 4px solid ${PRIMARY_COLOR};
          padding: 15px;
          margin: 20px 0;
          font-size: 14px;
          border-radius: 0 8px 8px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${COLLEGE_NAME}</h1>
          <p>Smart Digital Campus Ecosystem</p>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>This is an automated notification from the CampusPass administration system.</p>
          <p>Please do not reply directly to this email.</p>
          <p>&copy; ${new Date().getFullYear()} ${COLLEGE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Sends a generic HTML or Text email
 */
export const sendEmail = async (to: string, subject: string, html: string, text?: string): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
      text: text || subject
    });
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    return false;
  }
};

/**
 * Sends a welcome email upon successful registration with student credentials
 */
export const sendWelcomeEmail = async (student: { email: string; fullName: string; studentId: string; rollNumber: string }): Promise<boolean> => {
  const content = `
    <h2>Welcome to CampusPass, ${student.fullName}!</h2>
    <p>Your digital identity profile has been successfully provisioned within the Smart Campus Ecosystem.</p>
    <p>You can now use your credentials to access the CampusPass mobile app and Web portal to control services, manage library materials, pay semesters, and generate electronic ID credentials.</p>
    
    <div class="highlight">
      <strong>Your Campus Credentials:</strong><br>
      • <strong>Student ID:</strong> ${student.studentId}<br>
      • <strong>Roll Number:</strong> ${student.rollNumber}<br>
      • <strong>Digital Email:</strong> ${student.email}
    </div>

    <p>To begin, please sign in to the application and issue your standard Digital ID Card through the home dashboard.</p>
  `;
  const html = getHtmlLayout(content, 'Welcome to CampusPass');
  return sendEmail(student.email, `Welcome to ${COLLEGE_NAME} - Digital ID Initiated`, html);
};

/**
 * Sends a One-Time Password for resetting passwords
 */
export const sendPasswordResetOTP = async (email: string, fullName: string, otp: string): Promise<boolean> => {
  const content = `
    <h2>Password Change Request</h2>
    <p>Hello ${fullName},</p>
    <p>We received an authentication request to reset your Password. Please use the verification code below to authorize this change. This code will expire in 10 minutes.</p>
    
    <div class="highlight" style="text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 5px; color: ${PRIMARY_COLOR};">
      ${otp}
    </div>

    <p>If you did not initiate this request, you can safely ignore this email; your security credentials remain perfectly safe.</p>
  `;
  const html = getHtmlLayout(content, 'Password Reset OTP');
  return sendEmail(email, `CampusPass Access OTP: ${otp}`, html);
};

/**
 * Sends an alert notification if a Digital Card is reported blocked or suspended
 */
export const sendCardBlockedEmail = async (student: { email: string; fullName: string; studentId: string }, reason: string): Promise<boolean> => {
  const content = `
    <h2>Digital ID Card Suspended</h2>
    <p>Dear ${student.fullName},</p>
    <p>Your CampusPass Digital ID Card associated with student record <strong>${student.studentId}</strong> has been suspended.</p>
    
    <div class="highlight" style="color: #c53030; background-color: #fff5f5; border-left-color: #e53e3e;">
      <strong>Action Taken:</strong> Suspension & Block<br>
      <strong>Reason specified:</strong> ${reason}<br>
      <strong>Date/Time:</strong> ${new Date().toLocaleString()}
    </div>

    <p>If this was not authorized or you want to request reissue, please visit the physical Registrar's Office immediately with alternative credentials.</p>
  `;
  const html = getHtmlLayout(content, 'Card Blocked Notification');
  return sendEmail(student.email, `URGENT: CampusPass ID Suspended`, html);
};

/**
 * Sends a receipt invoice upon a successful fee/wallet transaction
 */
export const sendPaymentReceipt = async (
  student: { email: string; fullName: string; studentId: string },
  payment: { transactionId: string; purpose: string; amount: number; paymentGateway: string }
): Promise<boolean> => {
  const content = `
    <h2>Payment Receipt Confirmation</h2>
    <p>Dear ${student.fullName},</p>
    <p>We have successfully processed your campus fee payment. Your transaction records are completely updated.</p>
    
    <div class="highlight">
      <strong>Receipt Breakdown:</strong><br>
      • <strong>Transaction ID:</strong> ${payment.transactionId}<br>
      • <strong>Purpose:</strong> ${payment.purpose}<br>
      • <strong>Amount Paid:</strong> ₹${payment.amount.toFixed(2)}<br>
      • <strong>Gateway:</strong> ${payment.paymentGateway}<br>
      • <strong>Timestamp:</strong> ${new Date().toLocaleString()}
    </div>

    <p>The electronic receipt is now accessible and ready for download via the **Transcript & Ledger** portal of the applet.</p>
  `;
  const html = getHtmlLayout(content, 'Payment Receipt Confirmation');
  return sendEmail(student.email, `Receipt for ${payment.purpose}: ${payment.transactionId}`, html);
};

/**
 * Sends email when an exam admit card is approved and released by administration
 */
export const sendAdmitCardReady = async (student: { email: string; fullName: string; studentId: string }, exam: { semester: number; academicYear: string }): Promise<boolean> => {
  const content = `
    <h2>Exam Admit Card Approved & Released</h2>
    <p>Dear ${student.fullName},</p>
    <p>Your Semester end admit card for <strong>Semester ${exam.semester} (${exam.academicYear})</strong> is approved and officially released by the Academic Registrar.</p>
    
    <p>You can view and secure your digital entry ticket inside your mobile application, download the print-ready PDF, or scan the rotative gate entry pass directly from your active session.</p>

    <div class="highlight">
      <strong>Exam Center Location:</strong> Main Academic Block, Main Campus Hall
    </div>

    <p>Please ensure your Digital ID is active on your device when attending the examination venue.</p>
  `;
  const html = getHtmlLayout(content, 'Admit Card Ready');
  return sendEmail(student.email, `Semester ${exam.semester} Admit Card Released`, html);
};

/**
 * Sends approval of an admission application
 */
export const sendApplicationApproved = async (student: { email: string; fullName: string }, applicationNumber: string, course: string): Promise<boolean> => {
  const content = `
    <h2>Congratulations! Application Approved</h2>
    <p>Dear ${student.fullName},</p>
    <p>We are thrilled to inform you that your registration application <strong>${applicationNumber}</strong> for the <strong>${course}</strong> program has been officially approved!</p>
    
    <p>Your provisional student profile has been created, and you are ready for final enrollment. To finalise authentication, please register on the CampusPass mobile platform using this email address or access the portal to generate your dynamic credentials.</p>

    <p>Welcome to our vibrant academic ecosystem!</p>
  `;
  const html = getHtmlLayout(content, 'Admission Application Approved');
  return sendEmail(student.email, `Congratulations! CampusPass Admission Approved`, html);
};
