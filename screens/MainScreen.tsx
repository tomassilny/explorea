import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';

import * as Font from 'expo-font';
import MapScreen from './MapScreen'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Tab1"
  >
    <Tab.Screen
      name="Tab1"
      component={MapScreen}
    />
    
  </Tab.Navigator>
);

export default MainScreen;
