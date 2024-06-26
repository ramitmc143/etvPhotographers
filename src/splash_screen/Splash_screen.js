import { View, Image, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Splash_screen = () => {
    const navigation = useNavigation();
const checkLoginStatus = async () => {
    const asyncUserLoginData = await AsyncStorage.getItem('userLoginData');
    const parsedUserLoginData = JSON.parse(asyncUserLoginData);
    const already_loggedIn = await AsyncStorage.getItem('already_loggedIn');
    if (already_loggedIn === null) {
        navigation.navigate('LoginScreen');
    } else {
        navigation.navigate('Dashboard',{userLoginData:parsedUserLoginData});
    }
};

useEffect(() => {
    checkLoginStatus()
} , [])


  return (
    <View style={styles.container}>
      <View style={styles.image_container}>
        <Image
          source={require('../Assets/Images/ETVnewLogo.png')}
          style={styles.image_logo}
        />
      </View>
    </View>
  );
};

export default Splash_screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image_logo: {
    height: 350,
    width: 350,
    borderRadius: 175, // Half of the width and height to make it circular
  },
});
