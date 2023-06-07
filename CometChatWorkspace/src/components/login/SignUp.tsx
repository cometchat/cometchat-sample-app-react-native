import { CometChat } from "@cometchat-pro/react-native-chat";
import React from "react"
import { StyleSheet, View, Text, TextInput } from "react-native"
import { RoudedButton } from "../../components/common/RoundedButton"
import { COMETCHAT_CONSTANTS } from "../../CONSTS";
import { CometChatUIKit } from "@cometchat/chat-uikit-react-native";

export const SignUp = (props) => {
    const [uid, setUID] = React.useState("");
    const [name, setName] = React.useState("");
    
    return (
        <View style={{flex: 1, padding: 8}}>
            <Text style={Style.header}>Sign Up</Text>
            <Text style={Style.welcome}>Welcome to CometChat</Text>
            <Text style={Style.defaultText}>Please Enter below details to continue</Text>
            <TextInput
                value={uid}
                onChangeText={txt => setUID(txt)}
                style={Style.inputBox}
                placeholder="Enter UID"
            />
            <TextInput
                value={name}
                onChangeText={txt => setName(txt)}
                style={Style.inputBox}
                placeholder="Enter Name"
            />
            <View style={{flex: 1}} />

            <View>
                <RoudedButton
                    style={{ width: "100%", backgroundColor: "blue", marginBottom: 8 }}
                    onPress={() => {
                        if (uid.length == 0 && name.length == 0)
                            return;
                        CometChat.createUser({uid, name}, COMETCHAT_CONSTANTS.AUTH_KEY)
                            .then(user => {
                                CometChatUIKit.login({uid: uid})
                                .then(loggedInUser => {
                                    props.navigation.navigate("Home");
                                });
                            })
                            .catch(err => {})
                    }}>
                    <Text style={{margin: 8, color: "white"}}>CREATE USER</Text>
                </RoudedButton>
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
    },
    inputBox: {
        width: "100%",
        backgroundColor: "rgba(20,20,20,0.1)",
        borderRadius: 10,
        margin: 4,
        padding: 16
    }
});