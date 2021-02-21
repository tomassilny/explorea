import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, Modal, Alert, TouchableHighlight, TextInput, Button, SafeAreaView, FlatList } from 'react-native';

import * as Font from 'expo-font';
import { FontAwesome5, Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

class MyPlaces extends React.Component {
    state = {
        myPlacesModalVisible: false,
        myPlaces: []
    };

    componentDidMount() {
        this.readPlaces();
    }

    async readPlaces() {
        try {
            const value = await AsyncStorage.getItem('@places_string')
            // Get from db
            fetch('http://wawier.com/explorea/placeinfo.php?string=' + value)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({ myPlaces: responseJson });
                })

                .catch((error) => {
                    console.error(error);
                });
        } catch (e) {
            Alert.alert("Error", "Error while reading place. Please try it again or contact administrator");
        }
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.setState({ myPlacesModalVisible: true })}><FontAwesome5 name={"check"} color={"white"} size={20} style={{ marginRight: 15 }}></FontAwesome5></TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.myPlacesModalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                                <FontAwesome5 name={"check"}></FontAwesome5>&nbsp;My visited places
                                </Text>

                            {(this.state.myPlaces != null || this.state.myPlaces.length > 1) ?
                                <View style={{ maxHeight: 300 }}>

                                    <SafeAreaView>
                                        <FlatList
                                            data={this.state.myPlaces}
                                            keyExtractor={(item, index) => {
                                                return item.id;
                                            }}
                                            renderItem={({ item }) =>
                                            <View>
                                                <View style={{ padding: 8, flexDirection: "row" }}>
                                                    {item.kinds.includes("religion") &&
                                                        <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#795548", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                                                            <FontAwesome5 name={"cross"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                                                        </View>
                                                    }

                                                    {item.kinds.includes("castle") &&
                                                        <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#FFD600", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                                                            <FontAwesome5 name={"chess-rook"} color={"black"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                                                        </View>
                                                    }

                                                    {item.kinds.includes("natural") &&
                                                        <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#388E3C", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                                                            <FontAwesome5 name={"tree"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                                                        </View>
                                                    }

                                                    {item.kinds.includes("historic") &&
                                                        <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#E65100", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                                                            <FontAwesome5 name={"monument"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                                                        </View>
                                                    }

                                                    {item.kinds.includes("cultural") &&
                                                        <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#4527A0", borderRadius: 25 /2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                                                            <FontAwesome5 name={"theater-masks"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                                                        </View>
                                                    }

                                                    {(item.kinds.includes("tower") || item.kinds.includes("skyscraper")) &&
                                                        <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#212126", borderRadius:  25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                                                            <FontAwesome5 name={"city"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                                                        </View>
                                                    }

                                                    {item.kinds.includes("other") &&
                                                        <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#00C853", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                                                            <FontAwesome5 name={"map-marker"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                                                        </View>
                                                    }

                                                    {item.kinds.includes("industrial") &&
                                                        <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "black", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                                                            <FontAwesome5 name={"industry"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                                                        </View>
                                                    }

                                                    {item.kinds.includes("bridge") &&
                                                        <View style={{ alignItems: "center", alignContent: "center", backgroundColor: "#1E88E5", borderRadius: 25 / 2, borderWidth: 2, borderColor: "white", width: 25, height: 25, elevation: 5 }}>
                                                            <FontAwesome5 name={"road"} color={"white"} size={13} style={{ marginTop: 4 }}></FontAwesome5>
                                                        </View>
                                                    }
                                                    <Text style={{ marginLeft: 10, marginTop: 4 }}>{item.name}</Text>
                                                    </View>

                                                    <View style={{ height: 1, backgroundColor: "#f1f1f1", width: "100%" }}></View>
                                                </View>
                                            }
                                        />
                                        <View style={{ alignItems: "center" }}>
                                        <TouchableOpacity style={styles.buttonCancel} onPress={() => {
                                        this.setState({ myPlacesModalVisible: false })
                                    }}>
                                        <Text style={{ color: "white", alignSelf: "center", fontWeight: "bold" }}>
                                            <FontAwesome5 name={"times"}></FontAwesome5>&nbsp;Cancel
                                </Text>
                                    </TouchableOpacity>
                                    </View>
                                    </SafeAreaView>
                                    
                                </View>
                                :
                                <View>
                                    <Text>No visited places 😪</Text>
                                </View>

                            }


                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}
export default MyPlaces;

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
        width: 220,
        padding: 10,
        borderRadius: 10,
        elevation: 5,
        backgroundColor: "#15d376",
        color: "#fff"
    },
    buttonCancel: {
        marginTop: 10,
        width: 220,
        padding: 10,
        borderRadius: 10,
        elevation: 5,
        backgroundColor: "#F44336",
        color: "#fff"
    },
    input: {
        width: 220, backgroundColor: "#F8F8F8", padding: 10, color: "#000",
        borderWidth: 1, borderColor: "#F0F0F0",
        borderRadius: 10, elevation: 5,
        marginBottom: 10
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 25,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
});
