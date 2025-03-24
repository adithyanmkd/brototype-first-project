import redis from 'redis';

const redisClient = redis.createClient({
  url: process.env.REDIS_URI, // Use Redis URI from .env
});

redisClient.on('error', (err) => {
  console.error('Redis Connection Error:', err);
  process.exit(1);
});

// Connect to Redis before exporting
(async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
})();

export default redisClient; // Export the connected Redis client
