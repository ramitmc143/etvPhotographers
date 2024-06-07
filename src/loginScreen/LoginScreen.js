import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import Icons from 'react-native-vector-icons/EvilIcons';
import Iconss from 'react-native-vector-icons/Feather';
import Iconsss from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import handlePostApi from '../handlePostApi/handlePostApi';
import getFcmToken from '../fcm_token/getFcmToken';

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username , setUsername] = useState('3027024');
  const [password , setPassword] = useState('Ramoji@2024');
  const [userLoginData, setUserLoginData] = useState({});

  

  const handleLoginApi = async () => {
    try {
      const response = await fetch(
        `http://202.62.74.220/etvtracker/Api/getuserlogin?username=${username}&password=${password}`,
      );
      if (!response.ok) {
        Alert.alert('login failed. please try to login again');
      }

      const jsonData = await response.json();
      setUserLoginData(jsonData);
      console.log('jsonData:-',jsonData)

      await AsyncStorage.setItem('userLoginData', JSON.stringify(jsonData));
      // user validation
      if (jsonData.data.username == username) {
        Alert.alert('loggedIn successfully');
        navigation.navigate('Dashboard', {userLoginData: jsonData});

        // check if it's the first time the app is opened

        const isFirstTie = await AsyncStorage.getItem('isFirstTime');

        if (isFirstTie === null) {
          // first time opening the app
          await AsyncStorage.setItem('isFirstTime', 'true');
          await handlePostApi(jsonData);
        } else {
          // Not the first time opening the app
          const storedToken = await AsyncStorage.getItem('fcmToken');
          const currentToken = await getFcmToken();

          if (storedToken !== currentToken) {
            await handlePostApi(jsonData);
          }
        }
        // await handlePostApi();
      } else {
        Alert.alert('username and password did not match');
      }
    } catch (error) {
      console.log('Error fetching Data in handleLoginApi: ', error);
      // Alert.alert('sometthing went wrong in handleLoginApi. Please try again');
    }
  };

  const navigation = useNavigation();

  const handleIcons = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ScrollView
      style={{backgroundColor: '#000000', width: '100%', height: '100%'}}>
      <View>
        <View style={styles.squire}>
          <View style={styles.circle}>
            <Image
              source={require('../Assets/Images/ETVnewLogo.png')}
              style={styles.logo}
            />
          </View>
        </View>
        <View style={styles.triangle}></View>
        <Text style={styles.login}>Login</Text>
        <View style={styles.textInputField_Container}>
          <View style={styles.input_container}>
            <Text style={styles.label_text}>UserID</Text>
            <TextInput
              style={styles.inputField}
              placeholder="enter username"
              onChangeText={Username => setUsername(Username)}
            />
          </View>
          <View style={{height: 1, backgroundColor: '#FFFFFF'}} />
          <View style={styles.input_container}>
            <Text style={styles.label_text}>Password</Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <TextInput
                style={[
                  styles.inputField,
                  showPassword ? {width: '90%'} : {width: '85%'},
                ]}
                placeholder="enter password"
                secureTextEntry={showPassword ? false : true}
                onChangeText={Password => setPassword(Password)}></TextInput>
              {showPassword ? (
                <TouchableOpacity
                  onPress={handleIcons}
                  style={{left: '-13%', top: '1%'}}>
                  <Iconss name="eye-off" size={25} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleIcons}>
                  <Icons name="eye" size={40} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>   
          </View>
          <View style={{height: 1, backgroundColor: '#FFFFFF'}} />
        </View>
        <TouchableOpacity style={styles.login_button} onPress={handleLoginApi}>
          <Text style={{color: '#FFFFFF', textAlign: 'center'}}>Log in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  shape_container: {
    // height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    overflow: 'hidden',
    borderRadius: 10, // Adjust the radius as needed
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 250,
    borderRightWidth: 250,
    borderBottomWidth: 180,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000000',
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: -50,
    transform: [{rotate: '0.7 deg'}],
    top: '-16%',
  },
  squire: {
    flex: 1,
    //position: 'absolute',
    width: '100%',
    height: 400,
    backgroundColor: '#1E293B',
    top: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    top: 0,
  },
  logo: {
    width: '60%',
    height: '60%',
    // height:100
    left: '22%',
    top: '18%',
    opacity: 0.9,
  },
  login: {
    color: '#FFFFFF',
    fontSize: 32,
    top: '-32%',
    left: '40%',
    fontWeight: 'bold',
  },
  textInputField_Container: {
    width: '70%',
    left: '15%',
    top: '-20%',
  },
  inputField: {
    // backgroundColor:"white",
    color: '#CCCCCC',
  },
  label_text: {
    color: '#FFFFFF',
  },
  input_container: {
    marginTop: '4%',
  },
  login_button: {
    width: '70.5%',
    height: '5%',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    top: '-15%',
    left: '15%',
    borderRadius: 8,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 200 / 2,
    backgroundColor: '#FFFEF2',
    left: '31%',
    marginTop: '4%',
  },
});

