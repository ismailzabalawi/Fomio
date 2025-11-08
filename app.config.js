export default {
  expo: {
    name: 'Fomio Mobile',
    slug: 'fomiomobile',
    version: '0.0.102',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'fomio',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.fomio.mobile',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.fomio.mobile',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiMode: process.env.EXPO_PUBLIC_API_MODE || 'rest',
      bffUrl: process.env.EXPO_PUBLIC_BFF_URL || 'http://localhost:8080',
      discourseApi: process.env.EXPO_PUBLIC_DISCOURSE_API || 'https://meta.techrebels.info',
      deepLinkScheme: process.env.EXPO_PUBLIC_DEEP_LINK_SCHEME || 'fomio',
      DISCOURSE_BASE_URL: process.env.EXPO_PUBLIC_DISCOURSE_API || 'https://meta.techrebels.info',
      APPLICATION_NAME: 'Fomio Mobile',
      SCOPES: 'read,write,session,notifications',
    },
  },
};
