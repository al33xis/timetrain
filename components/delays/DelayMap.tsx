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





export default function DelayMap({messages, setMessages, stations, setStations,
                                codes, setCodes, delays, setDelays})
{
    const [modalVisible, setModalVisible] = useState(false);
    const [currentStation, setCurrentStation] = useState([]);

    const [testView, setTestView] = useState(false);

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
        // description={`Tåg ${station.train} - ny avgångstid ${hours}:${minutes}:${seconds}`}
        description={`Förväntade tågförseningar, klicka här för mer information!`}
        onPress={() => {
            setTestView(true);
            setCurrentStation([station.acronym, station.station]);
        }}
        // onCalloutPress={() => {
        //     setModalVisible(!modalVisible);
        //     setCurrentStation([station.acronym, station.station]);
        // }}
        />
    });

    function ModalList() {
        // hämta alla tåg via akronym
        const acr = currentStation[0];
        var allTrains = [];


        for (let i = 0; i < delayListObject.length; i++) {
            // console.log(delayListObject[i]);
            if (delayListObject[i].acronym === acr) {
                // console.log(delayListObject[i]);
                allTrains.push([delayListObject[i].train, delayListObject[i].estimated]);
            }
        }

        // console.log(allTrains);

        const returnObj = allTrains.map((station, index) => {
            // Behöver splita tiden för verkar inte fungera att parsa och konvertera till nytt datum
            const split_date = station[1].split('T');
            // console.log(split_date);
            var time = split_date[1].split('.');
            time = time[0];
            // console.log(time);

            return <Text key={index}>
                    Tåg {station[0]} - ny avgångstid {time}.
                    </Text>
        })

        return returnObj;
    }
    
    function TrainView() {
        let trainObject;

        if (testView) {

            trainObject = <View style={{height: 200}}>
                            <Text>Aktiv</Text>
                            <Text>{currentStation[0]}</Text>
                            {/* lägg in en komponent här?? så som returnObj */}
                            <Button
                            title='Tryck'
                            onPress={() => {
                                setTestView(!testView);
                            }}
                            />
                        </View>
            console.log("tryckte på pin");
        } else {
            // Returnerar en tom view
            trainObject = <View></View>;
            // console.log("ej tryckt på pin");
        }
        return trainObject;
    }
    
    return (
        <View style={style.container_map}>
            <Modal
            visible={modalVisible}
            animationType={'slide'}
            transparent={true}
            >
                <View style={style.centeredView}>
                    <View style={style.modalView}>
                        {/* en komponent som visar alla tider */}
                            {/* Fixa så att rutan bara blir så stor som den behöver vara */}
                        <ModalList />
                        <Button 
                            title='Stäng fönster'
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        />
                    </View>
                </View>
            </Modal>
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
