import React, {Component} from 'react';
import {View, Text } from 'react-native';
import Video from 'react-native-video';

export class VideoPlayer extends Component {
    
    static navigationOptions = ({navigation}) => {
        
        return {
            headerTitle: (
                <View>
                    <Text style={[{fontSize: 20}, {fontWeight: 'bold'}, {color: '#FFF'}]}>VideoPlayer</Text>
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
        return(
            <View>
                <Video source={{ uri: this.url }} style={{ height: '100%', width: '100%' }} controls={true} />
            </View>
        )
    }

}