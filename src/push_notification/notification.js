import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

const CHANNEL_ID = 'default-channel-id'; // Define a channel ID

// Configure PushNotification
PushNotification.configure({
  onNotification: function (notification) {
    console.log('LOCAL NOTIFICATION ==>', notification);
  },
  requestPermissions: Platform.OS === 'ios',
});

// Create notification channel
const createNotificationChannel = () => {
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: CHANNEL_ID,
        channelName: 'Default Channel',
        channelDescription: 'A default channel',
        playSound: true,
        soundName: 'default',
        importance: 4, // 'high' equivalent
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }
};

// Background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
  displayNotification(remoteMessage.notification);
});

// Function to display local notification
const displayNotification = (notification) => {
  PushNotification.localNotification({
    channelId: CHANNEL_ID,
    title: notification.title,
    message: notification.body,
    bigText: notification.body,
    playSound: true,
    soundName: 'default',
    vibrate:true
  });
};

// Foreground handler
const onMessageListener = () => {
  messaging().onMessage(async (remoteMessage) => {
    console.log('A new FCM message arrived!', remoteMessage);
    displayNotification(remoteMessage.notification);
  });
};

export { onMessageListener, createNotificationChannel };
