const nodemailer = require('nodemailer');
require('dotenv').config();

const EMAIL_ID = process.env.EMAIL_ID;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

async function send_OTP_via_email(userEmail, OTP) {
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_ID,
            pass: EMAIL_APP_PASSWORD
        }
    });

    const text_msg = `${OTP} is your OTP to login into FeeFlow dashboard. It's only stays for 6 minutes. Don't share it with anyone.`
    const htmlContent = 
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Email</title>
    </head>
    <body>

        <table style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">

            <tr>
                <th style="font-size: 20px; height: fit-content; width: 100%; border-bottom: 2px solid rgba(0, 0, 0, 0.603); background-color: black; color:#DE350B; padding: 10px; font-weight: bold;">FeeFlow</th>
            </tr>
            <tr>
                <td style="font-size: 15px; height: fit-content; width: 100%; background-color: black; color: white; padding: 10px;">${text_msg}</td>
            </tr>

        </table>

    </body>
    </html>`

    const mailOptions = {
        from: EMAIL_ID,
        to: userEmail,
        subject: 'FeeFlow Login OTP',
        html: htmlContent
    };

    try {
        const sendOTP = await transporter.sendMail(mailOptions);
        return sendOTP;
    } catch(err) {
        throw err;
    }

}

module.exports = send_OTP_via_email;