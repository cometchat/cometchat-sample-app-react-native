import { StyleSheet } from "react-native";

export const Style = StyleSheet.create({
    container: {
        padding: 8
    },
    LogoImage: {
        height: 50,
        width: 50,
        borderRadius: 5
    },
    Title: {
        fontSize: 26,
        color: "rgba(20,20,20,0.8)",
    },
    Version: {
        fontSize: 34,
        fontWeight: "700",
        color: "black"
    },
    LoginButton: {
        backgroundColor: 'black',
        marginBottom: 8,
        padding: 16,
        width: "48%",
        justifyContent: "flex-start"

    },
    ButtonText: {
        color: 'white',
        marginLeft: 10
    },
    CustomLoginButton: {
        backgroundColor: 'rgb(50,150,255)',
        padding: 10,
        marginVertical: 8,
        borderRadius: 8
    },
    DefaultText: {},
    ButtonImage: {
        backgroundColor: "#e6e6e6",
        height: 32,
        width: 32,
        borderRadius: 16
    },
});