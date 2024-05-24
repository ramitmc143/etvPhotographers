/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';


// set a global error handler 

ErrorUtils.setGlobalHandler((error , isFatal) => {
    console.log('Global JS Error', error);

    // Log the error to an error reporting service

    if (isFatal) {
    console.log('restart the app or navigate to a safe screen')
    }
})




AppRegistry.registerComponent(appName, () => App);
