import { View, Text, TextInput, Button } from "react-native";
// import { Typography, Forms, Base } from "../../styles";
import { showMessage } from "react-native-flash-message";

//                                  dict  setDict         func
export default function AuthFields({auth, setAuth, title, submit, navigation}) {

    function validateEmail(text: string) {

        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        // hämtad från https://emailregex.com/

        if (!text.match(pattern)) {
            showMessage({
                message: "Email ej giltig",
                description: "Ser inte ut som en emailadress.",
                type: "warning",
                floating: true,
                autoHide: false
            });
        } else {
            showMessage({
                message: "Email är godkänd!",
                type: "success",
                floating: true
            });
        }
    }


    function validatePassword(text: string) {

        const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!\.-]).{4,}$/
        // ^                : Start
        // (?=.*\d)         : Digits
        // (?=.*[a-z])      : lower letters
        // (?=.*[A-Z])      : upper letters
        // (?=.*[!\.-\?])   : special characters ("\" för att kunna använda tex punkt)
        // (?=.{4,})        : Length
        // $                : avslutar?

        const minLength = 4;
        const specialChar = "!.-";
        if (!text.match(pattern)) {
            showMessage({
                message: "Lösenord ej giltigt",
                description: "Lösenordet måste innehålla minst en stor bokstav, en liten bokstav, en siffra, ett specialtecken(!.-) och vara minst 4 tecken långt.",
                type: "warning",
                floating: true,
                autoHide: false
            });
        } else {
            showMessage({
                message: "Lösenordet är godkänt!",
                type: "success",
                floating: true
            });
        }
    }

    return (
        <View>
        <Text>{title}</Text>

        <Text>E-post</Text>
        <TextInput
            onChangeText={(content: string) => {
                validateEmail(content)
                setAuth({...auth, email: content})
            }}
            value={auth?.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            testID="email-field"
            />

        <Text>Lösenord</Text>
        <TextInput 
            onChangeText={(content: string) => {
                validatePassword(content)
                setAuth({...auth, password: content})
            }}
            value={auth?.password}
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            testID="password-field"
            />

        <Button 
            title={title}
            onPress={() => {
                submit();
            }}
            accessibilityLabel={`${title} genom att trycka`}
            />
        <Text></Text>
        {title == "Logga in" &&
            <Button 
                title="Registrera"
                onPress={() => {
                    navigation.navigate("Register")
                }}
            />
        }

    </View>
    );
};