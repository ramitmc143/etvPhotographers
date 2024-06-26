import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../loginScreen/LoginScreen';
import Dashboard from '../dashboard/Dashboard';
import Camera from '../camera/Camera';
import Splash_screen from '../splash_screen/Splash_screen';


const Stack = createNativeStackNavigator();


const RouteApp = () => {
 const [showSplashScreen , setShowSplashScreen] = useState(true);

 useEffect(() => {
  setTimeout(() => {
    setShowSplashScreen(false)
  },2000)
 } , [])


  return (
   <Stack.Navigator screenOptions={{headerTitleAlign:'center' , headerShown:false}} >
     {
      showSplashScreen ? (<Stack.Screen name='splash_screen' component={Splash_screen} />) : null
     }
      <Stack.Screen name='LoginScreen' component={LoginScreen}/>
      <Stack.Screen name='Dashboard' component={Dashboard} />
      <Stack.Screen name='camera' component={Camera} />
   </Stack.Navigator>
  )
}

export default RouteApp