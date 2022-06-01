import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Modal, ScrollView } from "react-native";
import auth from "../../models/auth";
import { StyleSheet } from "react-native";
import { Pressable } from "react-native";

import stationModel from "../../models/stations";
import { Base, Form, Typography } from "../../styles";


const Stack = createNativeStackNavigator();



// alexis@alexis.se
// Alexis1!



export default function FavouriteView({stations, delays, favouriteStation, navigation}) {

    function FavouriteViewFunc() {

        let cur_acr;
        let cur_station;
        let cur_train = [];
        let list_length;


        for (let i = 0; i < favouriteStation.length; i++) {
            
            cur_acr = favouriteStation[i].artefact;

            for (let j = 0; j < stations.length; j++) {
                if (stations[j].LocationSignature === cur_acr) {
                    cur_station = stations[j].AdvertisedLocationName;
                    cur_train.push([<Text key={j} style={Typography.station_header}>{cur_station}</Text>])

                    list_length = cur_train.length;
                }
            }

            for (let k = 0; k < delays.length; k++) {
                if (delays[k].FromLocation !== undefined && delays[k].FromLocation[0].LocationName === cur_acr) {

                    const train = delays[k].AdvertisedTrainIdent;
                    const adv_time = delays[k].AdvertisedTimeAtLocation;
                    const est_time = delays[k].EstimatedTimeAtLocation;

                    const ad_time_split = adv_time.split('T');
                    var ad_time = ad_time_split[1].split('.');
                    ad_time = ad_time[0];
                    
                    const est_time_split = est_time.split('T');
                    var es_time = est_time_split[1].split('.');
                    es_time = es_time[0];

                    cur_train.push([<Text key={k} style={Typography.train_text}>Tåg: {train}</Text>, <Text key={k+100} style={Typography.adv_text}>{ad_time}</Text>, <Text key={k+1000} style={Typography.est_text}>Ny tid: {es_time}</Text>,<Text key={k+10000} style={Typography.space_text}>-</Text>]);
                }
            }

            if (list_length === cur_train.length) {
                cur_train.push([<Text key={i} style={Typography.train_text}>Woho, inga förseningar!</Text>])
            }
        }
        return cur_train;
    }

    return (
        <View style={Base.fav_view}>
            <View style={Base.view_top}>
            <ScrollView>
            <FavouriteViewFunc />
            </ScrollView>
            </View>
            <View style={Base.view_bottom}>
            <Pressable style={Form.button} onPress={() => {
                navigation.navigate('Lägg till favorit');
            }}>
                <Text style={Typography.button_text}>Lägg till favorit</Text>
            </Pressable>
            </View>
        </View>
    );
};
