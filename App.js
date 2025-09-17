import 'react-native-gesture-handler';
import 'react-native-get-random-values';

import React, {useEffect} from 'react';
import {getOrInitDB, startReplication} from './src/db';

import AppNavigator from './src/navigation/AppNavigator';
import {NavigationContainer} from '@react-navigation/native';

export default function App() {
  useEffect(() => {
    (async () => {
      await getOrInitDB();
      await startReplication();
    })();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
