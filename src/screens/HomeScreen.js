import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {fontScale, scale} from '../utils/responsive';

import BusinessListItem from '../components/BusinessListItem';
import PrimaryButton from '../components/PrimaryButton';
import fonts from '../utils/fonts';
import useBusinessList from '../hooks/useBusinessList';

export default function HomeScreen({navigation}) {
  const data = useBusinessList();

  const handleCreateBusiness = () => {
    navigation.navigate('BusinessCreate');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        style={{marginBottom: scale(15)}}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <BusinessListItem item={item} index={index} />
        )}
      />
      <PrimaryButton
        onPress={handleCreateBusiness}
        title="Create Business"
        style={{marginBottom: scale(10)}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(10),
    justifyContent: 'center',
    backgroundColor: '#000000',
  },

  listContainer: {
    borderRadius: scale(10),
    backgroundColor: '#101010',
    marginBottom: scale(14),
  },
});
