/* eslint-disable keyword-spacing */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import { View } from 'react-native';
import {CometChat} from '@cometchat-pro/react-native-chat';
export class MainCallScreen extends Component {

    constructor(props){
        super(props);
        let callListener = new CometChat.OngoingCallListener({
            onUserJoined: user => {
                console.log('OngoingCallListener: User joined call:', user.getUid());
            },
            onUserLeft: user => {
                console.log('OngoingCallListener: User left call:', user.getUid());
            },
            onCallEnded: call => {
                console.log('OngoingCallListener: Call ended listener', call.getSessionId());
                this.gotoChat();
            },
        });
        this.addCallListner();
        this.sessionId = this.props.navigation.getParam('sessionId','sessionid');
        this.defaultLayout = this.props.navigation.getParam('enableDefaultLayout', 1);
        this.entity = this.props.navigation.getParam('entity', {});
        this.entityType = this.props.navigation.getParam('entityType', 'user');
        this.acceptedFrom = this.props.navigation.getParam('acceptedFrom', 'Home');
        this.callSettings = new CometChat.CallSettingsBuilder().setSessionID(this.sessionId).enableDefaultLayout(true).setCallEventListener(callListener).build();
    }

    static navigationOptions = () => {
        return {
           header: () => null,
        };
    }

    addCallListner(){
        var listnerID = 'MAIN_CALLING_SCREEN_CALL_LISTENER';
        CometChat.addCallListener(
            listnerID,
            new CometChat.CallListener({
                onIncomingCallReceived(call) {
                    var sessionID = call.getSessionId();
                    var status = CometChat.CALL_STATUS.BUSY;
                    CometChat.rejectCall(sessionID, status).then(
                        rejectedCall => {
                            console.log('Incoming Call rejected', rejectedCall);
                        },
                        error => {
                            console.log('Call rejection failed with error:', error);
                        }
                    );
                },
            })
        );
    }

    componentWillUnmount(){
        CometChat.removeCallListener('MAIN_CALLING_SCREEN_CALL_LISTENER');
    }

    gotoChat(){
        if(this.acceptedFrom === 'Home'){
            this.props.navigation.navigate('Home');
        }else{
            if(this.entityType === 'user'){
                this.props.navigation.navigate('Chat', {
                    uid: this.entity.uid,
                    username: this.entity.name,
                    status: this.entity.status,
                    avatar: this.entity.avatar ? this.entity.avatar : 'user',
                });
            }else{
                this.props.navigation.navigate('Group', {
                    uid: this.entity.guid,
                    username: this.entity.name,
                    avatar: this.entity.avatar ? this.entity.avatar : 'group',
                });
            }
        }
    }

    render(){
        return(
            <View style={{flex: 1, background: '#000'}}>
                <CometChat.CallingComponent callsettings= {this.callSettings} onFailure = {(e)=>{console.log('error', e);}} />
            </View>
        );
    }
}
