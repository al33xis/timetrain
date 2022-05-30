import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Modal, ScrollView } from "react-native";
import auth from "../../models/auth";
import { StyleSheet } from "react-native";
import { Pressable } from "react-native";

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
        <View>
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
            <Text>Sök efter en station</Text>
            <TextInput 
                onChangeText={(content: string) => {
                    showStationList(content);
                }}
                placeholder={"Test"}
            />
            {favouriteList}
        </View>
    );
};


const style = StyleSheet.create({
    suggestionContainer: {
        borderWidth: 3,
        width: 200,
        margin: 10
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
})