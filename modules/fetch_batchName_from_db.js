const batch = require('../database/batch_schema.js');

async function fetch_batchName_from_db(user_id) {
    try {
        const fetchedData = await batch.find({user_id});
        return fetchedData;
    } catch (err) {
        throw err;
    }
}

module.exports = fetch_batchName_from_db;