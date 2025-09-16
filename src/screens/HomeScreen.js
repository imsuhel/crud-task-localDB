import {Button, StyleSheet, View} from 'react-native';
import {initDB, startReplication} from '../db';

import React from 'react';
import SyncStatusBar from './SyncStatusBar';

export default function HomeScreen({navigation}) {
  React.useEffect(() => {
    (async () => {
      const db = await initDB();
      await startReplication();
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title="Create Business"
        onPress={() => navigation.navigate('BusinessCreate')}
      />
      <View style={{height: 12}} />
      <Button
        title="List Businesses"
        onPress={() => navigation.navigate('BusinessList')}
      />
      <SyncStatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, justifyContent: 'center'},
});
