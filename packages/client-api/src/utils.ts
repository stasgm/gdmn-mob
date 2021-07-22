export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getParams = (params: Record<string, string | number | undefined>) => {
  return Object.entries(params).reduce((acc, [field, value]) => {
    let curParam = '';
    if (acc > '') {
      curParam = `${acc}&`;
    }
    return `${curParam}${field}=${value}`;
  }, '');
};
