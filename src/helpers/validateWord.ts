export const isSubSequence = (letters: string[], word: string) => {
  const pattern = letters.map((letter) => letter).join(".*");
  const regex = new RegExp(pattern);
  return regex.test(word);
};
