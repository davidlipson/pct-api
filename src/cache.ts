import { todaysDateString } from "./helpers";
import { redisClient } from "./redis";

export const fetchCache = async (
  key: string,
  callback: () => any,
  force = false
) => {
  const todaysDate = todaysDateString();
  const todayKey = `${key}/${todaysDate}`;

  if (!force) {
    const cache = await redisClient.get(todayKey);

    if (cache) {
      console.log("cache hit", todayKey);
      return JSON.parse(cache);
    }
  }

  if (force) {
    console.log("force cache set", todayKey);
  } else {
    console.log("cache miss", todayKey);
  }

  const data = await callback();
  await redisClient.setEx(todayKey, 24 * 60 * 60, JSON.stringify(data));
  return data;
};
