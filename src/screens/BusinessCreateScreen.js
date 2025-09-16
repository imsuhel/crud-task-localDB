import React from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createBusiness } from '../db/helpers';

const Schema = Yup.object().shape({
  name: Yup.string().required('Required'),
});

export default function BusinessCreateScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={Schema}
        onSubmit={async (values, { resetForm }) => {
          try {
            await createBusiness(null, { name: values.name });
            Alert.alert('Success', 'Business created');
            resetForm();
            navigation.goBack();
          } catch (e) {
            Alert.alert('Error', e.message);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <TextInput
              placeholder="Business name"
              style={styles.input}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            <Button title="Create" onPress={handleSubmit} />
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 12 },
});


