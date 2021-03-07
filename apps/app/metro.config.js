const { createMetroConfiguration } = require('expo-yarn-workspaces');

module.exports = createMetroConfiguration(__dirname);
// const { getDefaultConfig } = require('metro-config');

// const configuration = createMetroConfiguration(__dirname);

// module.exports = (async () => {
//   const {
//     resolver: { sourceExts },
//   } = await getDefaultConfig();
//   return {
//     transformer: {
//       babelTransformerPath: require.resolve('react-native-svg-transformer'),
//     },
//     resolver: {
//       ...configuration.resolver,
//       assetExts: configuration.resolver.assetExts.filter(ext => ext !== 'svg'),
//       // assetExts: assetExts.filter(ext => ext !== 'svg'),
//       sourceExts: [...sourceExts, 'svg'],
//     },
//   };
// })();
