const studentList = require('../database/studentList_schema.js');

async function fetch_student_name_from_db(batchName, user_id) {
    
    try {
        const studentData = await studentList.find({batchName, user_id});
        return studentData;
    } catch(err) {
        throw err;
    }

}

module.exports = fetch_student_name_from_db;