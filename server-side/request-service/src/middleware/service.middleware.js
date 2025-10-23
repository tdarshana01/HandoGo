const jwt = require('jsonwebtoken');

// protect: extracts token, verifies it, and normalizes req.user to { id, role }
const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'YOUR_JWT_SECRET');
        // Support tokens that either contain { id, role } or { user: { id, role } }
        if (decoded && decoded.user) {
            req.user = {
                id: decoded.user.id || decoded.user._id,
                role: decoded.user.role,
            };
        } else {
            req.user = {
                id: decoded.id || decoded._id,
                role: decoded.role,
            };
        }
        return next();
    } catch (error) {
        console.error('Token verify error:', error.message || error);
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

// authorize: roles can be array or single string; check case-insensitively
const authorize = (roles) => {
    const allowed = Array.isArray(roles) ? roles : [roles];
    const allowedLower = allowed.map(r => String(r).toLowerCase());
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        const userRole = String(req.user.role).toLowerCase();
        if (!allowedLower.includes(userRole)) {
            return res.status(403).json({ success: false, message: `Access denied: Requires one of the following roles: ${allowed.join(', ')}` });
        }
        next();
    };
};

module.exports = { protect, authorize };
