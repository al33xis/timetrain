import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Modal, ScrollView } from "react-native";
import auth from "../../models/auth";
import { StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';


import stationModel from "../../models/stations";

const Stack = createNativeStackNavigator();



// En vy som visar nuvarande favoriter och en knapp att radera dessa -> under sökfunktionen
// Funktion som raderar favoriter

// alexis@alexis.se
// Alexis1!



export default function FavouriteAdd({stations, delays, favouriteStation, setFavouriteStation, navigation}) {

    const [searchedStation, setSearchedStation] = useState([]);
    const [selectedStation, setSelectedStation] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);


    // Funktion som skapar listan i en state
    function showStationList(content: string) {
        var searchList: any = [];

        if (content === "") {
            setSearchedStation([]);
            return;
        }

        for (let i = 0; i < stations.length; i++) {
            const tmp_station = stations[i].AdvertisedLocationName;
            const tmp_acronym = stations[i].LocationSignature;

            if (tmp_station.startsWith(content)) {
                searchList.push({station: tmp_station, acronym: tmp_acronym});
            }
        }

        setSearchedStation(searchList);
    }

    // Popup som verifierar att man vill lägga till sagda station i Bland favoriter
    function ModalList() {
        const station = selectedStation.station;

        return (<Text>Vill du markera {station} som en favorit?</Text>);
    }

    // Adderar en station till favoriter
    async function addStation() {
        await stationModel.addFavouriteStation(selectedStation.acronym);
        setFavouriteStation(await stationModel.getFavouriteStation());
    }


    // Ritar ut söklistan
    const favouriteList = searchedStation.map((station, index) => {
        return (<Pressable 
                style={style.suggestionContainer}
                key={index}
                onPress={() => {
                    setSelectedStation(station);
                    setModalVisible(!modalVisible);
                }}
                >
            <Text>{station.station}</Text>
            </Pressable>)
    })

    return (
        <View style={style.view}>
            <Modal
            visible={modalVisible}
            animationType={'slide'}
            transparent={true}
            >
                <View style={style.centeredView}>
                    <View style={style.modalView}>
                        <ModalList />
                        <Button 
                            title='Ja'
                            onPress={() => {
                                addStation();
                                setModalVisible(!modalVisible);
                                // navigera tillbaka till favoritview
                            }}
                        />
                        <Button 
                            title='Nej'
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        />
                    </View>
                </View>
            </Modal>
            <View style={style.view_top}>
            <Text style={style.header}>Sök efter en station</Text>
            <TextInput 
                onChangeText={(content: string) => {
                    showStationList(content);
                }}
                placeholder={"ex. Göteborg"}
                style={style.text_input}
            />
            <ScrollView>
            {favouriteList}
            </ScrollView>
            </View>
            <View style={style.view_bottom}>
            <Pressable onPress={() => {
                navigation.navigate("Mina favoriter")
            }}>
                <Ionicons name="arrow-back-circle-outline" color={"#000"} size={80} style={{margin: 20}}/>
            </Pressable>
            </View>
        </View>
    );
};


const style = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
    },
    suggestionContainer: {
        borderWidth: 1,
        borderColor: "#00A438",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        width: 200,
        margin: 10,
        padding: 10,
        textAlign: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    header: {
        fontSize: 28,
        textAlign: 'center',
        margin: 20,
    },
    text_input: {
        fontSize: 26,
        textAlign: 'center'
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
        shadowRadius: 4,
        elevation: 5
      },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
    view_top: {
        flex: 3,
        alignSelf: 'stretch',
        textAlign: 'center',
    },
    view_bottom: {
        flex: 1,
        justifyContent: 'space-around',
    },
})