import { redisClient } from "../redis";
import { todaysDateString } from "./todaysLetters";

export const getLeaderboard = async () => {
  // log all redis keys starting with 'score/${todaysDateString()}
  // add caching?
  const keys = await redisClient.keys(`score/*/${todaysDateString()}`);
  const data = await redisClient.mGet(keys);
  const scores = keys.map((key, i) => {
    const userId = key.split("/")[1];
    return { userId, score: parseInt(data[i] || "0") };
  });
  return scores.sort((a, b) => b.score - a.score);
};
