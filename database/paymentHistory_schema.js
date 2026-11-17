const mongoose = require('mongoose');

const paymentHistory_schema = new mongoose.Schema ({
    student_id: {type: String, required: true},
    teacher_id: {type: String, required: true},
    studentName: {type: String, required: true},
    batchName: {type: String, required: true},
    paymentMonth: {type: String, required: true},
    paymentYear: {type: String, required: true},
    paymentDone: {type: Boolean, required: true},
    paymentSuccessDate: {type: String}
});

module.exports = mongoose.model("paymentHistory", paymentHistory_schema);