import "dotenv/config";

export default () => ({
  expo: {
    name: "myproject",
    slug: "myproject",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    plugins: [
      "@react-native-firebase/app",
      "expo-notifications",
      "@react-native-firebase/crashlytics"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
        backgroundColor: "#ffffff"
      },
      googleServicesFile: "./google-services.json",
      package: "com.manojvsp.myproject"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      API_KEY: process.env.API_KEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID,
      eas: {
        projectId: "167e7f50-4e4d-4acc-9697-ad5ead245124"
      }
    },
    owner: "manojvsp"
  }
});
