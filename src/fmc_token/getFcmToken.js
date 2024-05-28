import messaging from '@react-native-firebase/messaging';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

const getFcmToken = () => {
  const [fcmToken, setFcmToken] = useState(null);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      generateFcmToken();
    } else {
        console.log('Permission denied', 'Notification permissions are required for this app to function properly.');
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
        setFcmToken(token);
        // Save the token to your server or local storage
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

  useEffect(() => {
    requestUserPermission();
    const unsubscribe = messaging().onTokenRefresh((token) => {
      console.log('FCM Token refreshed:', token);
      setFcmToken(token);
      // Save the new token to your server or local storage
    });

    return () => unsubscribe();
  }, []);

  return fcmToken;
};

export default getFcmToken;
