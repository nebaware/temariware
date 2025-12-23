const rateLimit = require('express-rate-limit');

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // increased from 5 to 20 requests per windowMs
    message: { 
        success: false,
        error: 'Too many login attempts, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API rate limiting
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, // limit each IP to 1000 requests per hour
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again after an hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limiting for sensitive operations
const strictLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // limit each IP to 10 requests per 5 minutes
    message: {
        success: false,
        error: 'Too many requests, please slow down'
    }
});

module.exports = {
    authLimiter,
    apiLimiter,
    strictLimiter
};
