export const logMiddleware = (store: any) => (next: any) => (action: any) => {
  if (__DEV__) {
    console.log('Middleware App action: ', JSON.stringify(action));
  }

  return next(action);
};
