import * as Yup from 'yup';

import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {fontScale, scale} from '../utils/responsive';

import {Formik} from 'formik';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import React from 'react';
import {createArticle} from '../db/helpers';
import fonts from '../utils/fonts';

const Schema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Required'),
  qty: Yup.number().required('Required').min(0, 'Quantity must be at least 0'),
  selling_price: Yup.number()
    .required('Required')
    .min(0, 'Selling price must be at least 0'),
});

export default function ArticleCreateScreen({route, navigation}) {
  const {businessId} = route.params;
  return (
    <View style={styles.container}>
      <Formik
        initialValues={{name: '', qty: '', selling_price: ''}}
        validationSchema={Schema}
        onSubmit={async (values, {resetForm}) => {
          try {
            await createArticle(null, {...values, business_id: businessId});
            Alert.alert('Success', 'Article created');
            resetForm();
            navigation.goBack();
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        }}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <>
            <View style={{flex: 1}}>
              <InputField
                name="name"
                placeholder="Name"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              {errors.name && <Text style={styles.error}>{errors.name}</Text>}
              <InputField
                name="qty"
                placeholder="Quantity"
                keyboardType="numeric"
                onChangeText={handleChange('qty')}
                onBlur={handleBlur('qty')}
                value={values.qty}
              />
              {errors.qty && <Text style={styles.error}>{errors.qty}</Text>}
              <InputField
                name="selling_price"
                placeholder="Selling Price"
                keyboardType="numeric"
                onChangeText={handleChange('selling_price')}
                onBlur={handleBlur('selling_price')}
                value={values.selling_price}
              />
              {errors.selling_price && (
                <Text style={styles.error}>{errors.selling_price}</Text>
              )}
            </View>
            <PrimaryButton
              title="Create"
              onPress={handleSubmit}
              style={{marginBottom: scale(10)}}
            />
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: scale(16), backgroundColor: '#000'},
  error: {
    color: 'red',
    marginBottom: scale(8),
    fontFamily: fonts.RobotoMedium,
    fontSize: fontScale(14),
  },
});
