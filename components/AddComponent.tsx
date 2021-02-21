import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, Modal, Alert, TouchableHighlight, TextInput, Button } from 'react-native';

import * as Font from 'expo-font';
import { FontAwesome5, Fontisto } from '@expo/vector-icons';

class Add extends React.Component {
    state = {
        addModalVisible: false,
        name: null,
        placeName: null,
        address: null,
        link: null
    };

    submit = () => {
        if (this.state.address != null && this.state.address != "") {
            fetch('http://wawier.com/explorea/add_place.php?name=' + this.state.name + '&place_name=' + this.state.placeName + '&address=' + this.state.address + '&link=' + this.state.link)
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.id == 1) {
                        this.setState({ addModalVisible: false })
                        Alert.alert("Success", "Thank you 🥰")
                    } else {
                        Alert.alert("Error", "Error, please try again")
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            Alert.alert("Error", "Please fill at least location (address) field to submit");
        }
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.setState({ addModalVisible: true })}><FontAwesome5 name={"plus"} color={"white"} size={20} style={{ marginLeft: 15 }}></FontAwesome5></TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.addModalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                                <FontAwesome5 name={"plus"}></FontAwesome5>&nbsp;Add new place to Exploria
                                </Text>

                            <TextInput maxLength={30} onChangeText={(name) => this.setState({ name })} style={styles.input} placeholder="Your name" placeholderTextColor="grey"></TextInput>
                            <TextInput maxLength={50} onChangeText={(placeName) => this.setState({ placeName })} style={styles.input} placeholder="Name of place" placeholderTextColor="grey"></TextInput>
                            <TextInput maxLength={80} onChangeText={(address) => this.setState({ address })} style={styles.input} placeholder="Place location (address)" placeholderTextColor="grey"></TextInput>
                            <TextInput maxLength={300} onChangeText={(link) => this.setState({ link })} style={styles.input} placeholder="Link to place (URL)" placeholderTextColor="grey"></TextInput>

                            <Text style={{ color: "grey", textAlign: "center", fontSize: 12, width: 220 }}>Please fill information above to help us for better identification of interesting place. If you fill your name we will display it in informations about place. Thank you 😊</Text>

                            <TouchableOpacity style={styles.button} onPress={this.submit}>
                                <Text style={{ color: "white", alignSelf: "center", fontWeight: "bold" }}>
                                    <FontAwesome5 name={"paper-plane"}></FontAwesome5>&nbsp;Send
                                </Text>
                            </TouchableOpacity>


                            <TouchableOpacity style={styles.buttonCancel} onPress={() => {
                                this.setState({ addModalVisible: false })
                            }}>
                                <Text style={{ color: "white", alignSelf: "center", fontWeight: "bold" }}>
                                    <FontAwesome5 name={"times"}></FontAwesome5>&nbsp;Cancel
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}
export default Add;

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
