import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onMessageListener, createNotificationChannel } from '../push_notification/notification';

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    return true;
  } else {
    console.log('Permission denied', 'Notification permissions are required for this app to function properly.');
    return false;
  }
};

const generateFcmToken = async () => {
  try {
    let token = await messaging().getToken();
    if (!token) {
      console.log('No FCM token received. Retrying...');
      token = await messaging().getToken();
    }
    if (token) {
      console.log('FCM Token:', token);
      await AsyncStorage.setItem('fcmToken', token); // Save the token to AsyncStorage
      return token;
    } else {
      console.log('Failed to get FCM token after retrying');
    }
  } catch (error) {
    console.log('Error getting FCM token:', error);
    if (error.code === 'messaging/unknown' && error.message.includes('PHONE_REGISTRATION_ERROR')) {
      console.log('Registration Error', 'Phone registration error occurred. Please check your device configuration and try again.');
    } else {
      console.log('Error', 'An error occurred while getting the FCM token.');
    }
  }
};

const getFcmToken = async () => {
  createNotificationChannel(); // Create notification channel

  const hasPermission = await requestUserPermission();
  if (!hasPermission) {
    return null;
  }

  const token = await generateFcmToken();

  messaging().onTokenRefresh(async (newToken) => {
    console.log('FCM Token refreshed:', newToken);
    await AsyncStorage.setItem('fcmToken', newToken); // Save the new token to AsyncStorage
    return newToken;
  });

  onMessageListener();

  return token;
};

export default getFcmToken;
