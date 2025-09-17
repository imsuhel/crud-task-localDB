import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {fontScale, moderateScale, scale} from '../utils/responsive';

import React from 'react';
import fonts from '../utils/fonts';
import {useNavigation} from '@react-navigation/native';

export default function BusinessListItem({item, index}) {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate('BusinessDetail', {
      businessId: item.id,
      name: item.name,
    });
  };

  return (
    <TouchableOpacity
      style={[styles.item, index === 0 && {borderTopWidth: 0}]}
      onPress={handlePress}>
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
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
    fontSize: fontScale(12),
    fontFamily: fonts.RobotoMedium,
    color: '#989898',
  },
});
