import {StyleSheet, TextInput} from 'react-native';

import React from 'react';
import {scale} from '../utils/responsive';

const InputField = ({
  onChangeText,
  handleBlur,
  value,
  keyboardType,
  placeholder,
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#989898"
      style={styles.input}
      onChangeText={onChangeText}
      onBlur={handleBlur}
      value={value}
      keyboardType={keyboardType}
    />
  );
};

export default InputField;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#1e1d1d',
    borderRadius: scale(6),
    paddingVertical: scale(18),
    paddingHorizontal: scale(14),
    marginBottom: scale(12),
    color: '#fff',
  },
});
