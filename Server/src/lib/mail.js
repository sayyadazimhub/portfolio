import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const credentialsAreValid = Boolean(emailUser && emailPass);
const clientErrorMessage = !credentialsAreValid
  ? 'Email credentials are not configured. Set EMAIL_USER and EMAIL_PASS.'
  : null;

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for 587
  auth: {
    user: emailUser,
    pass: emailPass, // Use Gmail App Password
  },
});

/**
 * Send Email Function
 * @param {Object} options
 * @param {string} options.to - Receiver email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 */
const sendEmail = async ({ to, subject, text, html }) => {
  if (!credentialsAreValid) {
    console.error('Error sending email:', clientErrorMessage);
    return {
      success: false,
      error: clientErrorMessage,
    };
  }
  try {
    const mailOptions = {
      from: `"Sayyad Azim's Portfolio" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error("Error sending email:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

export default sendEmail;