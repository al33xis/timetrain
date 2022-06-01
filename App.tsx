import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FlashMessage from "react-native-flash-message";
import { Pressable } from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";

import Home from './components/home/Home';
import Delays from './components/delays/Delays';
import Auth from './components/auth/Auth';
import Favourite from './components/favourite/Favourite';

import { Base } from './styles';

import authModel from "./models/auth";
import delayModel from "./models/delays";
import stationModel from "./models/stations";

const Tab = createBottomTabNavigator();
const routeIcons = {
  "Hem": "home",
  "Förseningar": "time",
  "Favoriter": "star",
  "Mina sidor": "lock-closed"
};


export default function App() {
    const [stations, setStations] = useState();
    const [delays, setDelays] = useState();
    const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);


    async function reloadDelays() {
        setDelays(await delayModel.getDelays());
    }

    async function logOut() {
        authModel.logout();
        setIsLoggedIn(false);
    }

    useEffect(() => {
        (async () => {
        setIsLoggedIn(await authModel.loggedIn());
        })();
    }, []);

    useEffect(() => {
        reloadDelays();
    }, []);

    useEffect(() => {
        (async () => {
            setStations(await stationModel.getStations());
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
                tabBarActiveTintColor: "#00A438",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: {
                    backgroundColor: '#FFF',
                },
                headerStyle: {
                    backgroundColor: "#F4F4ED",
                    height: 80,
                },
                headerTintColor: '#000',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerTitleAlign: 'center',
                })}>
                <Tab.Screen name="Hem">
                    {() => <Home />}
                </Tab.Screen>
                <Tab.Screen name="Förseningar" 
                options={{headerRight: () => (
                    <Pressable 
                    onPress={() => {
                        reloadDelays();
                        showMessage({
                            message: "Kartan har uppdaterats",
                            type: "success",
                            floating: true
                        })
                    }}>
                    <Ionicons name="refresh" color={"#000"} size={30} style={{marginRight: 20}}/>
                    </Pressable>
                )}}>
                    {() => <Delays stations={stations} setStations={setStations} delays={delays} setDelays={setDelays}/>}
                </Tab.Screen>
                {isLoggedIn ? 
                <Tab.Screen name="Favoriter" options={{headerRight: () => (
                    <Pressable 
                    onPress={() => {
                        logOut();
                    }}>
                    <Ionicons name="log-out-outline" color={"#000"} size={30} style={{marginRight: 20}}/>
                    </Pressable>
                )}}>
                    {() => <Favourite setIsLoggedIn={setIsLoggedIn} stations={stations} delays={delays}/>}
                </Tab.Screen> :
                <Tab.Screen name="Mina sidor">
                    {() => <Auth setIsLoggedIn={setIsLoggedIn} />}
                </Tab.Screen>}
            </Tab.Navigator>
        </NavigationContainer>
      <StatusBar style="auto" />
      <FlashMessage position="top" />
    </SafeAreaView>
  );
}


