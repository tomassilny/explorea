import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, Modal, Alert, TouchableHighlight, TextInput, Button } from 'react-native';

import * as Font from 'expo-font';
import { FontAwesome5, Fontisto } from '@expo/vector-icons';

class Search extends React.Component {
    state = {
        searchModalVisible: false
    };

    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.setState({ searchModalVisible: true })}><FontAwesome5 name={"search"} color={"white"} size={20} style={{ marginRight: 20 }}></FontAwesome5></TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.searchModalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                                <FontAwesome5 name={"search"}></FontAwesome5>&nbsp;Search for city
                                </Text>

                            <Text>Ahoj</Text>

                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}
export default Search;

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
