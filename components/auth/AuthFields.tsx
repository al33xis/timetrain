import { View, Text, TextInput, Button, Pressable, ScrollView } from "react-native";
// import { Typography, Forms, Base } from "../../styles";
import { showMessage } from "react-native-flash-message";
import { useState } from "react";
import { StyleSheet } from "react-native";
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
        <View style={style.container}>
        <Text style={style.header}>{title}</Text>

        <Text style={style.header2}>E-post</Text>
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
            style={style.field}
            />

        <Text style={style.header2}>Lösenord</Text>
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
            style={style.field}
            />

        {title == "Registrera" &&
        <Text style={style.field_text}>Lösenordet måste innehålla: {"\n"} en stor bokstav {"\n"} en liten bokstav {"\n"} en siffra
        {"\n"} ett specialtecken (!.-) {"\n"} och vara minst 4 tecken långt.</Text>
        }

        {validEmail && validPass ?
        <Pressable style={style.button} onPress={() => {
            submit();
        }}>
            <Text style={style.button_text}>{title}</Text>
        </Pressable> :
        <Pressable style={[style.button, style.button_novalid]}>
            <Text style={style.button_text}>{title}</Text>
        </Pressable>
        }

        {title == "Logga in" &&
            <Pressable style={style.button} onPress={() => {
                navigation.navigate("Register")
            }}>
                <Text style={style.button_text}>Registrera</Text>
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

const style = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 22,
    },
    header2: {
        fontSize: 18,
    },
    field_text: {
        fontSize: 12,
        width: 180,
    },
    field: {
        width: 240,
        margin: 22,
        padding: 8,
        fontSize: 18,
        backgroundColor: "#FFF"
    },
    button: {
        backgroundColor: "#00A438",
        marginTop: 20,
        padding: 10,
        width: 300,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    button_text: {
        textAlign: "center",
        fontSize: 20,
        color: "#FFF"
    },
    button_novalid: {
        opacity: 0.5,
    }
})