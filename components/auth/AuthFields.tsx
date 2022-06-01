import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { Typography, Form, Base } from "../../styles";
import { showMessage } from "react-native-flash-message";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';


//                                  dict  setDict         func
export default function AuthFields({auth, setAuth, title, submit, navigation}) {

    const [validEmail, setValidEmail] = useState(false);
    const [validPass, setValidPass] = useState(false);


    function validateEmail(text: string) {
        if (text !== undefined) {
            const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            // hämtad från https://emailregex.com/
    
            if (!text.match(pattern)) {
                showMessage({
                    message: "Email ej giltig",
                    description: "Ser inte ut som en emailadress.",
                    type: "warning",
                    floating: true,
                });
            } else {
                showMessage({
                    message: "Email är godkänd!",
                    type: "success",
                    floating: true
                });

                setValidEmail(!validEmail);
            }
        }
    }


    function validatePassword(text: string) {

        if (text !== undefined) {
            
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
                    description: "Lösenordet uppfyller inte nedan krav.",
                    type: "warning",
                    floating: true,
                });
            } else {
                showMessage({
                    message: "Lösenordet är godkänt!",
                    type: "success",
                    floating: true
                });

                setValidPass(!validPass);
            }
        }

    }



    return (
        <ScrollView>
        <View style={Base.container_authfield}>
        <Text style={Typography.header1}>{title}</Text>

        <Text style={Typography.header2}>E-post</Text>
        <TextInput
            onChangeText={(content: string) => {
                setAuth({...auth, email: content})
            }}
            onEndEditing={() => {
                validateEmail(auth.email);
            }}
            value={auth?.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            testID="email-field"
            style={Form.field}
            />

        <Text style={Typography.header2}>Lösenord</Text>
        <TextInput 
            onChangeText={(content: string) => {
                setAuth({...auth, password: content})
            }}
            onEndEditing={() => {
                    validatePassword(auth?.password);
            }}
            value={auth?.password}
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
            testID="password-field"
            style={Form.field}
            />

        {title == "Registrera" &&
        <Text style={Typography.field_text}>Lösenordet måste innehålla: {"\n"} en stor bokstav {"\n"} en liten bokstav {"\n"} en siffra
        {"\n"} ett specialtecken (!.-) {"\n"} och vara minst 4 tecken långt.</Text>
        }

        {validEmail && validPass ?
        <Pressable style={Form.button} onPress={() => {
            submit();
        }}>
            <Text style={Typography.button_text}>{title}</Text>
        </Pressable> :
        <Pressable style={[Form.button, Form.button_novalid]}>
            <Text style={Typography.button_text}>{title}</Text>
        </Pressable>
        }

        {title == "Logga in" &&
            <Pressable style={Form.button} onPress={() => {
                navigation.navigate("Register")
            }}>
                <Text style={Typography.button_text}>Registrera</Text>
            </Pressable>
        }

        {title == "Registrera" &&
           <Pressable onPress={() => {
                navigation.navigate("Login")
            }}>
                <Ionicons name="arrow-back-circle-outline" color={"#000"} size={50} style={{margin: 20}}/>
            </Pressable>
        }
    </View>
    </ScrollView>
    );
};
