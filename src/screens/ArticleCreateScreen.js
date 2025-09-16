import * as Yup from 'yup';

import {Alert, Button, StyleSheet, TextInput, View} from 'react-native';

import {Formik} from 'formik';
import React from 'react';
import {createArticle} from '../db/helpers';

const Schema = Yup.object().shape({
  name: Yup.string().required('Required'),
  qty: Yup.number().required('Required').min(0),
  selling_price: Yup.number().required('Required').min(0),
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
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <View>
            <TextInput
              placeholder="Name"
              style={styles.input}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            <TextInput
              placeholder="Quantity"
              keyboardType="numeric"
              style={styles.input}
              onChangeText={handleChange('qty')}
              onBlur={handleBlur('qty')}
              value={values.qty}
            />
            <TextInput
              placeholder="Selling Price"
              keyboardType="numeric"
              style={styles.input}
              onChangeText={handleChange('selling_price')}
              onBlur={handleBlur('selling_price')}
              value={values.selling_price}
            />
            <Button title="Create" onPress={handleSubmit} />
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
});
