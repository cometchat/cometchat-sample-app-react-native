import React, {Component} from 'react';
import {View, FlatList, StyleSheet, TextInput, Image, TouchableOpacity, Keyboard} from 'react-native';
import {Text} from 'react-native-paper';
import {CometChat} from '@cometchat-pro/chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from "react-native-vector-icons/FontAwesome";


let uid, messagelist, typingNotification,status;
let typing = 'typing....'


export class ChatScreen extends Component {
    messagesRequest = null;

    constructor() {
        super()
        this.state = {
            messages: [],
            txtMessage: '',
            refreshing: false,
            autoScroll: true,
        }
        this.messagesRequest = new CometChat.MessagesRequestBuilder().setUID(uid).setLimit(30).build();
        this.receiveMessages()
        this.fetchMessages = this.fetchMessages.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this.fetchMessages();
        this.messagelist;
        this.sendMessage = this.sendMessage.bind(this)
        this.addUserListner()
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        let receiverType = CometChat.RECEIVER_TYPE.USER;
        typingNotification = new CometChat.TypingIndicator(uid, receiverType);
    }

    static navigationOptions = ({navigation}) => {
        uid = navigation.getParam('uid', 'NO-ID');
        username = navigation.getParam('username', 'some default value');
        status = navigation.getParam('status', 'some default value');
        const {state} = navigation;


        return {
            //title: navigation.getParam('username', 'ChatScreen'),

            headerTitle: (
                <View>
                    <Text
                        style={[{fontSize: 20}, {fontWeight: 'bold'}, {color: '#FFF'}]}>{navigation.getParam('username', 'ChatScreen')}</Text>
                    <Text
                        style={[{fontSize: 15}, {fontStyle: 'italic'}, {color: '#FFF'}, {marginStart: 2}, {marginEnd: 2}]}>{state.params.title}</Text>
                </View>
            ),
            headerStyle: {
                backgroundColor: '#3f51b5',
            },
            headerTintColor: '#fff',
        };
    };

    renderItem = ({item}) => {
        let isMyMess,isRead,isDelivered;
        if (item.receiver == uid) {
            isMyMess = true

            "readAt" in item ? isRead = true : isRead = false;
            "deliveredAt" in item ? isDelivered = true : isDelivered = false;

        } else {
            isMyMess = false
            "readAt" in item ? '' : CometChat.markMessageAsRead(item);
        }



        if(isMyMess){
            return (
                <View>

                    <View style={[{flexDirection: 'row' }]}>
                        <View style={styles.row}>
                            <View
                                style={[styles.balloon, {backgroundColor: isMyMess ? '#bdbdbd' : '#3f51b5'}, {alignSelf: isMyMess ? 'flex-end' : 'flex-start'}]}>
                                <Text style={[styles.item, {color: isMyMess ? '#757575' : 'white'}]}>
                                    {item.data.text}
                                </Text>
                            </View>
                        </View>
                       {this.displayReceipt(isRead,isDelivered)}

                    </View>
                </View>
            );
        }else{
            return (
                <View>
                    <View style={styles.row}>
                        <View
                            style={[styles.balloon, {backgroundColor: isMyMess ? '#bdbdbd' : '#3f51b5'}, {alignSelf: isMyMess ? 'flex-end' : 'flex-start'}]}>
                            <Text style={[styles.item, {color: isMyMess ? '#757575' : 'white'}]}>
                                {item.data.text}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        }
    }


    displayReceipt(isRead,isDelivered){
        if(isRead){
            return <MaterialCommunityIcons style={[{alignSelf: 'center'}]} name='check-all' size={15} color="#2196f3"/>
        }else if(isDelivered){
            return <MaterialCommunityIcons style={[{alignSelf: 'center'}]} name='check-all' size={15} color="#000"/>
        }else {
            return <MaterialCommunityIcons style={[{alignSelf: 'center'}]} name='check' size={15} color="#000"/>
        }
    }

    addUserListner(){
        var listenerID = "CHAT_SCREEN_USER_LISTNER";

        CometChat.addUserListener(
            listenerID,
            new CometChat.UserListener({
                onUserOnline: onlineUser => {
                    /* when someuser/friend comes online, user will be received here */
                    console.log("On User Online:", { onlineUser });

                    if(onlineUser.uid == uid){
                        status = "Online"
                        this.changeTypingText(status)
                    }
                },
                onUserOffline: offlineUser => {
                    /* when someuser/friend went offline, user will be received here */
                    console.log("On User Offline:", { offlineUser });
                    if(offlineUser.uid == uid){
                        status = "Offline"
                        this.changeTypingText(status)
                    }
                }
            })
        );
    }


    _keyboardDidShow() {
        setTimeout(() => messagelist.scrollToEnd(), 100)
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.messages}
                    renderItem={this.renderItem}
                    extraData={this.state.messages}
                    keyExtractor={item => item.id}
                    ref={(ref) => messagelist = ref}
                    onContentSizeChange={() => this._onContentSizeChange()}
                    onRefresh={this._handleRefresh}
                    refreshing={this.state.refreshing}
                />
                <View style={styles.messageinputcontainer}>
                    <TextInput style={styles.messageinput}
                               placeholder="Enter Message"
                               value={this.state.txtMessage}
                        //onChangeText={text => this.setState({ txtMessage: text })}
                               onChangeText={text => this.onTextChange(text)}
                    />
                    <TouchableOpacity style={styles.roundedbackgroud} onPress={this.sendMessage}>
                        <Image style={[{height: 30}, {width: 30}, {alignSelf: 'center'}]}
                               source={require('./assets/images/send_icon.png')}
                        />
                    </TouchableOpacity>

                </View>
            </View>
        );

    }

    onTextChange(text) {
        this.setState({txtMessage: text})
        this.sendTypingIndicator()
    }

    _onContentSizeChange() {
        if (this.state.autoScroll) {
            messagelist.scrollToEnd({animated: false})
        } else {
            setTimeout(() => this.setState({autoScroll: true}), 500)
        }
    }

    _handleRefresh() {
        console.log('on handle refresh');
        this.setState({
            autoScroll: false,
            refreshing: true
        })
        this.fetchMessages();
    }

    receiveMessages() {
        console.log('Receive messages called');
        var listenerID = 'CHAT_SCREEN_LISTENER_ID';

        CometChat.addMessageListener(
            listenerID,
            new CometChat.MessageListener({
                onTextMessageReceived: textMessage => {
                    console.log("Text message successfully", textMessage);
                    this.setState((state) => {
                        return state.messages.push(textMessage)
                    })
                },
                onMediaMessageReceived: mediaMessage => {
                    console.log("Media message received successfully", mediaMessage);

                },
                onCutomMessageReceived: customMessage => {
                    console.log("Media message received successfully", mediaMessage);

                },
                onTypingStarted: (typingIndicator) => {
                    console.log("Typing started :", typingIndicator);
                    this.changeTypingText("Typing....")
                },
                onTypingEnded: (typingIndicator) => {
                    console.log("Typing ended :", typingIndicator);
                    this.changeTypingText(status)
                },
                onMessageDelivered: (messageReceipt) => {
                    console.log("MessageDeliverd", {messageReceipt});
                    var messages = this.state.messages;
                    for(var i=0;i<messages.length;i++){
                        var message = messages[i]
                        if(message.id == messageReceipt.messageId){
                            message.deliveredAt = messageReceipt.timestamp;
                            this.setState({messages: messages})
                        }
                    }

                }, onMessageRead: (messageReceipt) => {
                    console.log("MessageRead", {messageReceipt});
                    var messages = this.state.messages;
                    for(var i=0;i<messages.length;i++){
                        var message = messages[i]
                        if(message.id == messageReceipt.messageId){
                            message.readAt = messageReceipt.timestamp;
                            this.setState({messages: messages})
                        }
                    }
                }

            })
        );
    }

    changeTypingText = (titleText) => {
        const {setParams} = this.props.navigation;
        setParams({title: titleText})
    }

    sendTypingIndicator() {
        CometChat.startTyping(typingNotification);
    }

    sendMessage() {
        console.log('Send message called =', this.state.txtMessage);
        var messageType = CometChat.MESSAGE_TYPE.TEXT;
        var receiverType = CometChat.RECEIVER_TYPE.USER;
        var textMessage = new CometChat.TextMessage(uid, this.state.txtMessage, messageType, receiverType);
        this.setState({
            txtMessage: ''
        })

        console.log("Send End typing called")
        CometChat.endTyping(typingNotification);

        CometChat.sendMessage(textMessage).then(
            message => {
                this.setState((state) => {
                    return state.messages.push(message)
                })
            },
            error => {
                console.log("Message sending failed with error:", error);
            }
        );
    }

    fetchMessages() {
        console.log('Fetch messages called.....')

        // var messagesRequest = new CometChat.MessagesRequestBuilder().setUID(uid).setLimit(limit).build();

        this.messagesRequest.fetchPrevious().then(
            mess => {
                console.log("Message list fetched:", mess);
                // Handle the list of messages

                this.setState({
                    messages: [...mess, ...this.state.messages],
                    refreshing: false
                })

                this.changeTypingText(status)
            },
            error => {
                console.log("Message fetching failed with error:", error);
            }
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        padding: 10,
        fontSize: 15,
        height: 40
    },
    itemRight: {
        padding: 10,
        fontSize: 18,
        height: 44,
        alignSelf: 'flex-end'
    },
    balloon: {
        alignSelf: 'baseline',
        paddingHorizontal: 5,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 20,
    },
    row: {
        padding: 5,
        flex: 1,
    },
    messageinput: {
        flex: 1,
        textAlign: 'justify',
        height: 50,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 20,
        padding: 10,
        backgroundColor: "#FFFFFF"
    },
    messageinputcontainer: {
        flexDirection: 'row',
        backgroundColor: "transparent",
        margin: 5
    },
    roundedbackgroud: {
        height: 40,
        width: 40,
        margin: 5,
        justifyContent: 'center',
        borderRadius: 30,
        backgroundColor: "#3f51b5"
    }
})