import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { View, Text, Button, TextInput } from "react-native";
import auth from "../../models/auth";

import stationModel from "../../models/stations";

const Stack = createNativeStackNavigator();



// En lista av stationer som man kan välja? Cumbersome, kan man kanske börja skriva först och få förslag?
// Kunna välja direkt från kartan??

// alexis@alexis.se
// Alexis1!


export default function Favourite({setIsLoggedIn}) {

    const [allStations, setAllStations] = useState([]);
    const [searchedStation, setSearchedStation] = useState([]);

    useEffect(() => {
        (async () => {
            setAllStations(await stationModel.getStations());
        })();
    }, []);

    async function logOut() {
        auth.logout();
        setIsLoggedIn(false);
    }


    function showStationList(content: string) {
        var searchList: any = [];

        if (content === "") {
            setSearchedStation([]);
            return;
        }

        for (let i = 0; i < allStations.length; i++) {
            const tmp_station = allStations[i].AdvertisedLocationName;

            if (tmp_station.startsWith(content)) {
                searchList.push({station: tmp_station})
            }
        }

        setSearchedStation(searchList);
    }

    const favouriteList = searchedStation.map((station, index) => {

        // lägg in en begränsning på 10 resultat??
        return <Text key={index}>{station.station}</Text>
    })

    return (
        <View>

            <Text>Test</Text>
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

