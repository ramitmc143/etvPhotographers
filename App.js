import { Text, View } from 'react-native'
import React, { Component } from 'react'
import LoginScreen from './src/loginScreen/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import RouteApp from './src/navigation/RouteApp';

export class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <RouteApp />
      </NavigationContainer>
    )
  }
}

export default App