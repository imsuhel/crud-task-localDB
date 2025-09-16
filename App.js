import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import AppNavigator from './src/navigation/AppNavigator';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {initDB} from './src/db';

export default function App() {
  React.useEffect(() => {
    initDB().catch(() => {});
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
