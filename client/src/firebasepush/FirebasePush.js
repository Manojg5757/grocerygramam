import * as Notifications from 'expo-notifications';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';

// Initialize Firebase messaging instance
const messaging = getMessaging(getApp()); // 👈 Modular approach

// Listen for foreground notifications
export const notificationListener = () => {
  // Handle foreground messages
  onMessage(messaging, async remoteMessage => {
    console.log("🔔 Foreground message received:", remoteMessage);
    
    try {
      // Always try to display notification, even in foreground
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title || remoteMessage.data?.title || 'New Message',
          body: remoteMessage.notification?.body || remoteMessage.data?.body || 'You have a new notification',
          data: remoteMessage.data || {},
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: null, // Show immediately
      });
    } catch (error) {
      console.error("❌ Error showing notification:", error);
    }
  });

  // Setup notification channels for Android
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('orders', {
      name: 'Orders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }
};
