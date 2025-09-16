import {StyleSheet, Text, View} from 'react-native';

import React from 'react';

export default function ArticleListItem({item}) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>
        Qty: {item.qty} | Price: {item.selling_price}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {padding: 16, borderBottomWidth: 1, borderColor: '#eee'},
  title: {fontSize: 16, fontWeight: '500'},
});
