import { View, Text } from 'react-native'
import React from 'react'
//http://172.17.15.218/etvtracker/Api/punch_uesrs_data
const handleEmployeeApi = async (userName) => {40
 try {
    const responseData = await fetch(`http://202.62.74.220/etvtracker/Api/userId_wise_data?user_id=${userName}`)

    if (!responseData.ok) {
       console.log('Network response was not ok in handleEmployeeApi');
    }

    const data = await responseData.json();
    console.log('data :--',data);
    return data;
    
 } catch (error) {
    console.log("These was a problem with your fetch operation in handleEmployeeApi", error)
   //  throw error;
   // return []; // or handle the error in another way
 }
  
}

export default handleEmployeeApi