export async function register() {
  // Run the worker only on the server (Node.js runtime)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("🚀 Starting Background Worker...");

    const { getStatistics } = await import('./db/index');
    const { redis } = await import('./lib/redis');

    const cacheKey = 'statistics:report';

    // Function that performs data aggregation
    const performTask = async () => {
      try {
        const stats = getStatistics();
        
        // Save the aggregation results in Redis
        await redis.set(cacheKey, JSON.stringify(stats));
        console.log(`[Worker]: Statistics updated in Redis. Total transfers: ${stats.totalTransfers}`);
      } catch (error) {
        console.error('[Worker Error]:', error);
      }
    };

    // Run for the first time immediately
    await performTask();

    // Setup to run every 30 seconds
    setInterval(performTask, 30000);
  }
}
