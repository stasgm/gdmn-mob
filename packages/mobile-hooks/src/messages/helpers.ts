let orderCounter = new Date().getTime();

export const getNextOrder = () => ++orderCounter;

export const MULTIPART_ITEM_LIVE_IN_MS = 3600000;
