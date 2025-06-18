import "dotenv/config";

export default () => ({
  expo: {
    name: "Grocery Gramam",
    slug: "myproject",
    version: "1.9.1",
    runtimeVersion: "1.9.1",
    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: false,
    loading: {
      hideExponentText: true,
    },
    updates: {
      url: "https://u.expo.dev/167e7f50-4e4d-4acc-9697-ad5ead245124",
      fallbackToCacheTimeout: 0,
      checkAutomatically: "ON_LOAD",
      channel: "production"
    },
    plugins: [
      "@react-native-firebase/app",
      "expo-notifications",
      "@react-native-firebase/crashlytics"
    ],
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain", // or 'cover'
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile: "./google-services.json",
      package: "com.manojvsp.myproject",
      bridgeless: false,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      API_KEY: process.env.API_KEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID,
      eas: {
        projectId: "167e7f50-4e4d-4acc-9697-ad5ead245124",
      },
    },
    owner: "manojvsp",
  },
});
