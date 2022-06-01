import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    config: {
      ...config.android.config,
      googleMaps: {
        apiKey: process.env.GOOGLE_API_KEY,
      },
    },
  },
  extra: {
    appVesion: config.version,
    buildVersion: config.android.versionCode,
    slug: config.slug,
    name: config.name,
    githubUrl: config.githubUrl,
  },
});
