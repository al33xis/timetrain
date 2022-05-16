import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Button } from "react-native";
import auth from "../../models/auth";

const Stack = createNativeStackNavigator();

export default function Favourite({setIsLoggedIn}) {

    async function logOut() {
        auth.logout(); // använd en auth-logout funktion i stället
        setIsLoggedIn(false);
    }

    return (
        // <Stack.Navigator initialRouteName="List">
        //     <Stack.Screen name="List">
        //         {(screenProps) => <InvoicesList {...screenProps} setIsLoggedIn={props.setIsLoggedIn} />}
        //     </Stack.Screen>
        //     <Stack.Screen name="Form" component={InvoicesForm} />
        // </Stack.Navigator>
        <View>
            <Text>Test</Text>
            <Button 
            title="Logga ut"
            onPress={async () => {
                await logOut();
            }}
            
            />
        </View>
    );
};


// "base_url": "https://lager.emilfolino.se/v2"
