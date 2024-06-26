// deviceDetails.js
import DeviceInfo from 'react-native-device-info';
import getCurrentLocation from '../getCurrentLocation/GetCurrentLocation';
import getFcmToken from '../fcm_token/getFcmToken';
import AsyncStorage from '@react-native-async-storage/async-storage';

const deviceDetails = async (loginUserData) => {
  try {
    console.log('loginUserData of deviceDetails (input):', loginUserData);

    const asyncLoginData = await AsyncStorage.getItem('userLoginData');
    const parseAsyncLoginData = JSON.parse(asyncLoginData)

    const deviceId = await DeviceInfo.getUniqueId();
    const deviceType = await DeviceInfo.getSystemName();
    const location = await getCurrentLocation();
    console.log('location of deviceDetails:', location);
    const fcmToken = await getFcmToken();
    const userId = parseAsyncLoginData?.data?.username;

    const userDetails = {
      device_id: deviceId,
      device_type: deviceType,
      fcm_token: fcmToken,
      employee_id: userId,
      address: location?.address,
      latitude: location?.latitude,
      longitude: location?.longitude,
    };

    console.log('userDetails:', userDetails);

    return userDetails;
  } catch (error) {
    console.log('Error fetching device details:', error);
    return {
      error: true,
      message: error.message,
    };
  }
};

export default deviceDetails;