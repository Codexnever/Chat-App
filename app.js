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
// const handlebarshelpers = require('./helpers/handlebars-helpers');
require('dotenv').config();
//const requireAuth = require('./middleware/authMiddleware');

// Connect to database
dbConfig();
// handlebarshelpers()

// Other imports...
const signupRouter = require('./routes/signupRoute'); 
const signinRoutes = require('./routes/signinRoute');
const chatRoutes = require('./routes/chatRoute');
const logoutRoutes = require('./routes/logout');

// Middleware
app.use(express.static('public'));
app.set('view engine', 'hbs');

// Set views, partialsPath, bodyParser, cookieParser
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.use(signupRouter);
app.use(signinRoutes);
app.use(chatRoutes);
app.use(logoutRoutes);

// Socket.IO connection handling
const activeSockets = {}; // Create an object to store active sockets

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    io.emit('user count', io.engine.clientsCount);

    // console.log(`User ${userId}  connected`);
    io.emit('user connected', { userId });

    // Store the socket associated with the user ID in the activeSockets object
    activeSockets[userId] = socket;

    // Listen for private messages
    socket.on('private message', (data) => {
        try {
            const { recipient, message } = data;
         //   console.log(`${recipient} received message: ${message}`);
            
            const recipientSocket = activeSockets[recipient];
            if (recipientSocket) {
                socket.emit('private message', { sender: userId, message });
                recipientSocket.emit('private message', { sender: userId, message });
            } else {
                console.error(`Recipient socket for user ${recipient} not found.`);
                socket.emit('recipient not found', { recipient: recipient });

            }
        } catch (error) {
            console.error('Error sending private message:', error);
            socket.emit('private message error', { error: error.message });
        }
    });
    
    socket.on('disconnect', () => {
        console.log(`User ${userId} disconnected`);
        io.emit('user count', io.engine.clientsCount);

        delete activeSockets[userId];
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});