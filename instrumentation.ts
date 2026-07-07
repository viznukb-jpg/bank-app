export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("Запуск бекграунд воркера...");

    setInterval(() => {
      // Тут ми потім імпортуємо db/index.ts та redis.ts
      // І будемо рахувати статистику кожні 30 секунд
      console.log("Worker: оновлення статистики в Redis...");
    }, 30000);
  }
}
