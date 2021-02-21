import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import Place from './screens/PlaceScreen'
import Map from './screens/MapScreen'
import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import { View, StyleSheet, Alert } from 'react-native';
import { TouchableOpacity, Text, Modal, TouchableHighlight } from 'react-native';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';
import { FontAwesome5 } from '@expo/vector-icons';
import Add from './components/AddComponent'
import MyPlaces from './components/MyPlacesComponent'
import Search from './components/SearchComponent'

class HomeScreen extends React.Component {
  state = {
    addModalVisible: false,
    myPlacesModalVisible: false,
    searchModalVisible: false
  }

  static navigationOptions: {
    title: "Home"
  }

  goToPlace(place) {
    this.props.navigation.navigate('Place', { place: place });
  }

  render() {
    return (
      <SafeAreaProvider>
        <Map handleClick={(place: undefined) => this.goToPlace(place)}></Map>
      </SafeAreaProvider>
    );
  }
}

class PlaceScreen extends React.Component {
  render() {
    return (
      <View>
        <Place></Place>
      </View>
    );
  }
}

const RootStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <Add></Add>,
      headerRight:
        <View style={{ flexDirection: 'row' }}>
          <MyPlaces></MyPlaces>
        </View>
      ,
      headerTintColor: 'black',
      title: 'Exploria',
    }),
  },
  Place: {
    screen: PlaceScreen,
    navigationOptions: ({ navigation }) => ({
      headerRight: <TouchableOpacity><FontAwesome5 name={"search"} color={"white"} size={20} style={{ marginRight: 15 }}></FontAwesome5></TouchableOpacity>,
      headerTintColor: 'white',
      title: 'Place',
    }),
  },
},
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#15d376',
        elevation: 0,
        shadowOpacity: 0
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#ffffff'
      }
    }
  }
);

const styles = StyleSheet.create({
 
});


const App = createAppContainer(RootStack);

export default App

