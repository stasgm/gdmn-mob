export default ({ config }) => {
  const appConfig = {
    ...config,
    android: {
      ...config.android,
      config: {
        ...config.android.config,
      },
    },
    extra: {
      appVesion: config.version,
      buildVersion: config.android.versionCode,
      slug: config.slug,
    },
  };
  return appConfig;
};
