/* eslint-disable jsx-quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {View, Text, Image, Dimensions } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
export class ImageViewer extends Component {

    static navigationOptions = ({navigation}) => {

        return {
            headerTitle: (
                <View>
                    <Text style={[{fontSize: 20}, {fontWeight: 'bold'}, {color: '#FFF'}]}>Image Viewer</Text>
                </View>
            ),
            headerStyle: {
                backgroundColor: '#3f51b5',
            },
            headerTintColor: '#fff',
        };
    };

    constructor(props){
        super(props);
        this.url = this.props.navigation.getParam('url','');
    }

    render(){
        return (
            <View>
                <Image source={{ uri: this.url }} style={{ height: screenHeight, width: screenWidth }} resizeMode='center' />
            </View>
        );
    }

}
