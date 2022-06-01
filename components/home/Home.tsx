import { Image, Text, View, ScrollView } from 'react-native';
import { StyleSheet } from "react-native";

import { Base, Typography } from "../../styles/index";

export default function Home() {

    return (
        <ScrollView>
            <View style={Base.container_home}>
                <Text>
                    Välkommen till TimeTrain - din nya resekompanjon!
                </Text>
                
            </View>
        </ScrollView>
  );
}
