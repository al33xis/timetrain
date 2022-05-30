import { Image, Text, View, ScrollView } from 'react-native';
import { StyleSheet } from "react-native";

// import { Base, Typography } from "../../styles/index";

export default function Home() {

    return (
        <ScrollView>
            <View style={style.container}>
                <Text>
                    Välkommen till TimeTrain - din nya resekompanjon!
                </Text>
                
            </View>
        </ScrollView>
  );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    }
})