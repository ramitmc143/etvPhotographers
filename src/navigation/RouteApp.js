import { View, Text } from 'react-native'
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../loginScreen/LoginScreen';
import Dashboard from '../dashboard/Dashboard';
import Camera from '../camera/Camera';


const Stack = createNativeStackNavigator();


const RouteApp = () => {
  return (
   <Stack.Navigator screenOptions={{headerTitleAlign:'center' , headerShown:false}} >
      <Stack.Screen name='LoginScreen' component={LoginScreen}/>
      <Stack.Screen name='Dashboard' component={Dashboard} />
      <Stack.Screen name='camera' component={Camera} />
   </Stack.Navigator>
  )
}

export default RouteApp