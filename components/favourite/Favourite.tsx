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
// Ladda om favorit-listan när man lägger till en ny favorit

// alexis@alexis.se
// Alexis1!



export default function Favourite({setIsLoggedIn, stations, delays}) {

    const [searchedStation, setSearchedStation] = useState([]);
    const [selectedStation, setSelectedStation] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [favouriteStation, setFavouriteStation] = useState([]);

    useEffect(() => {
        (async () => {
            setFavouriteStation(await stationModel.getFavouriteStation());
        })();
    }, []);

    async function logOut() {
        auth.logout();
        setIsLoggedIn(false);
    }

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

    function ModalList() {
        const station = selectedStation.station;

        return (<Text>Vill du markera {station} som en favorit?</Text>);
    }

    // Gör en post request och adderar favorit till användaren -> skicka endast med akronym och bygg sedan favoritlistan via allStation
    // Ingen funktion som verifierar om man inte redan har valt en station som favorit
    async function addStation() {
        await stationModel.addFavouriteStation(selectedStation.acronym);
        // const sel_acronym = selectedStation.acronym;
        // for (let i = 0; i < stations.length; i ++) {
        //     if (stations[i].LocationSignature === sel_acronym) {
        //         await stationModel.addFavouriteStation(selectedStation.acronym);
        //         return;
        //     }
        // }
    }










    // Skapar en lista som jag sedan gör en map på
    function getFavourite() {
        const favouriteObject = [];

        for (let i = 0; i < delays.length; i++) {
            const tmp_delay = delays[i].FromLocation;
            
            
            if (tmp_delay !== undefined) {
                
                const train = delays[i].AdvertisedTrainIdent;
                const estimated_time = delays[i].EstimatedTimeAtLocation;
                const from_location = delays[i].FromLocation[0].LocationName;

                for (let j = 0; j < favouriteStation.length; j++) {
                    
                    const tmp_fav = favouriteStation[j].artefact;

                    if (tmp_fav === from_location) {

                        favouriteObject.push({acronym: tmp_fav, train: train, estimated: estimated_time})
                    }
                }
            }
        }

        return favouriteObject;
    }

    const favouriteViewObject = getFavourite();
    const favouriteView = favouriteViewObject.map((station, index) => {
        console.log(station);
        const split_time = station.estimated.split('T');
        var time = split_time[1].split('.');
        time = time[0];

        const acronym = station.acronym;
        const train = station.train;
        var station_name;

        for (let i = 0; i < stations.length; i++) {
            if (stations[i].LocationSignature === acronym) {
                station_name = stations[i].AdvertisedLocationName;
            }
        }

        return <Text key={index}>{station_name}</Text>
    })

    









    // async function deleteFavourite() {
    //     await stationModel.deleteFavouriteStation();
    // }

    // deleteFavourite();

    // Ritar ut listan
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
            <Text>Favoriter:</Text>
            <ScrollView style={{height: 200}}>
            {favouriteView}
            </ScrollView>
            <Text>Sök efter en station</Text>
            <TextInput 
                onChangeText={(content: string) => {
                    showStationList(content);
                }}
                placeholder={"Test"}
            />
            {favouriteList}
            <Button 
            title="Logga ut"
            onPress={async () => {
                await logOut();
            }}
            
            />
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