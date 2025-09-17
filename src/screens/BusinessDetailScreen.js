import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {fontScale, scale} from '../utils/responsive';

import ArticleListItem from '../components/ArticleListItem';
import PrimaryButton from '../components/PrimaryButton';
import React from 'react';
import useArticleList from '../hooks/useArticleList';

export default function BusinessDetailScreen({route, navigation}) {
  const {businessId, name} = route.params;
  const data = useArticleList(businessId);

  const handleCreateArticle = () => {
    navigation.navigate('ArticleCreate', {businessId});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{name}</Text>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        style={{marginBottom: scale(15)}}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <ArticleListItem item={item} index={index} />
        )}
      />

      <PrimaryButton
        title="Create Article"
        onPress={handleCreateArticle}
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
  header: {
    fontSize: fontScale(20),
    fontWeight: '600',
    marginBottom: scale(12),
    color: '#fff',
  },
  item: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(8),
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    marginVertical: scale(2),
    borderRadius: 4,
  },
  title: {fontSize: 16, fontWeight: '500'},
});
