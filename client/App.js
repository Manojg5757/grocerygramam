import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./Redux/Store";
import AppNavigator from "./src/components/Navigation";
import { notificationListener } from "./src/firebasepush/FirebasePush";
import * as Notifications from 'expo-notifications';
import './src/i18n/index.js';
import i18n from "./src/i18n/index.js";
import { SafeAreaProvider } from "react-native-safe-area-context";
// 👇 Configure how notifications behave
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App = () => {
  
  useEffect(() => {
    i18n.changeLanguage('ta');
    notificationListener();

    return () => {
      // Cleanup (if needed)
    };
  }, []);

  return (
    <SafeAreaProvider>
    <Provider store={store}>
      <AppNavigator />
    </Provider>
    </SafeAreaProvider>
  );
};

export default App;
