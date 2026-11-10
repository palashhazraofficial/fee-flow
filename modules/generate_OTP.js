const crypto = require('crypto');
const userOTP = require('../database/userOTP_schema.js');
const send_OTP_via_email = require('./send_OTP_via_email.js');

async function generate_OTP(userEmail) {

    try {

        await userOTP.deleteMany({userEmail});

        const OTP = crypto.randomInt(100000, 1000000).toString();

        const newOTP = new userOTP ({
            userEmail, 
            userOTP : OTP,
        });
        await newOTP.save();

        const sendOTP = await send_OTP_via_email(userEmail, OTP);

        return sendOTP;

    } catch (err) {
        throw err;
    }

}

module.exports = generate_OTP;