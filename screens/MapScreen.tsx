import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Alert, Platform, Linking, TouchableHighlight } from 'react-native';

import MapView, { MAP_TYPES } from "react-native-maps";
import { Marker } from 'react-native-maps';
import * as Permission from 'expo-permissions'
import * as Location from "expo-location";
import { FontAwesome5 } from '@expo/vector-icons';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-community/async-storage';

class Map extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    region: {
      latitude: 38.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    mapType: MAP_TYPES.HYBRID,
    fontLoaded: false,
    places: [],
    selectedPlace: null,
    isSelectedPlace: false,
    markerIndex: -1,
    savedPlaces: "",
    savedPlacesArray: []
  };

  async componentDidMount() {
    this.readPlaces();

    await Font.loadAsync({
      'Gilroy': require('../assets/fonts/Gilroy.ttf'),
    });
    this.setState({ fontLoaded: true });


    let { status } = await Permission.askAsync(Permission.LOCATION);
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const Region = Object.assign({}, this.state.region, { latitude: location.coords.latitude, longitude: location.coords.longitude });
      this.setState({
        region: Region
      });
      this.getPlaces();
    } catch (error) {
      console.log(error);
    }
  }

  goToMyLocation = async () => {
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const Region = Object.assign({}, this.state.region, { latitude: location.coords.latitude, longitude: location.coords.longitude });

    this.setState({
      region: Region
    });
  }

  changeMapStyle = () => {
    if (this.state.mapType == MAP_TYPES.STANDARD) {
      this.setState({ mapType: MAP_TYPES.HYBRID });
    } else {
      this.setState({ mapType: MAP_TYPES.STANDARD });
    }
  }

  getPlaces() {
    fetch('http://wawier.com/explorea/get.php?lat=' + this.state.region.latitude + '&lon=' + this.state.region.longitude + '&radius=0.3')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ places: responseJson });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  onRegionChange = (region: any) => {
    this.getPlaces();
    this.setState({ region: region })
  }

  selectPlace = (place: any, index: any) => {
    this.setState({ isSelectedPlace: true, selectedPlace: place, markerIndex: index });
  }

  openPlace = (place) => {
    this.props.handleClick(place);
  }

  openMap(place: any) {
    if (Platform.OS == "ios") {
      Linking.openURL('http://maps.apple.com/maps?daddr=' + place.latitude + "," + place.longtitude);
    } else {
      Linking.openURL('http://maps.google.com/maps?daddr=' + place.latitude + "," + place.longtitude);
    }
  }

  openWeb(place: any) {
    Linking.openURL('http://google.com/search?q=' + place.name);
  }

  savePlace = async (place: any) => {
    try {
      // firslty check if is already selected
      if (this.state.savedPlacesArray.includes(place.id)) {
        var index = this.state.savedPlacesArray.indexOf(place.id);
        this.setState({ savedPlacesArray: this.state.savedPlacesArray.filter(x => x != place.id) }, async () => {
          // Convert saved places array to string
          let value = this.state.savedPlacesArray.toString();
          await AsyncStorage.setItem('@places_string', value)
          this.readPlaces();
        });
      } else {
        let value = this.state.savedPlaces + ',' + place.id;
        await AsyncStorage.setItem('@places_string', value)
        this.readPlaces();
      }
    } catch (e) {
      Alert.alert("Error", "Error while saving place. Please try it again or contact administrator");
    }
  }

  async readPlaces() {
    try {
      const value = await AsyncStorage.getItem('@places_string')
      this.setState({ savedPlaces: value });
      // Set to array
      let array = this.state.savedPlaces.split(',');
      this.setState({ savedPlacesArray: array });
      console.log(this.state.savedPlaces);
    } catch (e) {
      Alert.alert("Error", "Error while reading place. Please try it again or contact administrator");
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <MapView
          style={{ flex: 1 }}
          onRegionChangeComplete={this.onRegionChange}
          showsUserLocation={true}
          mapType={this.state.mapType}
          region={this.state.region}
        >

          {this.state.places.map((place, index) => (
            <TouchableOpacity>
              <Marker
                tracksViewChanges={false}
                key={place.id}
                onPress={() => this.selectPlace(place, index)}
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longtitude,
                }}
              >

                {this.state.savedPlacesArray.includes(place.id) ?
                  <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#15d376", borderRadius: (this.state.markerIndex != index) ? 25 / 2 : 5, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                    <FontAwesome5 name={"check"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                  </View>
                  :
                  <View>
                    {place.kinds.includes("religion") &&
                      <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#795548", borderRadius: (this.state.markerIndex != index) ? 25 / 2 : 5, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                        <FontAwesome5 name={"cross"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                      </View>
                    }

                    {place.kinds.includes("castle") &&
                      <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#FFD600", borderRadius: (this.state.markerIndex != index) ? 25 / 2 : 5, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                        <FontAwesome5 name={"chess-rook"} color={"black"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                      </View>
                    }

                    {place.kinds.includes("natural") &&
                      <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#388E3C", borderRadius: (this.state.markerIndex != index) ? 25 / 2 : 5, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                        <FontAwesome5 name={"tree"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                      </View>
                    }

                    {place.kinds.includes("historic") &&
                      <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#E65100", borderRadius: (this.state.markerIndex != index) ? 25 / 2 : 5, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                        <FontAwesome5 name={"monument"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                      </View>
                    }

                    {place.kinds.includes("cultural") &&
                      <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#4527A0", borderRadius: (this.state.markerIndex != index) ? 25 / 2 : 5, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                        <FontAwesome5 name={"theater-masks"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                      </View>
                    }

                    {(place.kinds.includes("tower") || place.kinds.includes("skyscraper")) &&
                      <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#212126", borderRadius: (this.state.markerIndex != index) ? 25 / 2 : 5, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                        <FontAwesome5 name={"city"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                      </View>
                    }

                    {place.kinds.includes("other") &&
                      <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#00C853", borderRadius: (this.state.markerIndex != index) ? 25 / 2 : 5, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                        <FontAwesome5 name={"map-marker"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                      </View>
                    }

                    {place.kinds.includes("industrial") &&
                      <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "black", borderRadius: (this.state.markerIndex != index) ? 25 / 2 : 5, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                        <FontAwesome5 name={"industry"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                      </View>
                    }

                    {place.kinds.includes("bridge") &&
                      <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#1E88E5", borderRadius: (this.state.markerIndex != index) ? 25 / 2 : 5, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                        <FontAwesome5 name={"road"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                      </View>
                    }
                  </View>
                }
              </Marker>
            </TouchableOpacity>

          ))}
        </MapView>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={this.goToMyLocation}>
            <FontAwesome5 name="location-arrow" size={20} color="#15d376" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.changeMapStyle}>
            <FontAwesome5 name="map" size={20} color="#15d376" />
          </TouchableOpacity>
        </View>

        {this.state.isSelectedPlace &&
          <View style={styles.bottomBlock}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "90%" }}>
              {this.state.selectedPlace.kinds.includes("religion") &&
                <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#795548", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                  <FontAwesome5 name={"cross"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                </View>
              }

              {this.state.selectedPlace.kinds.includes("castle") &&
                <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#FFD600", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                  <FontAwesome5 name={"chess-rook"} color={"black"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                </View>
              }

              {this.state.selectedPlace.kinds.includes("natural") &&
                <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#388E3C", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                  <FontAwesome5 name={"tree"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                </View>
              }

              {this.state.selectedPlace.kinds.includes("historic") &&
                <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#E65100", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                  <FontAwesome5 name={"monument"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                </View>
              }

              {this.state.selectedPlace.kinds.includes("cultural") &&
                <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#4527A0", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                  <FontAwesome5 name={"theater-masks"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                </View>
              }

              {(this.state.selectedPlace.kinds.includes("tower") || this.state.selectedPlace.kinds.includes("skyscraper")) &&
                <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#212126", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                  <FontAwesome5 name={"city"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                </View>
              }

              {this.state.selectedPlace.kinds.includes("other") &&
                <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#00C853", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                  <FontAwesome5 name={"map-marker"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                </View>
              }

              {this.state.selectedPlace.kinds.includes("industrial") &&
                <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "black", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                  <FontAwesome5 name={"industry"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                </View>
              }

              {this.state.selectedPlace.kinds.includes("bridge") &&
                <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#1E88E5", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                  <FontAwesome5 name={"road"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                </View>
              }
              <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5, marginLeft: 5, marginTop: 4 }}>{this.state.selectedPlace.name}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 0.5, alignSelf: "flex-start" }}>
                <Text style={{ color: "grey", marginTop: 5 }}>Lat: {this.state.selectedPlace.latitude}</Text>
                <Text style={{ color: "grey" }}>Lon: {this.state.selectedPlace.longtitude}</Text>
              </View>
              <View style={{ flex: 0.5, alignSelf: "flex-end", flexDirection: "row", justifyContent: "flex-end" }}>
                <TouchableOpacity onPress={() => this.savePlace(this.state.selectedPlace)} style={{ marginRight: 5, backgroundColor: (this.state.savedPlacesArray.includes(this.state.selectedPlace.id)) ? "#15d376" : "grey", borderRadius: 15, padding: 10 }}>
                  <FontAwesome5 name={"check"} color={"white"} size={25}></FontAwesome5>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openWeb(this.state.selectedPlace)} style={{ marginRight: 5, backgroundColor: "#15d376", borderRadius: 15, padding: 10 }}>
                  <FontAwesome5 name={"google"} color={"white"} size={25}></FontAwesome5>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openMap(this.state.selectedPlace)} style={{ backgroundColor: "#15d376", borderRadius: 15, padding: 10 }}>
                  <FontAwesome5 name={"map-marked-alt"} color={"white"} size={25}></FontAwesome5>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }

      </View>
    );
  }
}
export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomBlock: {
    paddingTop: 10,
    paddingLeft: 15, paddingRight: 15,
    paddingBottom: 10,
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: "90%",
    height: 120,
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 5
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttons: {
    position: "absolute",
    marginTop: 20,
    left: 10,
  },
  button: {
    padding: 8,
    borderColor: "#15d376",
    borderWidth: 2,
    elevation: 3,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: "white"
  }
});
