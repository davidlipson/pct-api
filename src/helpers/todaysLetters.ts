import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { LETTERS, MIN_WORDS, WORDS_GOAL } from "../constants";
import {
  allMatchingWords,
  firstMatchingWord,
  wordWithLettersNotInOrder,
} from "./totalMatchingWords";
import { calculatePoints } from "./calculatePoints";
import { fetchCache } from "../cache";

dayjs.extend(utc);
dayjs.extend(timezone);

export type LettersOfTheDay = {
  letters: string[];
  totalWords: number;
  levels: number[];
  validExample?: string;
  invalidExample?: string;
};

const specialDays: Record<string, string[]> = {
  "09-29": ["p", "c", "t"],
  "10-08": ["j", "g", "l"],
  "10-19": ["t", "b", "l"],
  "12-03": ["j", "m", "l"],
  "05-11": ["m", "o", "m"],
  "06-15": ["d", "a", "d"],
};

const generateResult = (
  letters: string[],
  totalWords: string[]
): LettersOfTheDay => {
  const totalScore = totalWords.reduce(
    (acc, word) => acc + calculatePoints(word),
    0
  );
  const averageWordScore = totalScore / totalWords.length;
  const averageTargetScore = WORDS_GOAL * averageWordScore * 0.65;
  const levels = [
    averageTargetScore / 3,
    (2 * averageTargetScore) / 3,
    averageTargetScore,
  ];

  return {
    letters,
    totalWords: totalWords.length,
    levels: levels.map((level) => Math.ceil(level / 10) * 10),
    validExample: firstMatchingWord(letters),
    invalidExample: wordWithLettersNotInOrder(letters),
  };
};

export const todaysDateString = (): string => {
  return dayjs().tz("America/Toronto").format("MM-DD");
};

// consistent algorithm for generating today's letters
export const todaysLetters = (): LettersOfTheDay => {
  const timeInToronto = dayjs().tz("America/Toronto");
  const specialDay = specialDays[timeInToronto.format("MM-DD")];
  if (specialDay) {
    const totalWords = allMatchingWords(specialDay);
    return generateResult(specialDay, totalWords);
  }

  let iterOne = 0;
  let iterTwo = 0;
  let iterThree = 0;

  while (true) {
    const firstLetter =
      LETTERS[
        (timeInToronto.day() * timeInToronto.date() + iterOne) % LETTERS.length
      ].toLowerCase();
    const secondLetter =
      LETTERS[
        (timeInToronto.month() * timeInToronto.day() +
          iterTwo +
          timeInToronto.date()) %
          LETTERS.length
      ].toLowerCase();
    const thirdLetter =
      LETTERS[
        (timeInToronto.year() * timeInToronto.month() +
          iterThree +
          timeInToronto.day()) %
          LETTERS.length
      ].toLowerCase();
    const totalWords = allMatchingWords([
      firstLetter,
      secondLetter,
      thirdLetter,
    ]);
    if (totalWords.length >= MIN_WORDS) {
      return generateResult(
        [firstLetter, secondLetter, thirdLetter],
        totalWords
      );
    }
    iterOne++;
    iterTwo++;
    iterThree++;
  }
};

export const fetchTodaysLetters = async (): Promise<LettersOfTheDay> => {
  return await fetchCache("todaysLetters", todaysLetters);
};
