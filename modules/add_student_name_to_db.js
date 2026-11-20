const studentList = require('../database/studentList_schema.js');

async function add_student_name_to_db (studentName, studentPhNo, WhatsAppNotifications, MessageLanguage, batchName, user_id) {

    try {

        const newstudent = new studentList ({
            studentName,
            studentPhNo,
            WhatsAppNotifications,
            MessageLanguage,
            batchName,
            user_id
        });
        return await newstudent.save();

    } catch (err) {

        throw err;

    }

}

module.exports = add_student_name_to_db;