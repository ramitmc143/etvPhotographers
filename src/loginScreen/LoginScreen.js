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
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Formik} from 'formik';
import * as Yup from 'yup';
import handlePostApi from '../handlePostApi/handlePostApi';
import getFcmToken from '../fcm_token/getFcmToken';

const LoginScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userLoginData, setUserLoginData] = useState({});

  const navigation = useNavigation();

  const handleLoginApi = async (values, {setSubmitting, setErrors}) => {
    try {
      const response = await fetch(
        `http://etvhrms.com/etvtracker/Api/getuserlogin?username=${values.username}&password=${values.password}`,
      );
      const errorText = await response.text();
      let jsonData;

      if (
        !response.ok ||
        errorText.includes('Invalid Password') ||
        errorText.includes('Invalid Username or Password')
      ) {
        setErrors({username: 'Invalid Username', password: 'Invalid Password'});
        setSubmitting(false);
        return;
      } else {
        jsonData = JSON.parse(errorText); // Parse JSON if response is OK
      }

      setUserLoginData(jsonData);
      console.log('jsonData:', jsonData);

      await AsyncStorage.setItem('userLoginData', JSON.stringify(jsonData));
     
      await AsyncStorage.setItem('already_loggedIn' , 'true')
    
      if (jsonData.data.username === values.username) {
        Alert.alert('Logged in successfully');
        navigation.navigate('Dashboard', {userLoginData: jsonData});

        const isFirstTime = await AsyncStorage.getItem('isFirstTime');

        if (isFirstTime === null) {
          await AsyncStorage.setItem('isFirstTime', 'true');
          await handlePostApi(jsonData);
        } else {
          const storedToken = await AsyncStorage.getItem('fcmToken');
          const currentToken = await getFcmToken();

          if (storedToken !== currentToken) {
            await handlePostApi(jsonData);
          }
        }
      } else {
        Alert.alert('Username and password did not match');
      }
    } catch (error) {
      console.log('Error fetching Data in handleLoginApi: ', error);
      Alert.alert('Something went wrong in handleLoginApi. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    username: Yup.number().required('Username is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

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
        <Formik
          initialValues={{username: '', password: ''}}
          validationSchema={validationSchema}
          onSubmit={handleLoginApi}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <>
              <View style={styles.textInputField_Container}>
                <View style={styles.input_container}>
                  <Text style={styles.label_text}>UserID</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="enter username"
                    value={values.username}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                  />
                  {errors.username && touched.username && (
                    <Text style={{color: 'red'}}>{errors.username}</Text>
                  )}
                </View>
                <View style={{height: 1, backgroundColor: '#FFFFFF'}} />
                <View style={styles.input_container}>
                  <Text style={styles.label_text}>Password</Text>
                  <View
                    style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <TextInput
                      style={[
                        styles.inputField,
                        showPassword ? {width: '90%'} : {width: '85%'},
                      ]}
                      placeholder="enter password"
                      secureTextEntry={!showPassword}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                    />
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
                  {errors.password && touched.password && (
                    <Text style={{color: 'red'}}>{errors.password}</Text>
                  )}
                </View>
                <View style={{height: 1, backgroundColor: '#FFFFFF'}} />
              </View>

              <TouchableOpacity
                style={styles.login_button}
                onPress={handleSubmit}
                disabled={isSubmitting}>
                <Text style={{color: '#FFFFFF', textAlign: 'center'}}>
                  Log in
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  shape_container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    overflow: 'hidden',
    borderRadius: 10,
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
    top: '-13%',
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