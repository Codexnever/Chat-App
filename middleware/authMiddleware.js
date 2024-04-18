const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.token; // Access token from cookie
    // console.log('Cookie Token', token); // Log the token for debugging
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: 'Authentication failed' });
            }
            req.userId = decoded.userId;
            next();
        });
    } else {
        
        res.status(401).json({ success: false, message: 'Authentication failed' });
    }
};

module.exports = requireAuth;
