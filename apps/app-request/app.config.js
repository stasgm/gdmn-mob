export default ({ config }) => ({
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
    eas: {
      projectId: '9bf64645-64f3-49bf-837f-119812ef4cf2',
    },
  },
});
