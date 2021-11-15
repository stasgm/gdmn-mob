export const paramsValidator = (query: any): boolean => {
  const check =
    typeof query === 'object' &&
    typeof query.dateBegin === 'string' &&
    Date.parse(query.dateBegin) > 0 &&
    typeof query.dateEnd === 'string' &&
    Date.parse(query.dateEnd) > 0 &&
    typeof query.outletId === 'string' &&
    typeof query.goodId === 'string';

  return check;
};
