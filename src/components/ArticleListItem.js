import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {fontScale, scale} from '../utils/responsive';

import React from 'react';
import fonts from '../utils/fonts';
import {useNavigation} from '@react-navigation/native';

export default function ArticleListItem({item, index}) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('ArticleDetail', {article: item});
  };

  return (
    <View style={[styles.item, index === 0 && {borderTopWidth: 0}]}>
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>
          Qty: {item.qty} | Price: {item.selling_price}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: scale(18),
    paddingHorizontal: scale(14),
    borderTopWidth: 1,
    borderTopColor: '#1e1d1d',
  },
  title: {
    fontSize: fontScale(14),
    fontFamily: fonts.RobotoBold,
    color: '#fff',
    marginBottom: scale(10),
  },
  subtitle: {
    fontSize: fontScale(11),
    fontFamily: fonts.RobotoRegular,
    color: '#fff',
  },
});
