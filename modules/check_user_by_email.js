const userprofiles = require('../database/userprofiles_schema.js');

async function check_user_by_email(userEmail) {
    const userExists = await userprofiles.exists({userEmail});
    return userExists;
}

module.exports = check_user_by_email;