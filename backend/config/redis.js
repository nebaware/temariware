const { createClient } = require('redis');
// Redis v4+ supports promises natively, so promisify is not strictly needed for the client methods themselves if we use them directly.
// However, to maintain compatibility with existing usage (if any), we'll define simple wrappers.

let isConnected = false;

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => {
    // Only log if we were previously connected or if it's a connection error that we want to suppress noise for
    if (isConnected) {
        console.error('Redis Client Error', err);
    }
});

const connectRedis = async () => {
    try {
        await client.connect();
        isConnected = true;
        console.log('🚀 Redis connected successfully');
    } catch (err) {
        console.warn('⚠️ Redis connection failed. Running without cache features.');
        console.warn(`Error: ${err.message}`);
        // Do NOT exit process
        isConnected = false;
    }
};

// Safe wrappers that do nothing if not connected
const getAsync = async (key) => {
    if (!isConnected) return null;
    try {
        return await client.get(key);
    } catch (e) {
        console.error('Redis get error:', e);
        return null;
    }
};

const setAsync = async (key, value, ...args) => {
    if (!isConnected) return;
    try {
        await client.set(key, value, ...args);
    } catch (e) {
        console.error('Redis set error:', e);
    }
};

const delAsync = async (key) => {
    if (!isConnected) return;
    try {
        await client.del(key);
    } catch (e) {
        console.error('Redis del error:', e);
    }
};

module.exports = {
    client,
    connectRedis,
    getAsync,
    setAsync,
    delAsync
};
