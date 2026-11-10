const userprofiles = require('../database/userprofiles_schema.js');

async function find_user_by_email(userEmail) {
    const matchedProfile = await userprofiles.findOne({userEmail});
    return matchedProfile;
}

module.exports = find_user_by_email;