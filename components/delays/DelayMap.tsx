import { Text, View, ScrollView, Pressable} from 'react-native';
import { useState, useEffect, useRef } from 'react';

import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";

import stationModel from "../../models/stations";
import delayModel from "../../models/delays";

import { Base, Typography, Form } from "../../styles";



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

            return <Text key={index} style={Typography.train_text}>
                    Tåg {station[0]} - ny avgångstid {time}.
                    </Text>
        })

        return returnObj;
    }
    
    function TrainView() {
        let trainObject;

        if (trainView) {

            trainObject = <View style={Base.train_view}>
                            <ScrollView>
                            <Text style={Typography.train_header}>{currentStation[1]}</Text>
                            <TrainList />
                            <Pressable style={Form.button} 
                            onPress={() => {
                                setTrainView(!trainView);
                            }}>
                                <Text style={Typography.button_text}>Stäng</Text>
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
            const marker = locationMarker.props.coordinate;
            const region = {latitude: marker.latitude, longitude: marker.longitude, latitudeDelta: 1.00, longitudeDelta: 1.00};
            mapRef.current.animateToRegion(region, 3 * 1000);
        }
    }
    

    return (
        <View style={Base.container_map}>
            <MapView
            key={markers.length}
            ref={mapRef}
            style={Base.map}
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
