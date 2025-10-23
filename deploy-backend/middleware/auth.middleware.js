const jwt = require('jsonwebtoken');
const User = require('../model/User.model');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET ); // || 'YOUR_JWT_SECRET'

            req.user = { 
                id: decoded.id, 
                role: decoded.role 
            };
            next();

        } catch (error) {
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `User role (${req.user.role}) is not authorized to access this route` 
            });
        }
        next();
    };
};
