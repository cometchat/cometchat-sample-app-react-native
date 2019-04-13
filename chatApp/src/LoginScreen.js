import React, { Component } from 'react';
import {StyleSheet,Text,View,Button,TextInput} from 'react-native';
import {CometChat} from '@cometchat-pro/chat';

import {decode,encode} from 'base-64'
  
  if (!global.btoa) {global.btoa = encode;}
  
  if (!global.atob) {global.atob = decode;}
  
  this.DOMParser = require('xmldom').DOMParser;

  let appID = "xxxxxxxxx" ,apiKey = "xxxxxxxxxxxxxxxxxxxxx";
export class LoginScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor() {
        super()
        this.state = {}
        this.state.entredUID = 'superhero1'
        this.buttonPressed = this.buttonPressed.bind(this)
            CometChat.init(appID).then(() => {
            console.log("Cometchat intialized"); 
               window.document=new window.DOMParser().parseFromString("<?xml version='1.0'?>", 'text/xml'); 
            },error=>{
              console.error(error);
            });
    }

    buttonPressed() {
      UID = this.state.entredUID;
      this.cometchatLogin();
      //this.props.navigation.navigate('Home')
    }

    cometchatLogin (){
      console.log('CometChat login Called')
      CometChat.login(UID, apiKey).then(
        user => {
          var userName = user.name;
          console.log("Login Successful:",{userName});
          this.props.navigation.navigate('Home')
        },
  
        error => {
          console.log("Login failed with exception:", { error });
        }
      );
    }


    render(){
        return(
            <View style={styles.container}>


        <Text style={styles.welcome}>Welcome to CometChat Pro</Text>


        <View style={styles.textlayout}>
          <Text style={styles.lable}>UID</Text>
          <TextInput style={styles.input}
            placeholder="UID"
            placeholderTextColor="#9fa8da"
            autoCapitalize="none"
            defaultValue={this.state.entredUID}
            onChangeText={text => this.setState({ entredUID: text })}
          />

        </View>

        <View style={styles.buttonStyle}>

          <Button
            title="Login"
            color="#3f51b5"
            onPress={this.buttonPressed}
          />
        </View>

      </View>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center'
    },
    textlayout: {
      margin: 10
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 50,
    }, lable: {
      marginStart: 40
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: '#3f51b5',
      marginLeft: 40,
      marginRight: 40,
      height: 40,
    },
    buttonStyle: {
      margin: 40,
      marginLeft: 70,
      marginRight: 70,
      justifyContent: 'center'
    }
  });