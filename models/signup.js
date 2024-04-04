const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const Signupsch = mongoose.model('Signup', signupSchema);

module.exports = Signupsch;
