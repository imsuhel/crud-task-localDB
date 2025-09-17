import * as Yup from 'yup';

import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {deleteArticle, getOrInitDB, updateArticle} from '../db/helpers';
import {fontScale, scale} from '../utils/responsive';

import {Formik} from 'formik';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import fonts from '../utils/fonts';

const Schema = Yup.object().shape({
  name: Yup.string().required('Required'),
  qty: Yup.number().required('Required').min(0),
  selling_price: Yup.number().required('Required').min(0),
});

export default function ArticleDetailScreen({route, navigation}) {
  const {article} = route.params;
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    Alert.alert(
      'Delete Article',
      'Are you sure you want to delete this article?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteArticle(null, article.id);
              Alert.alert('Success', 'Article deleted');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ],
    );
  };

  const handleUpdate = async (values, {setSubmitting}) => {
    try {
      await updateArticle(null, article.id, values);
      Alert.alert('Success', 'Article updated');
      setIsEditing(false);
      navigation.setParams({article: {...article, ...values}});
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <Formik
          initialValues={{
            name: article.name,
            qty: article.qty.toString(),
            selling_price: article.selling_price.toString(),
          }}
          validationSchema={Schema}
          onSubmit={handleUpdate}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            isSubmitting,
            errors,
            touched,
          }) => (
            <>
              <View style={{flex: 1}}>
                <InputField
                  name="name"
                  placeholder="Name"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />

                <InputField
                  name="qty"
                  placeholder="Quantity"
                  onChangeText={handleChange('qty')}
                  onBlur={handleBlur('qty')}
                  value={values.qty}
                />
                {touched.qty && errors.qty && (
                  <Text style={styles.error}>{errors.qty}</Text>
                )}

                <InputField
                  name="selling_price"
                  placeholder="Selling Price"
                  keyboardType="numeric"
                  onChangeText={handleChange('selling_price')}
                  onBlur={handleBlur('selling_price')}
                  value={values.selling_price}
                />
                {touched.selling_price && errors.selling_price && (
                  <Text style={styles.error}>{errors.selling_price}</Text>
                )}

                <InputField
                  name="selling_price"
                  placeholder="Selling Price"
                  keyboardType="numeric"
                  style={styles.input}
                  onChangeText={handleChange('selling_price')}
                  onBlur={handleBlur('selling_price')}
                  value={values.selling_price}
                />
                {touched.selling_price && errors.selling_price && (
                  <Text style={styles.error}>{errors.selling_price}</Text>
                )}
              </View>

              <View style={styles.buttonContainer}>
                <View style={styles.buttonHalf}>
                  <PrimaryButton
                    title="Cancel"
                    onPress={() => setIsEditing(false)}
                    style={{backgroundColor: '#ff4444'}}
                  />
                </View>
                <View style={styles.buttonHalf}>
                  <PrimaryButton
                    title="Save Changes"
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                  />
                </View>
              </View>
            </>
          )}
        </Formik>
      ) : (
        <>
          <View style={{flex: 1}}>
            <Text style={styles.label}>Name: {article.name}</Text>
            <Text style={styles.label}>Quantity: {article.qty}</Text>
            <Text style={styles.label}>
              Selling Price: ${parseFloat(article.selling_price).toFixed(2)}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonHalf}>
              <PrimaryButton title="Edit" onPress={() => setIsEditing(true)} />
            </View>
            <View style={styles.buttonHalf}>
              <PrimaryButton
                title="Delete"
                onPress={handleDelete}
                style={{backgroundColor: '#ff4444'}}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(10),
    backgroundColor: '#000000',
  },

  listContainer: {
    borderRadius: scale(10),
    backgroundColor: '#101010',
    marginBottom: scale(14),
  },

  label: {
    fontSize: fontScale(13),
    marginBottom: scale(8),
    color: '#fff',
    fontFamily: fonts.RobotoBold,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: scale(10),
    fontSize: fontScale(16),
    borderRadius: scale(6),
    marginBottom: scale(16),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: scale(20),
    columnGap: scale(20),
    paddingBottom: scale(10),
  },
  buttonHalf: {
    flex: 1,
  },
  button: {
    margin: scale(10),
  },
  error: {
    color: 'red',
    marginBottom: scale(8),
  },
});
