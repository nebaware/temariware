const jwt = require('jsonwebtoken');

// Verify JWT and attach user payload to req.user
module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!token) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ error: 'Server misconfigured: missing JWT_SECRET' });
        }

        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};





