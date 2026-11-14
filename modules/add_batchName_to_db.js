const batch = require('../database/batch_schema.js');

async function add_batchName_to_db(batchName, user_id) {

    try {

        const newbatch = new batch ({
            batchName,
            user_id
        });
        return newbatch.save();

    } catch (err) {

        throw err;

    }

}

module.exports = add_batchName_to_db;