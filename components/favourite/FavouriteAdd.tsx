import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Modal, ScrollView } from "react-native";
import auth from "../../models/auth";
import { StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';


import stationModel from "../../models/stations";
import { Base, Form, Typography } from "../../styles";

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
                style={Form.suggestion_container}
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
        <View style={Base.fav_view_add}>
            <Modal
            visible={modalVisible}
            animationType={'slide'}
            transparent={true}
            >
                <View style={Base.centered_modal}>
                    <View style={Base.modal_view}>
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
            <View style={Base.view_top}>
            <Text style={Typography.header_fav_add}>Sök efter en station</Text>
            <TextInput 
                onChangeText={(content: string) => {
                    showStationList(content);
                }}
                placeholder={"ex. Göteborg"}
                style={Typography.text_input}
            />
            <ScrollView>
            {favouriteList}
            </ScrollView>
            </View>
            <View style={Base.view_bottom}>
            <Pressable onPress={() => {
                navigation.navigate("Mina favoriter")
            }}>
                <Ionicons name="arrow-back-circle-outline" color={"#000"} size={80} style={{margin: 20}}/>
            </Pressable>
            </View>
        </View>
    );
};
