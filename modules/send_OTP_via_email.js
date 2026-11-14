const { BrevoClient } = require('@getbrevo/brevo');
require('dotenv').config();

const GMAIL_API_BERVO = process.env.GMAIL_API_BERVO;
const FEEFLOW_GMAIL_ID = process.env.FEEFLOW_GMAIL_ID;

const brevo = new BrevoClient({
  apiKey: GMAIL_API_BERVO,
});

async function send_OTP_via_email(userEmail, OTP) {

  try {

    const response = await brevo.transactionalEmails.sendTransacEmail({

      subject: 'Your Login Verification Code',

      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2>Login Verification</h2>
          <p>Use the following OTP to log in to your account:</p>
          <h1 style="letter-spacing: 5px; color: #0066cc;">${OTP}</h1>
          <p>This code is valid for 5 minutes. Please do not share it with anyone.</p>
        </div>
      `,

      sender: {
        name: 'Team FeeFlow',
        email: FEEFLOW_GMAIL_ID,
      },

      to: [{ email: userEmail }],

    });

    return { success: true, messageId: response.messageId };

  } catch (error) {

    console.error('Error sending OTP via Brevo:', error);
    return { success: false, error: error.message };

  }

}

module.exports = send_OTP_via_email;

