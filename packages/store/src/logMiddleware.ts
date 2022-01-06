export const logMiddleware = () => (next: any) => (action: any) => {
  if (__DEV__) {
    console.log('Middleware App action: ', JSON.stringify(action));
  }

  return next(action);
};
