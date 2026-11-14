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
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.1/css/all.min.css" integrity="sha512-QeR2VH+lsBE5LSAe1Q5EnTBbe7XTBubt8dG93Y7gidSgdMCr8nVqKcfKAMyN96SV8KDbZVTDXChatu5G2KQGzg==" crossorigin="anonymous" referrerpolicy="no-referrer">
            <title></title>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; padding: 18px; border: 1px solid #eee; border-radius: 9px;">

                <h1 style="letter-spacing: 5px; color: #DE350B;">FeeFlow</h1>
                <h2>Login Verification</h2>
                <p>Use the following OTP to log in to your account:</p>
                <h1 style="letter-spacing: 5px; color: #DE350B;">${OTP}</h1>
                <p>This code is valid for 6 minutes. Please do not share it with anyone.</p>

                <div style="display: flex; flex-direction: row; justify-content: space-evenly; padding: 18px; border-top: 1px solid #eee;">
                    <h4>Developer: </h4>
                    <a href="https://www.linkedin.com/in/palashhazraofficial/" style="text-decoration: none; color: #eee;"><i class="fa-brands fa-linkedin"></i></a>
                    <a href="https://x.com/realpalashhazra"><i class="fa-brands fa-square-x-twitter"></i></a>
                </div>
            </div>
        </body>
        </html>
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
