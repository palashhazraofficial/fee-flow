const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
require('dotenv').config();

const check_user_by_email = require('./modules/check_user_by_email.js');
const find_user_by_email = require('./modules/find_user_by_email.js');
const generate_OTP = require('./modules/generate_OTP.js');
const check_OTP = require('./modules/check_OTP.js');
const add_batchName_to_db = require('./modules/add_batchName_to_db.js');
const fetch_batchName_from_db = require('./modules/fetch_batchName_from_db.js');
const add_student_name_to_db = require('./modules/add_student_name_to_db.js');
const fetch_student_list_from_db = require('./modules/fetch_student_list_from_db.js');
const fetch_data_from_paymentHistory = require('./modules/fetch_data_from_paymentHistory.js');
require('./modules/nodeCron.js');

const app = express();

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', 'views');

const MONGODB_URL = process.env.MONGODB_URL;
const SECRET_SESSION_KEY = process.env.SECRET_SESSION_KEY;
const SESSION_EXPIRY_TIME = Number(process.env.SESSION_EXPIRY_TIME);

const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'sessions',
    expires: SESSION_EXPIRY_TIME,
});

app.use(session({
    secret: SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        maxAge: SESSION_EXPIRY_TIME,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // change to true while publish
        sameSite: 'lax'
    }
}));

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "public")));

app.post('/login/verify-otp/verify', async (req, res) => {

    if(!req.session.isLoggedIn) {

        const userEmail = req.body.userEmail.trim();
        const OTP = req.body.OTP.trim();

        try {

            const OTPMatched = await check_OTP(userEmail, OTP);
            if (OTPMatched) {
                const matchedProfile = await find_user_by_email(userEmail);
                req.session.userName = matchedProfile.userName;
                req.session.userEmail = matchedProfile.userEmail;
                req.session.userPhNo = matchedProfile.userPhNo;
                req.session._id = matchedProfile._id.toString();
                req.session.isLoggedIn = true;
                req.flash('success_msg', "Welcome Back! Good to see you");
                req.session.save((err) => {
                    if (err) {
                        console.log("Error occurred while saving session: ", err);
                    }
                    return res.redirect('/dashboard');
                })
            } else {
                req.flash('error_msg', "OTP is not valid! Please retry");
                req.session.save((err) => {
                    if (err) {
                        console.log("Error occurred while saving session: ", err);
                    }
                    return res.redirect('/login');
                })
            }

        } catch (err) {
            console.log("Error while verifing OTP: ", err);
            req.flash('error_msg', "Internal server error! Please try again");
            req.session.save((err) => {
                if (err) {
                    console.log("Error occurred while saving session: ", err);
                }
                return res.redirect('/login');
            })
        }

    } else {
        return res.redirect('/dashboard');
    }

})

app.post('/login/verify-otp', async (req, res) => {

    if (!req.session.isLoggedIn) {

        const userEmail = req.body.userEmail.trim();
        const userExists = await check_user_by_email(userEmail);

        if (userExists) {

            try {
                await generate_OTP(userEmail);
                return res.render('verifyOTP', {userEmail});
            } catch (err) {
                console.log("Error while generating OTP: ", err);
                req.flash('error_msg', "Internal server problem! Please try again");
                req.session.save((err) => {
                    if (err) {
                        console.log("Error occurred while saving session: ", err);
                    }
                    return res.redirect('/');
                })
            
            }
        
        } else {
            req.flash('error_msg', "Invalid email id! Please recheck");
            req.session.save((err) => {
                if (err) {
                    console.log("Error occurred while saving session: ", err);
                }
                return res.redirect('/login');
            })
        }

    } else {
        return res.redirect('/dashboard');
    }

})

app.post('/add/add-batch', async (req, res) => {

    if (req.session.isLoggedIn) {

        const user_id = req.body.user_id;
        const batchName = req.body.batchName;

        try {

            await add_batchName_to_db(batchName, user_id);
            req.flash('success_msg', "Batch added successfully");
            req.session.save((err) => {
                if (err) {
                    console.log("Error occurred while saving session: ", err);
                }
                return res.redirect('/add/add-batch');
            })

        } catch(err) {

            console.log("Error while adding batchName to database: ", err);
            req.flash('error_msg', "Internal error! Batch not added");
            req.session.save((err) => {
                if (err) {
                    console.log("Error occurred while saving session: ", err);
                }
                return res.redirect('/add/add-batch');
            })

        }
        
    } else {
        return res.redirect('/');
    }

})

app.post('/add/add-student/:user_id/:batchName', async (req, res) => {

    if (req.session.isLoggedIn) {

        const studentName = req.body.studentName;
        const studentPhNo = req.body.studentPhNo;
        const WhatsAppNotifications = req.body.WhatsAppNotifications;
        const batchName = req.body.batchName;
        const user_id = req.body.user_id;

        try {

            await add_student_name_to_db(studentName, studentPhNo, WhatsAppNotifications, batchName, user_id);
            req.flash('success_msg', "Student saved!");
            req.session.save((err) => {
                if (err) {
                    console.log("Error occurred while saving session: ", err);
                }
                return res.redirect(`/add/add-student/${user_id}/${batchName}`);
            })

        } catch(err) {

            console.log("Error while saving student data to db: ", err);
            req.flash('error_msg', "Internal error occured! Student data does not save");
            req.session.save((err) => {
                if (err) {
                    console.log("Error occurred while saving session: ", err);
                }
                return res.redirect(`/add/add-student/${user_id}/${batchName}`);
            })

        }

    } else {
        return res.redirect('/');
    }
})

app.get('/dashboard', (req, res) => {

    if (req.session.isLoggedIn) {
        return res.render('dashboard');
    } else {
        return res.redirect('/');
    }
    
})

app.get('/add/add-batch', (req, res) => {

    if (req.session.isLoggedIn) {
        const user_id = req.session._id;
        return res.render('add-addbatch', {user_id});
    } else {
        return res.redirect('/');
    }
    
})

app.get('/add/add-student', async (req, res) => {

    if (req.session.isLoggedIn) {

        const user_id = req.session._id;
        try {

            const fetchedData = await fetch_batchName_from_db(user_id);
            return res.render('add-addstudent', {user_id, fetchedData});

        } catch(err) {

            console.log("Error while fetching data from batchName schema: ", err);
            req.flash('error_msg', "Internal error! No batch found");
            req.session.save((err) => {
                if (err) {
                    console.log("Error occurred while saving session: ", err);
                }
                return res.redirect('/add/add-batch');
            })

        }

    } else {
        return res.redirect('/');
    }
    
})

app.get('/add/add-student/:user_id/:batchName', (req, res) => {

    if (req.session.isLoggedIn) {
        const user_id = req.params.user_id;
        const batchName = req.params.batchName;
        return res.render('add-addstudent-add', {user_id, batchName});
    } else {
        return res.redirect('/');
    }
    
})

app.get('/manage/:user_id/:batchName', async (req, res) => {

    if (req.session.isLoggedIn) {
        const user_id = req.params.user_id;
        const batchName = req.params.batchName;

        try {
            const studentData = await fetch_student_list_from_db(batchName, user_id);
            return res.render('manage-studentList', {studentData});
        } catch(err) {
            console.log("Error while fetching data from db: ", err);
            req.flash('error_msg', "Internal error occured! Student data not found");
            req.session.save((err) => {
                if (err) {
                    console.log("Error occurred while saving session: ", err);
                }
                return res.redirect('/manage');
            })
        }

    } else {
        return res.redirect('/');
    }

})

app.get('/manage/:user_id/:batchName/:student_id/:studentName', async (req, res) => {

    if (req.session.isLoggedIn) {

        const user_id = req.params.user_id;
        const batchName = req.params.batchName;
        const student_id = req.params.student_id;
        const studentName = req.params.studentName;

        try {
            const studentDuePayments = await fetch_data_from_paymentHistory(student_id, user_id);
            return res.render('each-student-dashboard', {user_id, batchName, student_id ,studentName, studentDuePayments});
        } catch (err) {
            console.log("Error while fetching data from paymentHistory: ", err);
            req.flash('error_msg', "Internal error occured! Student data not found");
            req.session.save((err) => {
                if (err) {
                    console.log("Error occurred while saving session: ", err);
                }
                return res.redirect(`/manage/${user_id}/${batchName}`);
            })
        }

    } else {
        return res.redirect('/');
    }

})

app.get('/manage', async (req, res) => {

    if (req.session.isLoggedIn) {
        try {
            const user_id = req.session._id;
            const fetchedData = await fetch_batchName_from_db(user_id);
            return res.render('manage', {fetchedData});
        } catch (err) {
            console.log("Error while fetching data from db: ", err);
            req.flash('error_msg', "Internal error occured! Batch data not found");
            req.session.save((err) => {
                if (err) {
                    console.log("Error occurred while saving session: ", err);
                }
                return res.redirect('/dashboard');
            })
        }
    } else {
        return res.redirect('/');
    }
    
})

app.get('/more', (req, res) => {

    if (req.session.isLoggedIn) {
        return res.render('more');
    } else {
        return res.redirect('/');
    }
    
})

app.get('/login', (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.render('login');
    } else {
        return res.redirect('/dashboard');
    }
})

app.get('/', (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.render('home');
    } else {
        return res.redirect('/dashboard');
    }
});

const PORT = 3000;
mongoose.connect(MONGODB_URL).then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`server is running at http://localhost:${PORT}`);
    })
}).catch((err) => {
    console.log("Error while connecting to MongoDB: ", err);
})
