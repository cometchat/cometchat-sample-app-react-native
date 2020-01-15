import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, Image, TouchableOpacity,StatusBar} from 'react-native';
import {CometChat} from '@cometchat-pro/react-native-chat';
import { ActivityIndicator} from 'react-native-paper';

import {decode, encode} from 'base-64'

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

this.DOMParser = require('xmldom').DOMParser;

let appID = "XXXXXXXXXXXXXX" ,apiKey = "XXXXXXXXXXXXXXXXXXXXXXXXXXXX", appRegion = "XX"; //us/eu


export class LoginScreen extends Component {
    static navigationOptions = {
        header: null
    }


    constructor() {
        super()
        this.state = {
            loaderVisible : false
        }
        this.state.entredUID = 'superhero2'
        this.buttonPressed = this.buttonPressed.bind(this);
        var appSettings = new CometChat.AppSettingsBuilder()
        .subscribePresenceForAllUsers()
        .setRegion(appRegion)
        .build();
        CometChat.init(appID, appSettings).then(
            () => {
                CometChat.getLoggedinUser().then(
                    user => {
                        console.log("get logged in user =>", user);
                        if(user !== null){
                            this.props.navigation.navigate('Home');
                        }
                    }
                )
                console.log("Initialization completed successfully");
            }, error => {
                console.log("Initialization failed with error:", error);
            }
        );
    }

    buttonPressed() {
        UID = this.state.entredUID;
        this.cometchatLogin();
    }

    cometchatLogin() {
        console.log('CometChat login Called')
        this.setState({ loaderVisible: true })
        CometChat.login(UID, apiKey).then(
            user => {
                this.setState({ loaderVisible: false })
                var userName = user.name;
                console.log("Login Successful:", {userName});
                this.props.navigation.navigate('Home');
            },

            error => {
                console.log("Login failed with exception:", {error});
            }
        );
    }


    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#3f51b5" barStyle="light-content" />
                <Image
                    style={[{height: 150}, {width: 120}, {alignSelf: 'center'}]}
                    source={require('./assets/images/cometchat.png')}
                />

                <View style={styles.inputsContainer}>

                    <View style={styles.textlayout}>
                        <TextInput style={styles.input}
                                   placeholder="Enter UID"
                                   placeholderTextColor="#9fa8da"
                                   autoCapitalize="none"
                                   underlineColorAndroid='transparent'
                                   defaultValue={this.state.entredUID}
                                   onChangeText={text => this.setState({entredUID: text})}
                        />

                    </View>

                    <View style={styles.buttonStyle}>

                        <TouchableOpacity
                            style={styles.SubmitButtonStyle}
                            activeOpacity={.5}
                            onPress={this.buttonPressed}>

                            <Text style={styles.TextStyle}> LOGIN </Text>

                        </TouchableOpacity>
                    </View>

                    <ActivityIndicator
                        style = {styles.LoadingIndicator}
                        size = {30}
                        animating={this.state.loaderVisible} color={'#3f51b5'} />
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#3f51b5'
    },
    textlayout: {
        margin: 10
    },
    lable: {

    }, inputsContainer: {
        marginTop: 50,
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#fff'
    },
    input: {
        marginTop: 40,
        marginLeft: 40,
        marginRight: 40,
        height: 50,
        borderWidth: 0,
        borderColor: '#3f51b5',
        borderRadius: 20 ,
        textAlign: 'center',
        backgroundColor : "#FFFFFF",
        elevation: 10
    },
    buttonStyle: {
        margin: 20,
        marginLeft: 50,
        marginRight: 50,
        justifyContent: 'center'
    },
    SubmitButtonStyle: {
        marginTop:10,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#3f51b5',
        borderRadius:20,
    },

    TextStyle:{
        color:'#fff',
        textAlign:'center',
    },
    LoadingIndicator:{
        marginTop:40
    }
});