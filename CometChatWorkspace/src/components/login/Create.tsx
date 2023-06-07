import React from "react";
import { View, Text } from "react-native";

export const Create = ({ navigator }) => {
    return (
        <View style={{ flexDirection: 'row', width: "100%", justifyContent: 'space-around'}}>
            <Text>
                Don't have any users?
                <Text onPress={() => navigator.navigate("SignUp")} style={{ color: 'rgb(37, 131, 245)' }}>CREATE NOW</Text>
            </Text>
        </View>
    );
}