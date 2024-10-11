import { fetchCache } from "../cache";
import { fetchTodaysLetters, todaysLetters } from "./todaysLetters";
import { allMatchingWords } from "./totalMatchingWords";

export const todaysDictionary = async (): Promise<string[]> => {
  const data = await fetchTodaysLetters();
  return allMatchingWords(data.letters);
};

export const fetchTodaysDictionary = async (): Promise<string[]> => {
  return await fetchCache("todaysDictionary", todaysDictionary);
};
