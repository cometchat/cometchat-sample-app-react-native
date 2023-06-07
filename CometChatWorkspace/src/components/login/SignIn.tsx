import React from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { RoudedButton } from "../../components/common/RoundedButton";
import { Create } from "./Create";
import { CometChatUIKit } from "@cometchat/chat-uikit-react-native";

export const SignIn = (props) => {
    const [uid, setUID] = React.useState("");
    
    return (
        <View style={{flex: 1, padding: 8}}>
            <Text style={Style.header}>Sign In</Text>
            <Text style={Style.welcome}>Welcome!</Text>
            <Text style={Style.defaultText}>Kindly, enter UID to proceed</Text>
            <TextInput
                value={uid}
                onChangeText={txt => setUID(txt)}
                style={Style.inputBox}
                placeholder="Enter UID"
            />
            <View style={{flex: 1}} />

            <View>
                <RoudedButton
                    style={Style.signInButton}
                    onPress={() => {
                        CometChatUIKit.login({uid})
                            .then(user => {
                                props.navigation.navigate("Home");
                            })
                            .catch(err => Alert.alert("Error", "Unable to login"))
                     }}>
                    <Text style={Style.signInText}>Sign In</Text>
                </RoudedButton>
                <Create navigator={props.navigation} />
            </View>
        </View>
    )
}

const Style = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "black"
    },
    welcome: {
        fontSize: 26,
        color: "blue",
        fontWeight: "bold"
    },
    defaultText: {
        fontSize: 18,
        fontWeight: "700"
    },
    inputBox: {
        width: "100%",
        padding: 16,
        backgroundColor: "rgba(20,20,20,0.1)",
        borderRadius: 10
    },
    signInButton: {
        backgroundColor: 'rgb(50,150,255)',padding: 8,margin: 8
    },
    signInText: {margin: 8, color: "white", fontWeight: "bold", fontSize: 18}
});