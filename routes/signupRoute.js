const express = require('express');
const router = express.Router(); // Create a router
const mongoose = require('../config/db');
const bcrypt = require('bcrypt');
const requireAuth = require('../middleware/authMiddleware')
const Signup = require('../models/signup');  // Import the Signup model
const multer = require('multer'); 
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Define routes on the router
router.get('/', (req, res) => {
    res.render('Signup');
});

router.post('/signup',upload.single('profileImage'), async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        await Signup.create({ email, password: hashedPassword, name });

        res.redirect('/Signin');
    } catch (error) {
        console.error('Error during Signup:', error);
        res.status(500).json({ success: false, message: 'An error occurred during Signup' });
    }
});

// Use the router in your Express application

module.exports = router;
