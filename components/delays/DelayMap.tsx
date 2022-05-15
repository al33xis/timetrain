import { Image, Text, View, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";

import messageModel from "../../models/messages";
import stationModel from "../../models/stations";
import codeModel from "../../models/codes";
import delayModel from "../../models/delays";

// import { Base, Typography } from "../../styles/index";





export default function DelayMap({messages, setMessages, stations, setStations,
                                codes, setCodes, delays, setDelays})
{

    useEffect(() => {
        (async () => {
            setDelays(await delayModel.getDelays());
        })();
    }, []);

    useEffect(() => {
        (async () => {
            setStations(await stationModel.getStations());
        })();
    }, []);

    function createDelayList() {

        const delayObject = [];

        for (let i = 0; i < delays.length; i++) {
            const tmp_delay = delays[i].FromLocation;

            if (tmp_delay !== undefined) {
                const tmp_location = tmp_delay[0].LocationName;
                const train = delays[i].AdvertisedTrainIdent;
                const estimatedTime = delays[i].EstimatedTimeAtLocation;

                for (let j = 0; j < stations.length; j++) {
                    const tmp_station = stations[j];

                    if (tmp_station.LocationSignature === tmp_location) {
                        const station = tmp_station.AdvertisedLocationName;
                        const station_pin = tmp_station.Geometry.WGS84.split(' ');
                        const long = parseFloat(station_pin[1].replace('(', ''));
                        const lat = parseFloat(station_pin[2].replace(')', ''));

                        delayObject.push({acronym: tmp_location, station: station, 
                        latitude: lat, longitude: long, train: train, estimated: estimatedTime});

                        // om det finns flera förseningar på samma station???
                    }
                }
            }
        }
        return delayObject;
    }

    const delayListObject = createDelayList();
    const delayList = delayListObject.map((station, index) => {
        console.log(station);

        const new_time = new Date(station.estimated);
        let hours = String(new_time.getHours());
        let minutes = String(new_time.getHours());
        let seconds = String(new_time.getSeconds());


        if (parseInt(hours) < 10) {
            hours = `0${hours}`;
        }
        if (parseInt(minutes) < 10) {
            minutes = `0${minutes}`;
        }
        if (parseInt(seconds) < 10) {
            seconds = `0${seconds}`;
        }

        return <Marker 
                key={index}
                coordinate={{latitude: station.latitude, longitude: station.longitude}}
                title={station.station}
                description={`Tåg ${station.train} - ny avgångstid ${hours}:${minutes}:${seconds}`}
        />
    });

    return (
        <View style={style.container_map}>
            <MapView
            key={"test"}
            style={style.map}
            initialRegion={{
                latitude: 62.00,
                longitude: 15.00,
                latitudeDelta: 15.0,
                longitudeDelta: 10.0,
            }}
            >
            {delayList}
            </MapView>
        </View>
  );
}



const style = StyleSheet.create({
    map: {
        flex: 1,
        width: "100%",
    },
    container_map: {
        flex: 1,
        justifyContent: "flex-end",
    }
})
