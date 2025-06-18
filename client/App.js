import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "./Redux/Store";
import { loadCartFromStorage } from "./Redux/CartSlice";
import AppNavigator from "./src/components/Navigation";
import { notificationListener } from "./src/firebasepush/FirebasePush";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import * as Updates from "expo-updates";
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

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Initialize critical features first
        dispatch(loadCartFromStorage());
        i18n.changeLanguage("ta");
        notificationListener();

        // Hide splash screen early to allow error recovery to work
        await SplashScreen.hideAsync();

        // Let expo-updates handle update checking automatically
        // Since checkAutomatically is set to "ON_LOAD", it will handle updates
        // Don't manually interfere with the update process
        
      } catch (e) {
        console.log("❌ Error during prepareApp:", e);
        // Always hide splash screen even on error
        try {
          await SplashScreen.hideAsync();
        } catch (splashError) {
          console.log("Error hiding splash screen:", splashError);
        }
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