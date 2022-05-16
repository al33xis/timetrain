import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FlashMessage from "react-native-flash-message";

import Home from './components/home/Home';
import Delays from './components/delays/Delays';
import Auth from './components/auth/Auth';
import Favourite from './components/favourite/Favourite';

import { Base } from './styles';

import authModel from "./models/auth";

const Tab = createBottomTabNavigator();
const routeIcons = {
  "Hem": "home",
  "Förseningar": "time",
  "Favoriter": "star",
  "Logga in": "lock-closed"
};


export default function App() {
    // const [messages, setMessages] = useState();
    // const [stations, setStations] = useState();
    // const [codes, setCodes] = useState();
    // const [delays, setDelays] = useState();

    // importera färger från en style-fil så att man ändrar på ett ställe!!

    const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);

    useEffect(() => {
        (async () => {
        setIsLoggedIn(await authModel.loggedIn());
        })();
    }, []);

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
                tabBarStyle: {
                    backgroundColor: '#000',
                },
                headerStyle: {
                    backgroundColor: "#f4511e",
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerTitleAlign: 'center'
                })}>
                <Tab.Screen name="Hem">
                    {() => <Home />}
                </Tab.Screen>
                <Tab.Screen name="Förseningar">
                    {() => <Delays />}
                </Tab.Screen>
                {isLoggedIn ? 
                <Tab.Screen name="Favoriter">
                    {() => <Favourite setIsLoggedIn={setIsLoggedIn} />}
                </Tab.Screen> :
                <Tab.Screen name="Logga in">
                    {() => <Auth setIsLoggedIn={setIsLoggedIn} />}
                </Tab.Screen>}
            </Tab.Navigator>
        </NavigationContainer>
      <StatusBar style="auto" />
      <FlashMessage position="top" />
    </SafeAreaView>
  );
}


