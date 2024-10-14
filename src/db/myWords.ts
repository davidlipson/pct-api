import { fetchCache } from "../cache";
import { client } from "./client";

// cache and clear on new word
export const myWords = async (userId: string) => {
  // return all userIds words and total points from current day
  const result = await client.query(
    `SELECT word, points FROM found_words WHERE userId = $1 AND date_trunc('day', date) = date_trunc('day', CURRENT_TIMESTAMP)`,
    [userId]
  );

  return result.rows;
};

export const fetchMyWords = async (userId: string) => {
  return await fetchCache(`myWords/${userId}`, () => myWords(userId));
};
