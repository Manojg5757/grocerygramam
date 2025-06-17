import messaging from '@react-native-firebase/messaging';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize services
import { getApp } from 'firebase/app';
const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Function to check and request notification permission, save token, and subscribe to topic
 */
export const getPermissionAndSaveToken = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('Notification permission denied');
        return;
      }
    }

    // Request Firebase Messaging permission (iOS)
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.warn('Notification permission not granted');
      return;
    }

    // Get FCM token
    const currentToken = await messaging().getToken();
    console.log('✅ FCM Token fetched:', currentToken);

    const user = auth.currentUser;
    if (!user) {
      console.warn('⚠️ No user signed in');
      return;
    }

    // Fetch token from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);
    let firestoreToken = null;
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      firestoreToken = userData.fcmToken || null;
    }

    // Compare current token with Firestore token
    if (currentToken !== firestoreToken) {
      await setDoc(
        userDocRef,
        { fcmToken: currentToken },
        { merge: true }
      );
      console.log('✅ FCM token saved to Firestore users collection');
      await AsyncStorage.setItem('fcmtoken', currentToken);
    } else {
      console.log('FCM token unchanged compared to Firestore');
    }

    // ✅ Subscribe to topic
    await messaging().subscribeToTopic('allUsers');
    console.log('✅ Subscribed to topic: allUsers');

  } catch (error) {
    console.error('Error requesting notification permission or saving token:', error);
  }
};
