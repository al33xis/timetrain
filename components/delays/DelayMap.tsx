import { Image, Text, View, ScrollView, Modal, Button , Pressable} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';

import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";

import messageModel from "../../models/messages";
import stationModel from "../../models/stations";
import codeModel from "../../models/codes";
import delayModel from "../../models/delays";

// import { Base, Typography } from "../../styles/index";



export default function DelayMap({stations, setStations, delays, setDelays})
{
    const [currentStation, setCurrentStation] = useState([]);
    const [trainView, setTrainView] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [locationMarker, setLocationMarker] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const mapRef = useRef<MapView>(null);



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





    useEffect(() => {
        (async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                setErrorMessage("Permission denied.");
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocationMarker(<Marker
                coordinate={{
                    latitude: currentLocation.coords.latitude, 
                    longitude: currentLocation.coords.longitude
                }}
                title="Din plats"
                pinColor="green"
                identifier={"me"}
                />)
            setMarkers("Location loaded");
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
                            <Pressable style={style.button} 
                            onPress={() => {
                                setTrainView(!trainView);
                            }}>
                                <Text style={style.button_text}>Stäng</Text>
                            </Pressable>
                            </ScrollView>
                        </View>
        } else {
            trainObject = <View></View>;
        }
        return trainObject;
    }

    function fitToMarker() {
        if (mapRef.current && locationMarker) {
            console.log(locationMarker.props.coordinate.latitude);
            console.log(locationMarker.props.coordinate.longitude);
            const marker = locationMarker.props.coordinate;
            const region = {latitude: marker.latitude, longitude: marker.longitude, latitudeDelta: 1.00, longitudeDelta: 1.00};
            mapRef.current.animateToRegion(region, 3 * 1000);
        }
    }
    

    return (
        <View style={style.container_map}>
            <MapView
            key={markers.length}
            ref={mapRef}
            style={style.map}
            initialRegion={{
                latitude: 62.00,
                longitude: 15.00,
                latitudeDelta: 15.0,
                longitudeDelta: 10.0,
            }}
            onMapReady={fitToMarker}
            onMapLoaded={fitToMarker}
            >
            {delayList}
            {locationMarker}
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
    button: {
        backgroundColor: "#00A438",
        marginTop: 20,
        padding: 10,
        width: 300,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignSelf: 'center'
    },
    button_text: {
        textAlign: "center",
        fontSize: 20,
        color: "#FFF"
    }
})
