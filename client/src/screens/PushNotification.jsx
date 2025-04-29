import { useState, useEffect, useRef } from 'react';
import { Text, View, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Set notification handler globally
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Handle registration error
function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

// Register for Push Notifications
async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    // Set notification channel for Android
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    try {
      // Get permissions for notifications
      const permissionsResponse = await Notifications.getPermissionsAsync();
      console.log("Permissions Response:", permissionsResponse); // Log full response

      // Ensure the response contains 'status'
      if (permissionsResponse && permissionsResponse.status) {
        const existingStatus = permissionsResponse.status; // Get the current permission status
        console.log("Existing Status:", existingStatus); // Log current status

        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          // If permission not granted, request it
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          handleRegistrationError('Permission not granted to get push token for push notification!');
          return;
        }

        // Define projectId (Ensure it's correct or use your Expo Push notification project ID)
        const projectId = "167e7f50-4e4d-4acc-9697-ad5ead245124";
        if (!projectId) {
          handleRegistrationError('Project ID not found');
          return;
        }

        try {
          // Get Expo Push Token
          const pushTokenResult = await Notifications.getExpoPushTokenAsync({ projectId });
          console.log("Push Token Result:", pushTokenResult); // Log the full result
          const pushTokenString = pushTokenResult.data;
          return pushTokenString;
        } catch (e) {
          handleRegistrationError(`Error fetching push token: ${e}`);
        }
      } else {
        handleRegistrationError('Invalid permissions response structure');
        return;
      }
    } catch (e) {
      console.error('Error getting permissions:', e);
      handleRegistrationError('Error getting permissions');
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

// App Component
export default function PushNotification() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Call register function and set token in state
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token || ''))
      .catch((error) => setExpoPushToken(`${error}`));

    // Set up notification listener
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Set up response listener for when notification is tapped
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    // Cleanup listeners on component unmount
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []); 
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Text>Your Expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title}</Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
    </View>
  );
}
