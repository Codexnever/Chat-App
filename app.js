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
const signupRouter = require('./routes/signupRoute'); // Import the signup router
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
app.use(signupRouter);
app.use(signinRoutes);
app.use(chatRoutes);
app.use(logoutRoutes);
// Socket.IO connection handling

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('chat message', async (data) => {
     //   console.log('Received data:', data);

        try {
            const { userId, message } = data;
          //  console.log('Received message from user:', userId, message);

            if (!userId) {
                console.log('User not authenticated');
                return;
            }
            
            // Assuming sender's user ID is included in the data
            io.emit('chat message', { message, sender: userId });
         //   console.log('Message sent successfully');
        } catch (error) {
            console.error('Error sending chat message:', error);
        }
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