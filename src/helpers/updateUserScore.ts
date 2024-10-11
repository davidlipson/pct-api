import { fetchCache } from "../cache";

export const updateUserScore = async (userId: string, points: number) => {
  const cachedScore = await fetchCache(`score/${userId}`, async () => {
    return 0;
  });
  await fetchCache(
    `score/${userId}`,
    async () => {
      return cachedScore + points;
    },
    true
  );
};
