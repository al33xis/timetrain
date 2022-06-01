
import { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Modal, ScrollView } from "react-native";
import { Pressable } from "react-native";

import { Ionicons } from '@expo/vector-icons';
import { Base, Form, Typography } from "../../styles";

import stationModel from "../../models/stations";


export default function FavouriteDel({stations, setFavouriteStation, favouriteStation, navigation, route}) {

    const [selectedStation, setSelectedStation] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);



    async function deleteStation() {
        await stationModel.deleteFavouriteStation(selectedStation.id);
        setFavouriteStation(await stationModel.getFavouriteStation());
        navigation.navigate("Mina favoriter", {reload: true});
    }

    function ShowFavourites() {
        let cur_acr;
        let cur_id;
        let cur_station;
        let station_list: any = [];

        for (let i = 0; i < favouriteStation.length; i++) {
            cur_acr = favouriteStation[i].artefact;
            cur_id = favouriteStation[i].id;

            for (let j = 0; j < stations.length; j++) {
                if (stations[j].LocationSignature === cur_acr) {
                    cur_station = stations[j].AdvertisedLocationName;

                    station_list.push({station: cur_station, acronym: cur_acr, id: cur_id});

                }
            }
        }
        return station_list;
    }

    const showList = ShowFavourites();
    const favList = showList.map((station, index) => {
        return (
            <Pressable
            key={index}
            onPress={() => {
                setSelectedStation(station);
                setModalVisible(!modalVisible);
            }}
            >
                <Text style={Typography.del_text}>{station.station}</Text>
                <Text style={Typography.space_text_del}>-</Text>

            </Pressable>
        )
    })

    function ModalList() {
        return (<Text>Vill ta bort {selectedStation.station} från dina favoriter?</Text>);
    }

    return (
        <View style={Base.fav_view}>
            <Modal
            visible={modalVisible}
            animationType={'slide'}
            transparent={true}
            >
                <View style={Base.centered_modal}>
                    <View style={Base.modal_view}>
                        <ModalList />

                        <Pressable
                            style={Form.button}
                            onPress={() => {
                                deleteStation()
                                setModalVisible(!modalVisible);

                                // funktion som reloadar favourite
                                // Anropa delete, ID finns med i objektet
                                // Reloada sidan??
                            }}
                        >
                            <Text style={Typography.button_text}>Ja</Text>
                        </Pressable>

                        <Pressable
                            style={Form.button}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={Typography.button_text}>Nej</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <View style={Base.view_top}>
            <Text style={Typography.header_fav_add}>Ta bort en station</Text>
            <ScrollView>
            {favList}
            {/* <ShowFavourites /> */}
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
