const truncate = (str: string, l: number | undefined = 40) => (str.length > l ? `${str.substring(0, l)}...` : str);

const log = (...message: string[]) => {
  if (__DEV__) {
    console.log(new Date().toTimeString(), ...message);
  }
};

const getDateString = (_date: string | Date) => {
  if (!_date) {
    return '-';
  }
  const date = new Date(_date);
  return `${('0' + date.getDate()).toString().slice(-2, 3)}.${('0' + (date.getMonth() + 1).toString()).slice(
    -2,
    3,
  )}.${date.getFullYear()}`;
};

const shortenString = (word: string, maxLenght: number) => {
  return word.length > maxLenght ? word.substring(0, maxLenght - 3) + '...' : word;
};

export { truncate, log, getDateString, shortenString };
