const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Signup'
    },
    message: String
});

const ChatMessagesch = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessagesch;
