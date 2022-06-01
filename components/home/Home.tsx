import { Text, View, ScrollView } from 'react-native';

import { Base, Typography } from "../../styles/index";

export default function Home() {

    return (
        <ScrollView>
            <View style={Base.container_home}>
                <Text style={Typography.header1}>
                    Välkommen till TimeTrain
                </Text>
                <Text style={Typography.train_header}>
                    - din nya resekompanjon!
                </Text>
                
            </View>
        </ScrollView>
  );
}
