import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from 'react';


import DelayMap from "./DelayMap";

const Stack = createNativeStackNavigator();

// export default function Delays(props) {
export default function Delays() {
    const [delays, setDelays] = useState([]);
    const [stations, setStations] = useState([]);


    return (
        <Stack.Navigator initialRouteName="Karta" screenOptions={{
            headerStyle: {
            backgroundColor: "#f4511e",
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerTitleAlign: 'center'
        }}>
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

    // return (
    //     <DelayMap
    //         stations={stations}
    //         setStations={setStations}
    //         delays={delays}
    //         setDelays={setDelays}
    //     />
    // );
};