const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

// Exporting the model
module.exports = mongoose.model('Signup', signupSchema);
