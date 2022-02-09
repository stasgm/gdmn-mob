const truncate = (str: string, l: number | undefined = 40) => (str.length > l ? `${str.substring(0, l)}...` : str);

export { truncate };
