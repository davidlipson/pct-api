import { client } from "./client";

export const setUsername = async ({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) => {
  // insert or update userId and username in users table
  await client.query(
    `INSERT INTO users (userId, username) VALUES ($1, $2) ON CONFLICT (userId) DO UPDATE SET username = $2`,
    [userId, username],
    (err, res) => {
      if (err) {
        // need to handle error and not update username on front end if fails

        console.error(err);
      }
    }
  );
};
