const paymentHistory = require('../database/paymentHistory_schema.js');

async function markaspaid_payment(teacher_id, student_id) {
    
    try {

        const markaspaid = await paymentHistory.findOneAndUpdate(
            
            {
                teacher_id,
                student_id,
                paymentDone: false
            },

            {
                $set: {paymentDone: true}
            },

            {
                returnDocument: 'after',
                runValidators: true
            }

        )

        return markaspaid;

    } catch (err) {
        throw err;
    }

}

module.exports = markaspaid_payment;