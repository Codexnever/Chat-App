const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

// Assuming you have a mongoose connection setup
mongoose.connect('mongodb://localhost:27017/Whatsapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const sessionMiddleware = session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection }), // Use mongoose connection
  cookie: { secure: false } // Set secure based on your server configuration
});

module.exports = sessionMiddleware;
