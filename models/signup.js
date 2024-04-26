const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    // profileImage: { type: Buffer }, 
    // profileImageFormat: { type: String }
});

const Signup = mongoose.model('Signup', signupSchema);

module.exports = Signup;
