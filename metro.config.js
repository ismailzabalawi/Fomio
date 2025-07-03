const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add custom resolver configuration
config.resolver.extraNodeModules = {
  'react-dom': require.resolve('react-native'),
};

// Add custom resolver configuration for GlueStack UI
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-dom') {
    return {
      filePath: require.resolve('react-native'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config; 