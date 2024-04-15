const express = require('express');
const router = express.Router(); 

const requireAuth = require('../middleware/authMiddleware');
const Signup = require('../models/signup'); 
const ChatMessage = require('../models/chatMessage');

// Define routes
router.get('/chat', requireAuth, async (req, res) => {
    try {
        const user = await Signup.findById(req.userId);
        const messages = await ChatMessage.find({ $or: [{ sender: req.userId }, { recipient: req.userId }] }).populate('user', 'email');
        //console.log('Here the messages',messages)
        const userId = req.userId;
        //console.log('userId is here boss',userId)
        const name = user ? user.name : 'Unknown';
        const users = await Signup.find({}, 'name , userId'); // Retrieve only the name field
        res.render('index', { userId, messages, user, name,users });
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
