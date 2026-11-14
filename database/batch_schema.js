const mongoose = require('mongoose');

const batch_schema = new mongoose.Schema ({
    batchName: {type: String, required: true},
    user_id: {type: String, required: true},
});

module.exports = mongoose.model("batch", batch_schema);