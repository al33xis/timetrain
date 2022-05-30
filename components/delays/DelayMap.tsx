import { Image, Text, View, ScrollView, Modal, Button } from 'react-native';
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



// Egen position saknas än så länge


export default function DelayMap({stations, setStations, delays, setDelays})
{
    const [currentStation, setCurrentStation] = useState([]);

    const [trainView, setTrainView] = useState(false);

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
                    }
                }
            }
        }
        return delayObject;
    }

    
    
    const delayListObject = createDelayList();
    const delayList = delayListObject.map((station, index) => {
        return <Marker 
        key={index}
        coordinate={{latitude: station.latitude, longitude: station.longitude}}
        title={station.station}
        description={`Förväntade tågförseningar, se nedan för mer information!`}
        pinColor={'red'}
        onPress={() => {
            setTrainView(true);
            setCurrentStation([station.acronym, station.station]);
        }}
        />
    });

    function TrainList() {
        // hämta alla tåg via akronym
        const acr = currentStation[0];
        var allTrains = [];


        for (let i = 0; i < delayListObject.length; i++) {
            if (delayListObject[i].acronym === acr) {
                allTrains.push([delayListObject[i].train, delayListObject[i].estimated]);
            }
        }

        const returnObj = allTrains.map((station, index) => {
            const split_date = station[1].split('T');
            var time = split_date[1].split('.');
            time = time[0];

            return <Text key={index} style={style.train_text}>
                    Tåg {station[0]} - ny avgångstid {time}.
                    </Text>
        })

        return returnObj;
    }
    
    function TrainView() {
        let trainObject;

        if (trainView) {

            trainObject = <View style={style.train_view}>
                            <ScrollView>
                            <Text style={style.train_header}>{currentStation[1]}</Text>
                            <TrainList />
                            <Button
                            title='Stäng'
                            color={"#00A438"}
                            onPress={() => {
                                setTrainView(!trainView);
                            }}
                            />
                            </ScrollView>
                        </View>
        } else {
            // Returnerar en tom view
            trainObject = <View></View>;
            // console.log("ej tryckt på pin");
        }
        return trainObject;
    }
    

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
            <TrainView />
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
    },
    train_view: {
        height: 300,
        backgroundColor: "#F4F4ED",
        margin: 10,
    },
    train_header: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 25,
        marginBottom: 10,
    },
    train_text: {
        textAlign: "center",
        padding: 10,
    },
})
