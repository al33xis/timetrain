import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FlashMessage from "react-native-flash-message";


import Home from './components/home/Home';
import Delays from './components/delays/Delays';

import { Base } from './styles';

const Tab = createBottomTabNavigator();
const routeIcons = {
  "Hem": "home",
  "Förseningar": "list"
};


export default function App() {
    // const [messages, setMessages] = useState();
    // const [stations, setStations] = useState();
    // const [codes, setCodes] = useState();
    // const [delays, setDelays] = useState();



    return (
    <SafeAreaView style={Base.app_base}>
        <NavigationContainer>
            <Tab.Navigator screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size }) => {
                    let iconName = routeIcons[route.name] || "alert";

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "tomato",
                tabBarInactiveTintColor: "gray",
            })}>
                <Tab.Screen name="Hem">
                    {() => <Home />}
                </Tab.Screen>
                {/* <Tab.Screen name="Förseningar">
                    {() => <Delays 
                    messages={messages}
                    setMessages={setMessages}
                    stations={stations}
                    setStations={setStations}
                    codes={codes}
                    setCodes={setCodes}
                    delays={delays}
                    setDelays={setDelays}
                    />}
                </Tab.Screen> */}
                <Tab.Screen name="Förseningar">
                    {() => <Delays />}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}


