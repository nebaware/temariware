const { getAsync, setAsync } = require('../config/redis');

/**
 * Cache middleware that caches successful responses
 * @param {number} duration - Cache duration in seconds
 */
const cache = (duration) => {
    return async (req, res, next) => {
        // Don't cache non-GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl || req.url}`;
        
        try {
            const cachedData = await getAsync(key);
            if (cachedData) {
                console.log('Cache hit:', key);
                return res.send(JSON.parse(cachedData));
            }
            
            // Cache miss - proceed with route handler
            const originalSend = res.send;
            res.send = function(body) {
                // Only cache successful responses
                if (res.statusCode >= 200 && res.statusCode < 400) {
                    setAsync(key, JSON.stringify(body), 'EX', duration)
                        .catch(err => console.error('Cache set error:', err));
                }
                return originalSend.call(this, body);
            };
            
            next();
        } catch (err) {
            console.error('Cache error:', err);
            next();
        }
    };
};

module.exports = cache;
