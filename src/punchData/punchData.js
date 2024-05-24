import { View, Text } from 'react-native'
import React from 'react'
import deviceDetails from '../deviceDetails/DeviceDetails';
import recordPunch from '../recordPunch/recordPunchTime';

const punchData = async (userLoginResponse, dataUri) => {
  try {
      const deviceData = await deviceDetails();
      const deviceId = deviceData.device_id;
      const deviceType = deviceData.device_type;
      const locationName = deviceData.address;
      const latitude = deviceData.latitude;
      const longitude = deviceData.longitude;
      const punchTime = await recordPunch();
      const userName = userLoginResponse.data.name;
      const Phone = userLoginResponse.data.phone;
      const userId = userLoginResponse.data.username;

      const punchData = {
          device_id: deviceId,
          address: locationName,
          device_type: deviceType,
          punch_in: punchTime,
          user_name: userName,
          user_id: userId,
          phone_no: Phone,
          lattitude_longitude: `${latitude} , ${longitude}`,
          image_url: dataUri,
      };

      return punchData;
  } catch (error) {
      console.log("Error in punchData function:", error);
      // You can handle the error here, such as logging it or displaying a user-friendly message
      // throw error; // Rethrow the error to ensure it's caught by the caller
  }
};


export default punchData