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
      documentationUrl: `${config.githubUrl}/blob/dev/docs/gdmn-fp-movement/docs/README.md`,
      eas: {
        projectId: '39f9528c-0225-4fcc-be9f-14f6f4dedc22',
      },
    },
  };
  return appConfig;
};
