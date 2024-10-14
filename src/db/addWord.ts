import { fetchCache } from "../cache";
import { WORDS_GOAL } from "../constants";
import { client } from "./client";
import { myWords } from "./myWords";

export const addWord = async ({
  word,
  points,
  userId,
}: {
  word: string;
  points: number;
  userId: string;
}) => {
  await client.query(
    `INSERT INTO found_words (word, userId, points) VALUES ($1, $2, $3)`,
    [word, userId, points],
    (err, res) => {
      if (err) {
        console.error(err);
      }
    }
  );

  const { rowCount } = await client.query(
    `SELECT word FROM found_words WHERE userId = $1 and date_trunc('day', date) = date_trunc('day', CURRENT_TIMESTAMP)`,
    [userId]
  );

  if (rowCount === WORDS_GOAL) {
    await client.query(
      `UPDATE users SET streak = streak + 1, lastWonDate = CURRENT_TIMESTAMP WHERE userId = $1 and (lastWonDate = date_trunc('day', CURRENT_TIMESTAMP - interval '1 day') or streak = 0)`,
      [userId]
    );
  }

  return await fetchCache(`myWords/${userId}`, () => myWords(userId), true);
};
