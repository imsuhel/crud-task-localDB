import ArticleCreateScreen from '../screens/ArticleCreateScreen';
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import BusinessCreateScreen from '../screens/BusinessCreateScreen';
import BusinessDetailScreen from '../screens/BusinessDetailScreen';
import HomeScreen from '../screens/HomeScreen';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          color: '#fff',
        },
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />

      <Stack.Screen
        name="BusinessCreate"
        component={BusinessCreateScreen}
        options={{title: 'Create Business'}}
      />
      <Stack.Screen
        name="BusinessDetail"
        component={BusinessDetailScreen}
        options={{title: 'Business'}}
      />
      <Stack.Screen
        name="ArticleCreate"
        component={ArticleCreateScreen}
        options={{title: 'Create Article'}}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{title: 'Article Details'}}
      />
    </Stack.Navigator>
  );
}
