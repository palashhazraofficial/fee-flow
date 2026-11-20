const mongoose = require('mongoose');

const studentList_schema = new mongoose.Schema ({
    studentName: {type: String, required: true},
    studentPhNo: {type: String, required: true},
    WhatsAppNotifications: {type: Boolean, required: true},
    MessageLanguage: {type: String, requried: true},
    batchName: {type: String, required: true},
    user_id: {type: String, required: true},
});

module.exports = mongoose.model("studentList", studentList_schema);