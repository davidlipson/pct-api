import { fetchCache } from "../cache";
import { client } from "../db/client";

export const getLeaderboard = async () => {
  const result = await client.query(
    `select users.userId, users.username, sum(points) as score from users left join found_words on users.userid = found_words.userid  where date_trunc('day', date) = date_trunc('day', CURRENT_TIMESTAMP - interval '1 day') group by users.userId order by score desc`
  );
  return result.rows;
};

export const fetchLeaderboard = async () => {
  const result = await fetchCache("leaderboard", getLeaderboard);
  return result;
};
