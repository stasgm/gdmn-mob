import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    config: {
      ...config.android.config,
      googleMaps: {
        apiKey: process.env.GOOGLE_API_KEY,
        // apiKey: 'AIzaSyBHC0awJaSoP-rQnctSsp6DmEYZ06SGTh0',
      },
    },
  },
  extra: {
    appVesion: config.version,
    buildVersion: config.android.versionCode,
    slug: config.slug,
  },
});
