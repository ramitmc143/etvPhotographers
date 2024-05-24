import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Linking,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from './Header';
import Iconss from 'react-native-vector-icons/FontAwesome';
import Iconsss from 'react-native-vector-icons/Ionicons';
import Iconssss from 'react-native-vector-icons/AntDesign';
import Iconsssss from 'react-native-vector-icons/MaterialCommunityIcons';
import Iconssssss from 'react-native-vector-icons/MaterialIcons';
import Iconsssssss from 'react-native-vector-icons/FontAwesome5';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import handleEmployeeApi from '../handleEmployeeApi/handleEmployeeApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import AndroidOpenSettings from 'react-native-android-open-settings';
import handle_Pr_Ab from '../handle_Pr_Ab/handle_Pr_Ab';
// import nineToOnePm from '../pr_ab/nineToOnePm';
// import onePmToFivePm from '../pr_ab/onePmToFivePm';
// import filterTodayPunchIns from '../filterTodayPunchIns/filterTodayPunchIns';

const Dashboard = ({route}) => {
  const {userLoginData} = route.params || {};
  const [loginData, setLoginData] = useState({});
  const [isPunchDisabled, setIsPunchDisabled] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [userLoginResponse, setUserLoginResponse] = useState({});
  const [showLoading, setShowLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [todayPunchData, setTodayPunchData] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});

  const navigation = useNavigation();

  console.log('userLoginData of loginScreen', userLoginData.data.username);


// backHandler action
  React.useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Hold on!",
        "Are you sure you want to exit the app?",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          {
            text: "OK",
            onPress: () => BackHandler.exitApp()
          }
        ],
        { cancelable: true }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);


  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      handleTodayPunch();
      handleAttendance();
      let interValId;
      if (interValId) {
        interValId = setInterval(() => {
          const endTime = new Date();
          const diff = endTime.getTime() - startTime.getTime();
          const seconds = Math.floor(diff / 1000);
          setDuration(seconds);
        }, 1000);
      } else {
        clearInterval(interValId);
      }
      return () => {
        clearInterval(interValId);
      };
    }, [employeeData]),
  );

  const fetchData = async () => {
    try {
      const employeeResponse = await handleEmployeeApi(
        userLoginData.data.username,
      );
      setEmployeeData(employeeResponse.data);

      const userLoginAsyncData = await AsyncStorage.getItem('userLoginData');
      const parsedUserLoginDataAsyncData = JSON.parse(userLoginAsyncData);
      if (parsedUserLoginDataAsyncData) {
        setUserLoginResponse(parsedUserLoginDataAsyncData);
        console.log(
          'parsedUserLoginDataAsyncData stored in userLoginResponse state',
        );
      } else {
        setUserLoginResponse(userLoginData);
        console.log('userLoginData stored in userLoginResponse state');
      }
    } catch (error) {
      console.log('Error in fetchData of Dashboard screen:', error);
      // Handle the error here, e.g., show an alert to the user
      // Alert.alert('something went wrong in fetchData, please try again');
    }
  };

  const handlePunch = async () => {
    setIsPunchDisabled(true);
    try {
      // Show loading icon
      setShowLoading(true);

      // Check if location permission is granted
      const locationPermissionStatus = await check(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );

      if (locationPermissionStatus !== RESULTS.GRANTED) {
        // Request location permission
        const permissionRequestResult = await request(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );

        if (permissionRequestResult !== RESULTS.GRANTED) {
          // Show alert to inform user that location permission is required
          Alert.alert(
            'Location Permission Required',
            'Please grant location permission to continue',
            [
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: async () => {
                  // Open location settings if user agrees
                  await AndroidOpenSettings.locationSourceSettings();
                  navigation.navigate('camera', {
                    userLoginData: userLoginData,
                  });
                },
              },
            ],
            {cancelable: false},
          );
          return;
        }
      }

      // Call handlePunchApi()
      // await handlePunchApi(userLoginResponse);
      // navigation.navigate('camera', {userLoginData: userLoginResponse});

      fetchData();

      // Hide loading icon
      setShowLoading(false);

      // Update state to indicate successful punch
      // setLastWeekData(true);
      // Alert.alert('You have punched successfully');
    } catch (error) {
      console.log('Error while punching:', error);
      // Handle the error here, e.g., show an alert to the user
      Alert.alert('Failed to punch, please try again');
    } finally {
      // Re-enable the punch button after 5 seconds
      setTimeout(() => {
        setIsPunchDisabled(false);
      }, 3000);
    }
  };

  const todayDate = new Date();
  const dd = String(todayDate.getDate()).padStart(2, '0');
  const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
  const yyyy = todayDate.getFullYear();
  const hours = String(todayDate.getHours()).padStart(2, '0');
  const minutes = String(todayDate.getMinutes()).padStart(2, '0');
  const seconds = String(todayDate.getSeconds()).padStart(2, '0');
  const formattedDate = `${dd}-${mm}-${yyyy} ${hours}:${minutes}:${seconds}`;

  const handleTodayPunch = async () => {
    try {
      if (Array.isArray(employeeData)) {
        const todayPunchIns = employeeData.filter(item => {
          const punchInDate = new Date(item.punch_in);
          const today = new Date();
          return (
            punchInDate.getDate() === today.getDate() &&
            punchInDate.getMonth() === today.getMonth() &&
            punchInDate.getFullYear() === today.getFullYear()
          );
        });
        setTodayPunchData(todayPunchIns);
      } else {
        // Handle the case when employeeData is not an array (e.g., set an empty array as todayPunchData)
        setTodayPunchData([]);
      }
    } catch (error) {
      console.log('Error in handleTodayPunch:', error);
      // Handle the error here, e.g., show an alert to the user
      Alert.alert("Failed to process today's punch data, please try again");
      // Optionally, you can set an empty array as todayPunchData in case of an error
      setTodayPunchData([]);
    }
  };

  const handlePressNext = () => {
    try {
      const todayPunchIns = employeeData.filter(item => {
        const punchInDate = new Date(item.punch_in);
        const today = new Date();
        return (
          punchInDate.getDate() === today.getDate() &&
          punchInDate.getMonth() === today.getMonth() &&
          punchInDate.getFullYear() === today.getFullYear()
        );
      });

      const remainingItems = todayPunchIns.length - (startIndex + 3);
      if (remainingItems >= 3) {
        setStartIndex(prevIndex => prevIndex + 3);
      } else {
        setStartIndex(todayPunchIns.length - 3);
      }
    } catch (error) {
      console.log('Error in handlePressNext:', error);
      // Handle the error here, e.g., show an alert to the user
      // Alert.alert('Failed to load next punch data, please try again');
      // Optionally, you can reset the startIndex or take other corrective actions
      setStartIndex(0);
    }
  };

  const handlePressPrevious = () => {
    try {
      const todayPunchIns = employeeData.filter(item => {
        const punchInDate = new Date(item.punch_in);
        const today = new Date();
        return (
          punchInDate.getDate() === today.getDate() &&
          punchInDate.getMonth() === today.getMonth() &&
          punchInDate.getFullYear() === today.getFullYear()
        );
      });

      setStartIndex(prevIndex =>
        prevIndex === 0 ? 0 : Math.max(0, prevIndex - 3),
      );
    } catch (error) {
      console.log('Error in handlePressPrevious:', error);
      // Handle the error here, e.g., show an alert to the user
      // Alert.alert('Failed to load previous punch data, please try again');
      // Optionally, you can reset the startIndex or take other corrective actions
      setStartIndex(0);
    }
  };

  const handleAttendance = async () => {
    try {
      const response = await handle_Pr_Ab(userLoginData.data.username);
      setAttendanceData(response.data);
    } catch (error) {
      console.log('error in handleAttendance:--', error);
    }
  };

  console.log('todayPunchData:-------', todayPunchData.length);
  console.log('attendanceData:-', attendanceData);
  console.log('employeeData:- ', employeeData.length);
  return (
    <View>
      <ScrollView style={{}}>
        {/* ------Header------- */}
        <Header />
        {/* ------User Details------- */}
        <View style={{backgroundColor: '#28282B', width: '100%'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: '5%',
            }}>
            <Iconss name="photo" size={75} color="#9747FF" />
            <View
              style={{
                backgroundColor: '#646362',
                borderRadius: 10,
                width: '70%',
                justifyContent: 'center',
              }}>
              {/*Name View */}
              <View style={{flexDirection: 'row', marginLeft: 8}}>
                <View style={{width: '40%'}}>
                  <Text
                    style={{color: '#FFFFFF', fontSize: 16, fontWeight: '800'}}>
                    Name:
                  </Text>
                </View>

                <View style={{width: '60%'}}>
                  <Text
                    style={{color: '#FFFFFF', fontSize: 16, fontWeight: '800'}}>
                    {userLoginData?.data?.name}
                  </Text>
                </View>
              </View>

              {/*Emp code View */}
              <View style={{flexDirection: 'row', marginLeft: 8}}>
                <View style={{width: '40%'}}>
                  <Text
                    style={{color: '#FFFFFF', fontSize: 16, fontWeight: '800'}}>
                    E.code:
                  </Text>
                </View>

                <View style={{width: '60%'}}>
                  <Text
                    style={{color: '#FFFFFF', fontSize: 16, fontWeight: '800'}}>
                    {userLoginData?.data?.id}
                  </Text>
                </View>
              </View>

              {/*Designation View */}
              <View style={{flexDirection: 'row', marginLeft: 8}}>
                <View style={{width: '40%'}}>
                  <Text
                    style={{color: '#FFFFFF', fontSize: 16, fontWeight: '800'}}>
                    Designation:
                  </Text>
                </View>

                <View style={{width: '60%'}}>
                  <Text
                    style={{color: '#FFFFFF', fontSize: 16, fontWeight: '800'}}>
                    {userLoginData?.data?.proffesion}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* ------Attendance------- */}
          <View
            style={{width: '100%', height: 1.5, backgroundColor: '#858585'}}
          />
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 20,
              }}>
              <Text
                style={{color: '#FFFFFF', fontSize: 19, fontWeight: 'bold'}}>
                Attendance
              </Text>
              <Text
                style={{color: '#FFFFFF', fontSize: 13, fontWeight: 'bold'}}>
                Today - {formattedDate}
              </Text>
            </View>

            {/* ------------------------------------------------------------------ */}

            <View>
              <View>
                <View>
                  {Array.isArray(employeeData) && employeeData.length === 0 ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: '12%',
                      }}>
                      <Text
                        style={{
                          color: '#DAC0A3',
                          fontSize: 16,
                          fontWeight: 'bold',
                          textAlign: 'center',
                          top: '10%',
                          left: '-40%',
                        }}>
                        No punch yet
                      </Text>
                    </View>
                  ) : (
                    (() => {
                      const today = new Date();
                      const punchInsToday = employeeData.filter(item => {
                        const punchInDate = new Date(item.punch_in);
                        return (
                          punchInDate.getDate() === today.getDate() &&
                          punchInDate.getMonth() === today.getMonth() &&
                          punchInDate.getFullYear() === today.getFullYear()
                        );
                      });

                      if (punchInsToday.length === 0) {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginLeft: '12%',
                            }}>
                            <Text
                              style={{
                                color: '#DAC0A3',
                                fontSize: 16,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                top: '10%',
                                left: '-40%',
                              }}>
                              You have not punched today
                            </Text>
                          </View>
                        );
                      } else {
                        return punchInsToday
                          .slice(startIndex, startIndex + 3)
                          .map((item, index) => (
                            <View
                              key={index.toString()}
                              style={{
                                flexDirection: 'row',
                                marginLeft: '12%',
                              }}>
                              <Text
                                style={{
                                  color: '#65B741',
                                  fontSize: 20,
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                }}>
                                {item?.punch_in}
                              </Text>
                            </View>
                          ));
                      }
                    })()
                  )}
                </View>
              </View>

              <View
                style={{
                  width: '25%',
                  height: 100,
                  position: 'absolute',
                  right: '5%',
                  top: '-2%',
                  borderLeftWidth: 1.5,
                  borderColor: '#858585',
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: '20%',
                  }}>
                  {attendanceData?.first_shift}
                </Text>
                <View
                  style={{
                    width: '100%',
                    height: 1.5,
                    backgroundColor: '#858585',
                    marginTop: '15%',
                  }}
                />
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: '13%',
                  }}>
                  {attendanceData?.second_shift}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: '6%',
                  position: 'absolute',
                  top: 120,
                }}>
                <TouchableOpacity onPress={handlePressPrevious} style={{}}>
                  <Iconssss
                    name="left"
                    size={30}
                    style={{
                      color: '#FFFFFF',
                      textAlign: 'center',
                      fontWeight: '800',
                      marginLeft: '3%',
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePressNext}
                  style={{position: 'absolute', right: '-800%'}}>
                  <Iconssss
                    name="right"
                    size={30}
                    style={{
                      color: '#FFFFFF',
                      textAlign: 'center',
                      fontWeight: '800',
                      marginLeft: '3%',
                    }}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 13,
                  textAlign: 'center',
                  position: 'absolute',
                  bottom: -150,
                  left: '21%',
                }}>
                General Time 09:00 Am to 05:30 Pm
              </Text>
            </View>

            {/* -------------------------------------------------------------------- */}
          </View>
          {/* ------Notifications------ */}
          <View
            style={{
              width: '100%',
              height: 1.5,
              backgroundColor: '#858585',
              marginTop: '45%',
            }}
          />
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: '8%',
              }}>
              <Iconsss
                name="notifications"
                size={55}
                color="#9747FF"
                style={{marginLeft: '10%'}}
              />
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginRight: '15%',
                  marginTop: '4%',
                }}>
                Notifications
              </Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableOpacity style={styles.notification_Logo_Container}>
                <Iconsss
                  name="information-circle"
                  size={25}
                  color="#2F88FF"
                  style={{margin: '10%', textAlign: 'center'}}
                />
                <Text style={{color: '#2F88FF', textAlign: 'center'}}>
                  Cerculars
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.notification_Logo_Container}>
                <Iconssssss
                  name="event"
                  size={25}
                  color="#F1416C"
                  style={{margin: '10%', textAlign: 'center'}}
                />
                <Text style={{color: '#F1416C', textAlign: 'center'}}>
                  Events
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.notification_Logo_Container}>
                <Iconsssss
                  name="party-popper"
                  size={25}
                  color="#00FF66"
                  style={{margin: '10%', textAlign: 'center'}}
                />
                <Text style={{color: '#00FF66', textAlign: 'center'}}>
                  Holiday List
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* ------Bottom------ */}
          <View
            style={{
              width: '100%',
              height: 1.5,
              backgroundColor: '#858585',
              marginTop: '4%',
            }}
          />
          <View style={{marginTop: '4%', marginBottom: '4%'}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableOpacity style={styles.bottom_Button}>
                <Text style={styles.bottom_Button_text}>FAQ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottom_Button}>
                <Text style={styles.bottom_Button_text}>How To Use App</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={{position: 'absolute', bottom: '5%', right: '45%', zIndex: 1}}>
        <TouchableOpacity
          onPress={() => {
            handlePunch();
          }}
          disabled={isPunchDisabled}
          style={[
            styles.button,
            isPunchDisabled ? styles.disabledButton : null,
          ]}>
          <Iconsssssss
            name="fingerprint"
            size={42}
            color="#fff"
            style={{
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  notification_Logo_Container: {
    width: '25%',
    height: 70,
    backgroundColor: '#1C3238',
    borderRadius: 15,
    justifyContent: 'center',
  },
  bottom_Button: {
    width: '40%',
    height: 80,
    backgroundColor: '#1C3238',
    justifyContent: 'center',
    borderRadius: 10,
  },
  bottom_Button_text: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    padding: 5,
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
