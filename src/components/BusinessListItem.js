import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import React from 'react';

export default function BusinessListItem({item, onPress}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {padding: 16, borderBottomWidth: 1, borderColor: '#eee'},
  title: {fontSize: 16},
});
