const paymentHistory = require('../database/paymentHistory_schema.js');

async function fetch_data_from_paymentHistory(student_id, user_id) {
    
    try {

        const studentDuePayments = await paymentHistory.find({
            student_id,
            teacher_id: user_id,
            paymentDone: false
        });
        return studentDuePayments; 

    } catch (err) {
        throw err;
    }

}

module.exports = fetch_data_from_paymentHistory;