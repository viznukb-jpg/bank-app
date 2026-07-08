import { STATS_CACHE_TTL_SECONDS } from "@/shared/config/constants";

declare global {
  var __worker_interval: ReturnType<typeof setInterval> | undefined;
}

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("🚀 Starting Background Worker...");

    const { getStatistics } = await import("./shared/db/index");
    const { redis } = await import("./shared/lib/redis");
    const { WORKER_INTERVAL_MS } = await import("./shared/config/constants");

    const cacheKey = "statistics:report";

    const performTask = async () => {
      try {
        const stats = getStatistics();
        await redis.set(
          cacheKey,
          JSON.stringify(stats),
          "EX",
          STATS_CACHE_TTL_SECONDS,
        );
        console.log(
          `[Worker]: Statistics updated in Redis. Total transfers: ${stats.totalTransfers}`,
        );
      } catch (error) {
        console.error("[Worker Error]:", error);
      }
    };

    await performTask();

    if (!globalThis.__worker_interval) {
      globalThis.__worker_interval = setInterval(
        performTask,
        WORKER_INTERVAL_MS,
      );
    }
  }
}
