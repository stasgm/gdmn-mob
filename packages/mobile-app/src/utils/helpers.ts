const truncate = (str: string, l: number | undefined = 40) => (str.length > l ? `${str.substring(0, l)}...` : str);

const log = (...message: string[]) => {
  if (__DEV__) {
    console.log(new Date().toTimeString(), ...message);
  }
};

export { truncate, log };
