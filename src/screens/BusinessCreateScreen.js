import * as Yup from 'yup';

import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {fontScale, scale} from '../utils/responsive';

import {Formik} from 'formik';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import React from 'react';
import {createBusiness} from '../db/helpers';
import fonts from '../utils/fonts';

const Schema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(30, 'Too Long!')
    .required('Required'),
});

export default function BusinessCreateScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Formik
        initialValues={{name: ''}}
        validationSchema={Schema}
        onSubmit={async (values, {resetForm}) => {
          try {
            await createBusiness(null, {name: values.name});
            Alert.alert('Success', 'Business created');
            resetForm();
            navigation.goBack();
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          errors,
          values,
          touched,
        }) => (
          <View style={{flex: 1}}>
            <View style={{flex: 1}}>
              <Text style={styles.title}>Write your business name here</Text>

              <InputField
                name="name"
                placeholder="Business name"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />

              <Text style={styles.error}>{errors.name}</Text>
            </View>

            <PrimaryButton
              title="Create"
              onPress={handleSubmit}
              style={{marginBottom: scale(10)}}
            />
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: scale(16), backgroundColor: '#000'},
  input: {
    borderWidth: 1,
    borderColor: '#1e1d1d',
    borderRadius: scale(6),
    paddingVertical: scale(18),
    paddingHorizontal: scale(14),
    marginBottom: scale(12),
    color: '#fff',
  },
  title: {
    fontSize: fontScale(16),
    fontFamily: fonts.RobotoMedium,
    color: '#fff',
    marginBottom: scale(10),
  },
  error: {
    color: '#f80000',
    fontSize: fontScale(12),
    fontFamily: fonts.RobotoMedium,
    marginBottom: scale(10),
  },
});
