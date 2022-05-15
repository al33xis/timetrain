import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from 'react';


import DelayMap from "./DelayMap";

const Stack = createNativeStackNavigator();

// export default function Delays(props) {
export default function Delays() {
    const [delays, setDelays] = useState([]);
    const [stations, setStations] = useState([]);


    return (
        <Stack.Navigator initialRouteName="Karta">
            {/* <Stack.Screen name="Karta">
                {(screenProps) => <DelayMap {...screenProps} 
                stations={props.stations}
                setStations={props.setStations}
                delays={props.delays}
                setDelays={props.setDelays}
                />}
            </Stack.Screen> */}
            <Stack.Screen name="Karta">
                {() => <DelayMap 
                stations={stations}
                setStations={setStations}
                delays={delays}
                setDelays={setDelays}
                />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};