import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {fontScale, moderateScale} from '../utils/responsive';

import React from 'react';
import fonts from '../utils/fonts';

const PrimaryButton = ({onPress, title, disabled, style}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.createButton, style]}
      disabled={disabled}>
      <Text style={styles.createButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  createButton: {
    backgroundColor: '#138280',
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: fontScale(14),
    fontFamily: fonts.RobotoBold,
  },
});
