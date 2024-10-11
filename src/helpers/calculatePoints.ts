import { BONUS_LIMIT } from "../constants";

export const calculatePoints = (word: string): number => {
  return (
    Math.min(BONUS_LIMIT, word.length) +
    Math.max(0, word.length - BONUS_LIMIT) * 2
  );
};
