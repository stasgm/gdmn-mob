import 'dotenv/config';

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
      documentationUrl: `${config.githubUrl}/blob/dev/docs/gdmn-pallet/docs/README.md`,
      eas: {
        projectId: process.env.PROJECT_ID,
      },
    },
  };
  return appConfig;
};
