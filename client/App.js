import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./Redux/Store";
import { loadCartFromStorage } from "./Redux/CartSlice";
import AppNavigator from "./src/components/Navigation";
import { notificationListener } from "./src/firebasepush/FirebasePush";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
import AsyncStorage from '@react-native-async-storage/async-storage';
import "./src/i18n/index.js";
import i18n from "./src/i18n/index.js";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "react-native";

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
Text.defaultProps.style = { color: "black" };

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AppContent = () => {
  const dispatch = useDispatch();
  
  // Simple update check that won't block app startup
  const checkForUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        // Store that we have an update ready
        await AsyncStorage.setItem('hasUpdate', 'true');
      }
    } catch (error) {
      // Silently fail - don't crash the app
      console.log('Update check failed:', error);
    }
  };

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Initialize critical features first
        dispatch(loadCartFromStorage());
        i18n.changeLanguage("ta");
        notificationListener();
        
        // Check if we have a pending update from last session
        const hasUpdate = await AsyncStorage.getItem('hasUpdate');
        if (hasUpdate === 'true') {
          await AsyncStorage.removeItem('hasUpdate');
          await Updates.reloadAsync();
          return;
        }

        // Hide splash screen
        await SplashScreen.hideAsync();

        // Check for updates in background after app is ready
        if (!__DEV__) {
          setTimeout(() => {
            checkForUpdate();
          }, 3000);
        }
      } catch (e) {
        console.log("❌ Error during prepareApp:", e);
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  return <AppNavigator />;
};

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
 