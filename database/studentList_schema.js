const mongoose = require('mongoose');

const studentList_schema = new mongoose.Schema ({
    studentName: {type: String, required: true},
    studentPhNo: {type: String, required: true},
    studentPhNoType: {type: String, required: true},
    batchName: {type: String, required: true},
    user_id: {type: String, required: true},
});

module.exports = mongoose.model("studentList", studentList_schema);