const jwt = require('jsonwebtoken');
const { getAsync, isRedisReady } = require('../config/redis');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(403).json({ message: 'No token provided. Access denied.' });
        }

        // Security Check: Ensure token is not in the Redis blocklist (logged out)
        if (isRedisReady()) {
            const isBlacklisted = await getAsync(`blacklist_${token}`);
            if (isBlacklisted) {
                return res.status(401).json({ message: 'Session expired. Please login again.' });
            }
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request for feature access
        next();
    } catch (err) {
        console.error('Auth Error:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = verifyToken;