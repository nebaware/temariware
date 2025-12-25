const { createClient } = require('redis');
// Redis v4+ supports promises natively, so promisify is not strictly needed for the client methods themselves if we use them directly.
// However, to maintain compatibility with existing usage (if any), we'll define simple wrappers.

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => {
    // This will catch errors that happen after a successful connection.
    console.error('Redis Client Error', err);
});

const connectRedis = async () => {
    // Skip Redis in production if REDIS_URL is not available
    if (!process.env.REDIS_URL) {
        console.log('⚠️ No REDIS_URL provided, skipping Redis connection');
        return;
    }
    
    try {
        await client.connect();
        console.log('🚀 Redis connected successfully');
    } catch (err) {
        console.warn('⚠️ Redis connection failed. Running without cache features.');
        console.warn(`Error: ${err.message}`);
    }
};

const disconnectRedis = async () => {
    if (client.isReady) {
        await client.quit();
        console.log('Redis disconnected successfully.');
    }
};

// Safe wrappers that do nothing if not connected
const getAsync = async (key) => {
    if (!client.isReady) return null;
    try {
        return await client.get(key);
    } catch (e) {
        console.error('Redis get error:', e);
        return null;
    }
};

const setAsync = async (key, value, ...args) => {
    if (!client.isReady) return;
    try {
        await client.set(key, value, ...args);
    } catch (e) {
        console.error('Redis set error:', e);
    }
};

const delAsync = async (key) => {
    if (!client.isReady) return;
    try {
        await client.del(key);
    } catch (e) {
        console.error('Redis del error:', e);
    }
};

module.exports = {
    client,
    connectRedis,
    disconnectRedis,
    getAsync,
    setAsync,
    delAsync,
    // A utility function to check readiness from other modules
    isRedisReady: () => client.isReady
};
