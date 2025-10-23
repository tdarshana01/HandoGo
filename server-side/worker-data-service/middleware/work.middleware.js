const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Support two token shapes: { user: { id, role } } (some services) or { id, role } (user-service)
            if (decoded && decoded.user) {
                req.user = decoded.user;
            } else {
                req.user = {
                    id: decoded.id || decoded._id,
                    role: decoded.role
                };
            }
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

const authorize = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: `Access denied: Requires one of the following roles: ${roles.join(', ')}` });
    }
    next();
};

module.exports = { protect, authorize };
