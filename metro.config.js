const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    resolveRequest(context, moduleName, platform) {
      // @react-native/virtualized-lists 0.87.1 nhập file này qua đường dẫn chưa export.
      // Chỉ dùng cách resolve truyền thống cho đúng module nội bộ đang được thư viện dùng.
      const legacyFeatureFlags =
        moduleName ===
        'react-native/src/private/featureflags/ReactNativeFeatureFlags';
      return context.resolveRequest(
        legacyFeatureFlags
          ? { ...context, unstable_enablePackageExports: false }
          : context,
        moduleName,
        platform,
      );
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
