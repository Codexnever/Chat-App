const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Signup = require('../models/signup'); // Import from the models folder, assuming your Signup model is in this folder
const requireAuth = require('../middleware/authMiddleware'); // Import your authentication middleware

// Signin route
router.get('/signin', (req, res) => {
    res.render('Signin');
});

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email using Mongoose model
        const user = await Signup.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, 'ndnvms');

        res.cookie('token', token, {
            httpOnly: true,
        });

        res.redirect('/chat');
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ success: false, message: 'An error occurred during sign-in' });
    }
});

module.exports = router;
