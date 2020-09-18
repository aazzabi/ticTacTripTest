const mongoose = require('mongoose');
const RequestSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    count: {type: Number, default : 0, required: false},
    date: {type: Date, default: Date.now}
});
module.exports = Request = mongoose.model('request', RequestSchema);
