import * as Notifications from 'expo-notifications';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';

// Initialize Firebase messaging instance
const messaging = getMessaging(getApp()); // 👈 Modular approach

// Listen for foreground notifications
export const notificationListener = () => {
  onMessage(messaging, async remoteMessage => {
    console.log("🔔 Foreground message received:", remoteMessage);

    // Display a local notification when a message is received
    Notifications.scheduleNotificationAsync({
      content: {
        title: remoteMessage.notification?.title ?? 'New Message',
        body: remoteMessage.notification?.body ?? 'You have a new notification',
      },
      trigger: { seconds: 1 }, // Trigger notification immediately
    });
  });
};
