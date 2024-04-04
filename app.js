const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const path = require('path');
const dbConfig = require('./config/db');
const requireAuth = require('./middleware/authMiddleware');

// Other imports...
const signupRoutes = require('./routes/signupRoute');
const signinRoutes = require('./routes/signinRoute');
const chatRoutes = require('./routes/chatRoute');
const logoutRoutes = require('./routes/logout');

// Middleware
app.use(express.static('public'));
app.set('view engine', 'hbs');
// Set views, partialsPath, bodyParser, cookieParser
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to database
dbConfig();

// Routes
app.use(signupRoutes);
app.use(signinRoutes);
app.use(chatRoutes);
app.use(logoutRoutes);
// Socket.IO connection handling

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('chat message', async (data) => {
        // console.log('Received data:', data);

        try {
            const { userId, message } = data;
            // console.log(message + userId);
            if (!userId) {
                console.log('User not authenticated');
                return;
            }
            // await ChatMessage.create({ user: userId, message });
            // console.log('Message saved successfully');
        } catch (error) {
            console.error('Error saving chat message:', error);
        }
        io.emit('chat message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});


// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});