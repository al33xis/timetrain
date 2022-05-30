import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';


import DelayMap from "./DelayMap";

const Stack = createNativeStackNavigator();

export default function Delays(props) {

    return (
        <Stack.Navigator initialRouteName="Karta" screenOptions={{
            headerStyle: {
            backgroundColor: "#f4511e",
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        headerShown: false,
        }}>
            <Stack.Screen name="Karta">
                {(screenProps) => <DelayMap 
                {...screenProps}
                stations={props.stations}
                setStations={props.setStations}
                delays={props.delays}
                setDelays={props.setDelays}
                />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};