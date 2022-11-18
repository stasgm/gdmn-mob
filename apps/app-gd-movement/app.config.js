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
      name: config.name,
      githubUrl: config.githubUrl,
      documentationUrl: `${config.githubUrl}/blob/dev/docs/gdmn-gd-movement/docs/README.md`,
      eas: {
        projectId: '0b360ec9-1e41-47e5-98fe-18fd21260e48',
      },
    },
  };
  return appConfig;
};
