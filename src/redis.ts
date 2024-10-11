import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType;

(async () => {
  redisClient = createClient(
    process.env.REDISCLOUD_URL
      ? {
          url: process.env.REDISCLOUD_URL,
        }
      : undefined
  );

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

export { redisClient };
