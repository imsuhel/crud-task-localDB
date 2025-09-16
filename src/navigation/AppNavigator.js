import ArticleCreateScreen from '../screens/ArticleCreateScreen';
import BusinessCreateScreen from '../screens/BusinessCreateScreen';
import BusinessDetailScreen from '../screens/BusinessDetailScreen';
import BusinessListScreen from '../screens/BusinessListScreen';
import HomeScreen from '../screens/HomeScreen';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="BusinessList"
        component={BusinessListScreen}
        options={{title: 'Businesses'}}
      />
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
    </Stack.Navigator>
  );
}
