const userOTP = require('../database/userOTP_schema.js');

async function check_OTP(userEmail, OTP) {

    try {

        const userOTP_doc = await userOTP.findOne({userEmail});

        if (userOTP_doc.userOTP === OTP) {
            return true
        } else {
            return false;
        }

    } catch(err) {
        throw err;
    }

}

module.exports = check_OTP;