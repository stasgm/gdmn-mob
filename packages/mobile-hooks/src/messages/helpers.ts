let orderCounter = new Date().getTime();

export const getNextOrder = () => ++orderCounter;
