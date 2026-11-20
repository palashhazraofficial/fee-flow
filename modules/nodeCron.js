const nodeCron = require('node-cron');
const studentList = require('../database/studentList_schema.js');
const paymentHistory = require('../database/paymentHistory_schema.js');

// 5 0 1 * * => 12:05AM of 1st date of every month or every week
nodeCron.schedule("*/6 * * * *", async () => {

    console.log("Starting Monthly Payment Checking...");
    console.log("Updating paymentHistory...");
    
    try {
        
        const students = await studentList.find();
        const studentsLength = students.length;

        let paymentMonth = null;
        let paymentYear = null;

        if ((new Date().getMonth()) === 0) {
            paymentMonth = 12;
            paymentYear = ((new Date().getFullYear())-1);
        } else {
            paymentMonth = (new Date().getMonth());
            paymentYear = (new Date().getFullYear());
        }

        const paymentDone = false;
        const paymentSuccessDate = null;

        let i = 0;
        for (const eachStudent of students) {

            const student_id = eachStudent._id.toString();
            const teacher_id = eachStudent.user_id;
            const studentName = eachStudent.studentName;
            const batchName = eachStudent.batchName;

            const newPaymentHisory = new paymentHistory({
                student_id,
                teacher_id,
                studentName,
                batchName,
                paymentMonth,
                paymentYear,
                paymentDone,
                paymentSuccessDate
            })

            await newPaymentHisory.save();

            i++;
            let percentage = ((i/studentsLength)*100).toFixed(2);
            console.log(`${percentage}%`);

        }

        console.log("Monthly Payment Checking Is Done.")
        console.log("paymentHistory Is Updated Successfully.")

    } catch (err) {
        console.log("Error While Updating paymentHistory/ Running node-cron: ", err);
    }

}, {
    timezone: "Asia/Kolkata"
});