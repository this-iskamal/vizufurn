const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {
  resolver: {
    assetExts: [
      // Retain default asset extensions
      ...getDefaultConfig(__dirname).resolver.assetExts,
      // Add custom extensions
      'obj',
      'mtl',
      'FBX',
      'hdr',
      'png'
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), customConfig);
