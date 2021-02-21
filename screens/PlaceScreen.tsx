import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';

import * as Font from 'expo-font';

class Place extends React.Component {
  constructor(props){
    super(props);  

  }


  state = {
    place: []
  };

  componentDidMount() {

    console.log(this.props.place);

  }

 
  render() {
    return (
      <View>
        <Text>Halaala</Text>
        <Text>Halaala</Text>
        <Text>Halaala</Text>
        <Text>Halaala</Text>
        <Text>Halaala</Text>
      </View>
    );
  }
}
export default Place;

const styles = StyleSheet.create({
  
});
