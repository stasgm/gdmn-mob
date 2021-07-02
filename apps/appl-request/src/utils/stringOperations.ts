export const shortenString = (word = '', maxLenght: number) => {
  return word.length > maxLenght ? word.substring(0, maxLenght - 3) + '...' : word;
};
