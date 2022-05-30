import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from 'react';


import FavouriteView from "./FavouriteView";
import FavouriteAdd from "./FavouriteAdd";

import stationModel from "../../models/stations";

const Stack = createNativeStackNavigator();


export default function Favourite(props) {

    const [favouriteStation, setFavouriteStation] = useState([]);


    useEffect(() => {
        (async () => {
            setFavouriteStation(await stationModel.getFavouriteStation());
        })();
    }, []);


    return (
        <Stack.Navigator initialRouteName="Mina favoriter" screenOptions={{
            headerStyle: {
            backgroundColor: "#f4511e",
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerTitleAlign: 'center'
        }}>
            <Stack.Screen name="Mina favoriter" options={{header: () => null}}>
                {(screenProps) => <FavouriteView
                {...screenProps}
                setIsLoggedIn={props.setIsLoggedIn}
                stations={props.stations}
                setStations={props.setStations}
                delays={props.delays}
                setDelays={props.setDelays}
                favouriteStation={favouriteStation}
                />}
            </Stack.Screen>
            <Stack.Screen name="Lägg till favorit">
                {(screenProps) => <FavouriteAdd
                {...screenProps}
                setIsLoggedIn={props.setIsLoggedIn}
                stations={props.stations}
                setStations={props.setStations}
                delays={props.delays}
                setDelays={props.setDelays}
                favouriteStation={favouriteStation}
                setFavouriteStation={setFavouriteStation}
                />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};