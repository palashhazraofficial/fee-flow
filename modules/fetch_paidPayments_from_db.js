const paymentHistory = require('../database/paymentHistory_schema.js');

async function fetch_paidPayments_from_db(student_id, user_id) {
    
    try {

        const studentPaidPayments = await paymentHistory.find({
            student_id,
            teacher_id: user_id,
            paymentDone: true
        });
        return studentPaidPayments; 

    } catch (err) {
        throw err;
    }

}

module.exports = fetch_paidPayments_from_db;