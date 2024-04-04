const express = require('express');
const app = express();
const router = express.Router(); // Create a router
const mongoose = require('../config/db');
const bcrypt = require('bcrypt');
const requireAuth = require('../middleware/authMiddleware')
const Signup = require('../models/signup'); // Import the Signup model


// Define routes on the router
router.get('/Signup', (req, res) => {
    res.render('Signup');
});

router.post('/Signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Create a new Signup document using the Mongoose model
        const hashedPassword = await bcrypt.hash(password, 10);
        await Signup.create({ email, password: hashedPassword, name });

        res.redirect('/Signin');
    } catch (error) {
        console.error('Error during Signup:', error);
        res.status(500).json({ success: false, message: 'An error occurred during Signup' });
    }
});

// Use the router in your Express application
app.use('/signup', router);

module.exports = app;
