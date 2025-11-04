export const queueConfig = {
  enabled: process.env.USE_QUEUE === 'true',
  redis: {
    host: process.env.QUEUE_REDIS_HOST || '127.0.0.1',
    port: Number(process.env.QUEUE_REDIS_PORT || 6379),
  },
};

export default queueConfig;
