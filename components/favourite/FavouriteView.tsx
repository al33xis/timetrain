import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Modal, ScrollView } from "react-native";
import auth from "../../models/auth";
import { StyleSheet } from "react-native";
import { Pressable } from "react-native";

import stationModel from "../../models/stations";

const Stack = createNativeStackNavigator();



// Ska jag visa alla Favoritstationer och de som inte har någon försening skrivs ut för? <- smartare//snyggare? "Woho - inga förseningar!"
// Extern funktion som summerar förseningarna per station?
// Funktion som raderar favoriter

// alexis@alexis.se
// Alexis1!



export default function FavouriteView({setIsLoggedIn, stations, delays, favouriteStation, navigation}) {


    async function logOut() {
        auth.logout();
        setIsLoggedIn(false);
    }

    // Skapar en lista som jag sedan gör en map på
    function getFavourite() {
        const favourite_list = [];

        for (let i = 0; i < delays.length; i++) {
            const tmp_delay = delays[i].FromLocation;
            
            
            if (tmp_delay !== undefined) {
                
                const train = delays[i].AdvertisedTrainIdent;
                const estimated_time = delays[i].EstimatedTimeAtLocation;
                const from_location = delays[i].FromLocation[0].LocationName;

                for (let j = 0; j < favouriteStation.length; j++) {
                    
                    const tmp_fav = favouriteStation[j].artefact;

                    if (tmp_fav === from_location) {

                        favourite_list.push({acronym: tmp_fav, train: train, estimated: estimated_time})
                    }
                }
            }
        }

        return favourite_list;
    }

    function FavouriteViewFunc() {
        var all_trains = [];

        for (let i = 0; i < favouriteStation.length; i++) {
            // console.log(favouriteStation[i].artefact);
            const current_station = favouriteStation[i].artefact;

            for (let j = 0; j < delays.length; j++) {
                if (delays[j].FromLocation !== undefined && delays[j].FromLocation[0].LocationName === current_station) {

                    const train = delays[j].AdvertisedTrainIdent;
                    const advertised_time = delays[j].AdvertisedTimeAtLocation;
                    const estimated_time = delays[j].EstimatedTimeAtLocation;

                    all_trains.push([current_station, train, advertised_time, estimated_time]);
                }
            }
            // lägg nedan kod här??? så returnerar den mellan varje stationsbyte??
        }

        var station_name: any;

        const returnObj = all_trains.map((station, index) => {
            const ad_time_split = station[2].split('T');
            var ad_time = ad_time_split[1].split('.');
            ad_time = ad_time[0];
            
            const est_time_split = station[3].split('T');
            var est_time = est_time_split[1].split('.');
            est_time = est_time[0];

            const cur_station = station[0];
            const cur_train = station[1];

            for (let i = 0; i < stations.length; i++) {
                if (stations[i].LocationSignature === cur_station) {
                    station_name = stations[i].AdvertisedLocationName;
                }
            }

            return <View key={index}>
            <Text>{station_name}</Text>
            <Text>{cur_train}</Text>
            <Text>{ad_time}</Text>
            <Text>{est_time}</Text>
            </View>
        })

        return returnObj;

            

        // kör en map på listan och skriv ut resultatet
    }


    // async function deleteFavourite() {
    //     await stationModel.deleteFavouriteStation();
    // }


    return (
        <View>
            <Text>Favoriter:</Text>
            <ScrollView style={{height: 200}}>
            <FavouriteViewFunc />
            </ScrollView>
            <View style={{margin: 20}}>
            <Button 
            title="Logga ut"
            onPress={async () => {
                await logOut();
            }}
            />
            </View>
            <View style={{margin: 20}}>
            <Button 
            title="Lägg till favorit"
            onPress={async () => {
                // await logOut();
                // Navigera till nästa vy
                navigation.navigate('Lägg till favorit');
            }}
            />
            </View>
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