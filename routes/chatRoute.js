const express = require('express');
const router = express.Router(); 

const requireAuth = require('../middleware/authMiddleware');
const Signup = require('../models/signup'); 
const ChatMessage = require('../models/chatMessage');

// Define routes
router.get('/chat', requireAuth, async (req, res) => {
    try {
        const user = await Signup.findById(req.userId); 
        const messages = await ChatMessage.find({ user: req.userId }).populate('user', 'email');
        const userId = req.userId;
        const name = user ? user.name : 'Unknown';
        const email = user.email;

        res.render('index', { userId, messages, user, email, name });
    } catch (error) {
        console.error('Error rendering chat interface:', error);
        res.status(500).json({ success: false, message: 'An error occurred while rendering chat interface' });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    res.redirect('/Signin');
});

module.exports = router; // Export the router instance
