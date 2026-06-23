const IS_PROVIDER = process.env.EXPO_PUBLIC_APP_VARIANT === 'provider';

module.exports = {
  expo: {
    name: IS_PROVIDER ? 'AirConCure Pro' : 'AirConCure',
    slug: IS_PROVIDER ? 'airconcure-provider' : 'airconcure',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: IS_PROVIDER ? 'airconcure-provider' : 'airconcure',
    userInterfaceStyle: 'automatic',
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_PROVIDER ? 'com.airconcure.provider' : 'com.airconcure.app',
    },
    android: {
      package: IS_PROVIDER ? 'com.airconcure.provider' : 'com.airconcure.app',
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          resizeMode: 'contain',
          backgroundColor: '#0D9488',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      appVariant: IS_PROVIDER ? 'provider' : 'client',
      eas: {
        projectId: '',
      },
    },
  },
};
