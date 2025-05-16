import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body in HTML format
 * @returns {Promise} - Promise that resolves with the send info
 */
export const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"TaskBoard Pro" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send project invitation email
 * @param {Object} options - Email details
 * @param {string} options.email - Recipient email
 * @param {string} options.projectName - Project name
 * @param {string} options.inviterName - Name of the person who sent the invitation
 * @param {string} options.invitationLink - Link to accept the invitation
 */
export const sendProjectInvitation = async ({ email, projectName, inviterName, invitationLink }) => {
  const subject = `You've been invited to join "${projectName}" on TaskBoard Pro`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Project Invitation</h2>
      <p>Hello,</p>
      <p>${inviterName} has invited you to collaborate on the project <strong>"${projectName}"</strong> on TaskBoard Pro.</p>
      <p>Click the button below to join the project and start collaborating:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${invitationLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Accept Invitation
        </a>
      </div>
      <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
      <p><a href="${invitationLink}">${invitationLink}</a></p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="font-size: 12px; color: #64748b;">
        This is an automated message from TaskBoard Pro. Please do not reply to this email.
      </p>
    </div>
  `;
  
  return sendEmail({ to: email, subject, html });
};

/**
 * Send task assignment notification email
 * @param {Object} options - Email details
 * @param {string} options.email - Recipient email
 * @param {string} options.taskTitle - Task title
 * @param {string} options.projectName - Project name
 * @param {string} options.assignerName - Name of person who assigned the task
 * @param {string} options.dueDate - Task due date (optional)
 * @param {string} options.taskLink - Link to the task
 */
export const sendTaskAssignment = async ({ email, taskTitle, projectName, assignerName, dueDate, taskLink }) => {
  const subject = `Task assigned to you: "${taskTitle}" on TaskBoard Pro`;
  
  let dueDateText = '';
  if (dueDate) {
    dueDateText = `<p>Due date: <strong>${new Date(dueDate).toLocaleDateString()}</strong></p>`;
  }
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Task Assignment</h2>
      <p>Hello,</p>
      <p>${assignerName} has assigned a task to you on TaskBoard Pro.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Task:</strong> ${taskTitle}</p>
        <p style="margin: 0 0 10px 0;"><strong>Project:</strong> ${projectName}</p>
        ${dueDateText}
      </div>
      <p>Click the button below to view the task details:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${taskLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          View Task Details
        </a>
      </div>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="font-size: 12px; color: #64748b;">
        This is an automated message from TaskBoard Pro. Please do not reply to this email.
      </p>
    </div>
  `;
  
  return sendEmail({ to: email, subject, html });
};
