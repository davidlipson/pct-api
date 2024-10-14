import { client } from "./client";

export const findUser = async ({ userId }: { userId: string }) => {
  //  find or create user
  const results = await client.query(
    `insert into users (userId) values ($1) on conflict (userId) do nothing returning *`,
    [userId]
  );

  // if lastwondate is not yesterday, reset streak to 0
  await client.query(
    `update users set streak = 0 where userId = $1 and lastWonDate < date_trunc('day', CURRENT_TIMESTAMP - interval '1 day')`,
    [userId]
  );

  return results.rows[0];
};
