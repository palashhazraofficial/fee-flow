const mongoose = require('mongoose');

const userOTP_schema = new mongoose.Schema ({
    userEmail: {type: String, required: true},
    userOTP: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, expires: 300}
});

module.exports = mongoose.model("userOTP", userOTP_schema);