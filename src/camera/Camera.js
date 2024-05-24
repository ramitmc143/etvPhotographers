import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  PermissionsAndroid,
  SafeAreaView,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import handlePunchApi from '../handlePunchApi/handlePunchApi';
import IonIcon from 'react-native-vector-icons/Ionicons';

const Camera = ({ route }) => {
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const navigation = useNavigation();
  const { userLoginData } = route.params;

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs camera permission to capture photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      const storagePermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs storage permission to download the image.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (
        cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
        storagePermission === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Permissions granted in requestPermissions of CameraScreen');
      } else {
        Alert.alert('Permissions denied', 'Camera and Storage permissions are required to use this feature.');
      }
    } catch (err) {
      console.log('Error requesting permissions in requestPermissions of CameraScreen:', err);
      Alert.alert('Failed to request permissions');
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const options = { quality: 0.5, base64: true, width: 150, height: 150 };
        const data = await cameraRef.current.takePictureAsync(options);

        setCapturedImage(data.uri);

        const base64Image = await RNFS.readFile(data.uri, 'base64');

        const dataUri = `data:image/jpeg;base64,${base64Image}`;

        setShowLoading(true);

        const response = await handlePunchApi(userLoginData, dataUri);
        if (response) {
          navigation.navigate('Dashboard', {
            userLoginData: userLoginData,
          });
          Alert.alert('Success', 'You have punched successfully');
        } else {
          Alert.alert('Something went wrong in punch');
        }
      } catch (error) {
        console.log('Error in takePicture:', error);
        Alert.alert('Failed to take picture.');
      } finally {
        setShowLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <RNCamera
          ref={cameraRef}
          style={{ flex: 1 }}
          type={RNCamera.Constants.Type.front}
          captureAudio={false}
        />
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            marginTop: 5,
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <IonIcon
            name="chevron-back-outline"
            size={25}
            color="white"
            style={{ alignSelf: 'center', marginTop: 1 }}
          />
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={takePicture}
            style={{
              height: 80,
              width: 80,
              borderRadius: 80,
              borderWidth: 2,
              backgroundColor: '#fff',
              justifyContent: 'center',
              borderColor: 'green',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'green',
                textAlign: 'center',
                fontSize: 17,
              }}>
              Punch
            </Text>
          </TouchableOpacity>
        </View>
        {capturedImage && (
          <Image
            source={{ uri: capturedImage }}
            style={{
              height: 100,
              width: 100,
              alignSelf: 'center',
              borderRadius: 5,
              marginTop: 10,
            }}
          />
        )}
      </View>
      <Modal animationType="slide" transparent={true} visible={showLoading}>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'grey',
              width: '80%',
              height: '40%',
              borderRadius: 10,
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 19 }}>
              Punch in progress...please wait
            </Text>
            <TouchableOpacity
              style={{ position: 'absolute', left: '5%', top: '5%' }}
              onPress={() => setShowLoading(false)}>
              <Text style={{ fontWeight: 'bold', color: 'red', fontSize: 17 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Camera;

const styles = StyleSheet.create({
  btnText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },
});
