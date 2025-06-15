import messaging from '@react-native-firebase/messaging';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { getFirestore, doc, setDoc,getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize services
import { getApp } from 'firebase/app';
const app = getApp();
const db = getFirestore(app);
const auth = getAuth(app);

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

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.warn('Notification permission not granted');
      return;
    }

    const currentToken = await messaging().getToken();
    const savedToken = await AsyncStorage.getItem('fcmtoken');
    console.log('✅ Current FCM Token:', currentToken);
    console.log('💾 Saved FCM Token:', savedToken);

    // Get current user
    let user = auth.currentUser;
    
    if (!user) {
      console.log('⏳ Waiting for auth state...');
      user = await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          unsubscribe();
          resolve(null);
        }, 3000);
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          clearTimeout(timeout);
          unsubscribe();
          resolve(user);
        });
      });
    }

    if (!user) {
      console.warn('⚠️ No user signed in - saving locally only');
      await AsyncStorage.setItem('fcmtoken', currentToken);
      await messaging().subscribeToTopic('allUsers');
      return;
    }

    // Get the token from Firestore to compare
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const firestoreToken = userDoc.exists() ? userDoc.data().fcmToken : null;
    
    console.log('🔥 Firestore FCM Token:', firestoreToken);
    console.log('🔍 Tokens match?', currentToken === firestoreToken);

    // Update if current token is different from Firestore token
    if (currentToken !== firestoreToken) {
      console.log('📝 Updating FCM token in Firestore...');
      
      await setDoc(
        doc(db, 'users', user.uid),
        { 
          fcmToken: currentToken,
          fcmTokenUpdatedAt: new Date().toISOString()
        },
        { merge: true }
      );
      
      console.log('✅ FCM token updated in Firestore');
      await AsyncStorage.setItem('fcmtoken', currentToken);
      console.log('💾 FCM token updated in AsyncStorage');
    } else {
      console.log('ℹ️ FCM token unchanged in Firestore');
      // Still update AsyncStorage if it's different
      if (currentToken !== savedToken) {
        await AsyncStorage.setItem('fcmtoken', currentToken);
        console.log('💾 FCM token updated in AsyncStorage only');
      }
    }

    await messaging().subscribeToTopic('allUsers');
    console.log('✅ Subscribed to topic: allUsers');

  } catch (error) {
    console.error('Error requesting notification permission or saving token:', error);
  }
};