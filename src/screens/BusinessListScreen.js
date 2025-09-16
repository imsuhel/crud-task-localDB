import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import React from 'react';
import {initDB} from '../db';
import {listBusinesses} from '../db/helpers';
import useReactiveQuery from '../hooks/useReactiveQuery';

export default function BusinessListScreen({navigation}) {
  const [query, setQuery] = React.useState(null);
  const data = useReactiveQuery(
    query || {exec: async () => [], $: {subscribe: () => ({unsubscribe() {}})}},
  );

  React.useEffect(() => {
    (async () => {
      const db = await initDB();
      const q = await listBusinesses(db);
      setQuery(q);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate('BusinessDetail', {
                businessId: item.id,
                name: item.name,
              })
            }>
            <Text style={styles.title}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  item: {padding: 16, borderBottomWidth: 1, borderColor: '#eee'},
  title: {fontSize: 16},
});
