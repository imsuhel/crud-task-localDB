import {Button, FlatList, StyleSheet, Text, View} from 'react-native';

import React from 'react';
import {initDB} from '../db';
import {listArticlesByBusiness} from '../db/helpers';
import useReactiveQuery from '../hooks/useReactiveQuery';

export default function BusinessDetailScreen({route, navigation}) {
  const {businessId, name} = route.params;
  const [query, setQuery] = React.useState(null);
  const data = useReactiveQuery(
    query || {exec: async () => [], $: {subscribe: () => ({unsubscribe() {}})}},
  );

  React.useEffect(() => {
    (async () => {
      const db = await initDB();
      const q = await listArticlesByBusiness(db, businessId);
      setQuery(q);
    })();
  }, [businessId]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{name}</Text>
      <Button
        title="Create Article"
        onPress={() => navigation.navigate('ArticleCreate', {businessId})}
      />
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>
              Qty: {item.qty} | Price: {item.selling_price}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  header: {fontSize: 20, fontWeight: '600', marginBottom: 12},
  item: {paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee'},
  title: {fontSize: 16, fontWeight: '500'},
});
