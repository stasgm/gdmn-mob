export default ({ config }) => {
  const appConfig = {
    ...config,
    extra: {
      SYSTEM_NAME: 'Inventory',
    },
  };
  return appConfig;
};
