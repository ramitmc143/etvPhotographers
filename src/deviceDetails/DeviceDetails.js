import DeviceInfo from 'react-native-device-info';
import getCurrentLocation from '../getCurrentLocation/GetCurrentLocation';
import getFcmToken from '../fcm_token/getFcmToken';

const deviceDetails = async (loginUserData) => {
  try {
    const deviceId = await DeviceInfo.getUniqueId();
    const deviceType = await DeviceInfo.getSystemName();
    const location = await getCurrentLocation();
    const fcmToken = await getFcmToken();
    const userId = loginUserData.data.username;

    const userDetails = {
      device_id: deviceId,
      device_type: deviceType,
      fcm_token: fcmToken,
      employee_id:userId,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    };

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
