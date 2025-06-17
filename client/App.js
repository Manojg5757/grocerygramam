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
import { Text, Alert } from "react-native";

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

// Wrapper component to use Redux hooks
const AppContent = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const prepareApp = async () => {
      // Load cart data
      dispatch(loadCartFromStorage());
      try {
        i18n.changeLanguage("ta");
        notificationListener();

        // 👇 Manual OTA update check
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          Alert.alert(
            "Update Available",
            "A new update is available. It will be installed now.",
            [
              {
                text: "Update Now",
                onPress: async () => {
                  try {
                    await Updates.fetchUpdateAsync();
                    await Updates.reloadAsync(); // App will restart with the update
                  } catch (err) {
                    console.log("Update fetch/reload error:", err);
                  }
                },
              },
            ],
            { cancelable: false }
          );
        }
      } catch (e) {
        console.log("❌ Error during prepareApp", e);
      } finally {
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
 