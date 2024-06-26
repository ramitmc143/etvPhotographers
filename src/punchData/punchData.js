import { View, Text } from 'react-native'
import React from 'react'
import deviceDetails from '../deviceDetails/DeviceDetails';
import recordPunch from '../recordPunch/recordPunchTime';

const punchData = async (userLoginResponse, dataUri) => {
  try {
      const deviceData = await deviceDetails();


      console.log('deviceData of punchData:-',deviceData)
      const deviceId = await deviceData.device_id;
      const deviceType = await deviceData.device_type;
      const locationName = await deviceData.address;
      const latitude = await deviceData.latitude;
      const longitude = await deviceData.longitude;
      const punchTime = await recordPunch();
      const userName = await userLoginResponse.data.name;
      const Phone = await userLoginResponse.data.phone;
      const userId =await userLoginResponse.data.username;

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
          first_shift:'PR',
          secound_shift:'AB'

      };

      return punchData;
  } catch (error) {
      console.log("Error in punchData function:", error);
      // You can handle the error here, such as logging it or displaying a user-friendly message
      // throw error; // Rethrow the error to ensure it's caught by the caller
  }
};


export default punchData