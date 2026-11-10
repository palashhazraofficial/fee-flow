const mongoose = require('mongoose');

const userprofiles_schema = new mongoose.Schema ({
    userName: {type: String, required: true},
    userPhNo: {type: String, required: true},
    userEmail: {type: String, required: true},
});

module.exports = mongoose.model("userprofiles", userprofiles_schema);