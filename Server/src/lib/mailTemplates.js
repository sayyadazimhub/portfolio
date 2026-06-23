/**
 * Generates the HTML body for the Admin notification email.
 */
export const getAdminNotificationTemplate = ({ name, email, subject, message }) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Inquiry Received</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding: 40px 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); overflow: hidden; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.05em; }
    .header p { color: #94a3b8; margin: 8px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.15em; }
    .content { padding: 32px 24px; }
    .field-group { margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; }
    .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 4px; }
    .field-value { font-size: 15px; color: #0f172a; font-weight: 500; }
    .message-box { background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; font-style: italic; color: #475569; line-height: 1.6; font-size: 15px; margin-top: 8px; white-space: pre-wrap; }
    .button-container { text-align: center; margin-top: 32px; }
    .button { display: inline-block; background-color: #0ea5e9; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none; transition: background-color 0.2s; }
    .footer { background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #64748b; }
    .footer a { color: #0ea5e9; text-decoration: none; font-weight: 500; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <p>Portfolio Connection</p>
        <h1>New Message Received</h1>
      </div>
      <div class="content">
        <div class="field-group">
          <div class="field-label">From Name</div>
          <div class="field-value">${name}</div>
        </div>
        <div class="field-group">
          <div class="field-label">Email Address</div>
          <div class="field-value">${email}</div>
        </div>
        <div class="field-group">
          <div class="field-label">Subject</div>
          <div class="field-value">${subject || 'No Subject Specified'}</div>
        </div>
        <div class="field-group" style="border-bottom: none; padding-bottom: 0;">
          <div class="field-label">Message Content</div>
          <div class="message-box">"${message}"</div>
        </div>
        <div class="button-container">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Inquiry')}" class="button">Reply Directly via Email</a>
        </div>
      </div>
      <div class="footer">
        <p>This message was sent from your portfolio contact form.</p>
        <p>© ${new Date().getFullYear()} Sayyad Azim. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Generates the HTML body for the Visitor auto-confirmation email.
 */
export const getVisitorConfirmationTemplate = ({ name, subject, message, frontendUrl }) => {
  const url = frontendUrl || 'http://localhost:5173';
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank you for reaching out</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding: 40px 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); overflow: hidden; }
    .header { background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 32px 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.03em; }
    .header p { color: #e0f2fe; margin: 8px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; }
    .content { padding: 32px 24px; line-height: 1.6; }
    .content h2 { font-size: 18px; color: #0f172a; font-weight: 600; margin-top: 0; margin-bottom: 16px; }
    .content p { font-size: 15px; color: #475569; margin-bottom: 24px; }
    .summary-box { background-color: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; font-size: 14px; color: #475569; margin-bottom: 24px; }
    .summary-title { font-weight: 700; color: #0f172a; margin-bottom: 8px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
    .summary-text { font-style: italic; white-space: pre-wrap; }
    .button-container { text-align: center; margin-top: 32px; }
    .button { display: inline-block; background-color: #0ea5e9; color: #ffffff; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none; transition: background-color 0.2s; }
    .footer { background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    .footer a { color: #0284c7; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <p>Inquiry Confirmation</p>
        <h1>Thank You for Connecting!</h1>
      </div>
      <div class="content">
        <h2>Hello ${name},</h2>
        <p>I have successfully received your inquiry through my portfolio contact form! I appreciate you taking the time to reach out and will review your message as soon as possible.</p>
        
        <div class="summary-box">
          <div class="summary-title">Your Inquiry Summary</div>
          <div style="margin-bottom: 8px;"><strong>Subject:</strong> ${subject || 'No Subject Specified'}</div>
          <div class="summary-text">"${message}"</div>
        </div>

        <p>I typically respond to inquiries within 24-48 business hours. If your request is urgent, please feel free to connect with me directly via LinkedIn.</p>
        
        <div class="button-container">
          <a href="${url}" class="button">Visit My Portfolio Website</a>
        </div>
      </div>
      <div class="footer">
        <p>You received this email because you submitted a contact form on my portfolio site.</p>
        <p>© ${new Date().getFullYear()} Sayyad Azim. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
};
