import {StyleSheet, Text, View} from 'react-native';

import NetInfo from '@react-native-community/netinfo';
import React from 'react';
import {replicationStatus$} from '../db/replicationState';

export default function SyncStatusBar() {
  const [status, setStatus] = React.useState('Idle');
  const [last, setLast] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [online, setOnline] = React.useState(true);

  React.useEffect(() => {
    const sub = replicationStatus$.subscribe(s => {
      setOnline(s.online);
      setError(s.error);
      setLast(s.last);
      setStatus(s.active ? 'Syncing...' : 'Idle');
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <View style={styles.bar}>
      <Text style={styles.text}>
        {status}
        {online ? '' : ' (offline)'}
        {last ? `  Last: ${new Date(last).toLocaleString()}` : ''}
      </Text>
      {!!error && <Text style={[styles.text, {color: 'red'}]}>Error</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: '#f2f2f2',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  text: {textAlign: 'center'},
});
