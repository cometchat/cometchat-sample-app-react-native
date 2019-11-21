import React, {Component} from 'react';
import {View, FlatList, StyleSheet, TextInput, Image, TouchableOpacity, Keyboard, Platform } from 'react-native';
import {Text} from 'react-native-paper';
import {CometChat} from '@cometchat-pro/react-native-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Video from 'react-native-video';
import { Linking } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-picker';
let uid, messagelist, typingNotification,status;
let typing = 'typing....';

export class ChatScreen extends Component {
    messagesRequest = null;

    constructor() {
        super()
        this.state = {
            messages: [],
            txtMessage: '',
            mediaMsg: '',
            refreshing: false,
            autoScroll: true,
            fullVideo: 0,
            fullVideoStream: ''
        }
        this.messagesRequest = new CometChat.MessagesRequestBuilder().setUID(uid).setLimit(30).build();
        this.receiveMessages()
        this.fetchMessages = this.fetchMessages.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this.fetchMessages();
        this.messagelist;
        this.sendMessage = this.sendMessage.bind(this);
        this.sendMediaMessage = this.sendMediaMessage.bind(this);
        this.sendMsg = this.sendMsg.bind(this);
        this.imagePicker = this.imagePicker.bind(this);
        this.documentPicker = this.documentPicker.bind(this);
        this.showActionSheet = this.showActionSheet.bind(this);
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

    mediaView(isMyMess,item){
        console.log("Media msg", item);
        switch(item.type){
            case 'image':{
                return(
                    <TouchableOpacity onPress={()=>this.renderFullScreenImage(item)}>
                        <View style={{alignSelf: isMyMess ? 'flex-end' : 'flex-start'}}>
                            <Image style={{ height: 120, width: 120 }} source={{uri: item.data.url}} />
                        </View>
                    </TouchableOpacity>
                );
            }break;

            case 'video':{
                return(
                    <TouchableOpacity onPress={()=>this.renderFullScreenVideo(item)}>
                        <View style={{alignSelf: isMyMess ? 'flex-end' : 'flex-start'}}>
                            <Video style={{ height: 150, width: 150 }} source={{uri: item.data.url}} paused={true} ref={(ref) => {this.player = ref}}/> 
                        </View>
                    </TouchableOpacity>
                );
            }break;

            default:{
                var msg = item.sender.name + ' has sent you a file. Download it here: ';
                return(
                    <View style={[styles.balloon, {backgroundColor: isMyMess ? '#bdbdbd' : '#3f51b5'}, {alignSelf: isMyMess ? 'flex-end' : 'flex-start'}]}>
                        <Text style={[styles.item, {color: isMyMess ? '#757575' : 'white'}, {fontWeight: '600', fontStyle: 'italic'}]}>
                            {msg}
                            <Text onPress={ ()=> Linking.openURL(item.data.url)} style={{color: '#0000EE'}}>
                                {item.data.url}
                            </Text>
                        </Text>
                    </View>
                )
            }
        }
    }

    txtView(isMyMess,item){
        return(
            <View style={[styles.balloon, {backgroundColor: isMyMess ? '#bdbdbd' : '#3f51b5'}, {alignSelf: isMyMess ? 'flex-end' : 'flex-start'}]}>
                <Text style={[styles.item, {color: isMyMess ? '#757575' : 'white'}]}>{item.data.text}</Text>
            </View>
        );
    }

    renderItem = ({item}) => {
        let isMyMess,isRead,isDelivered;
        if (item.receiver == uid) {
            isMyMess = true

            "readAt" in item ? isRead = true : isRead = false;
            "deliveredAt" in item ? isDelivered = true : isDelivered = false;

        } else {
            isMyMess = false
            "readAt" in item ? '' : CometChat.markAsRead(item.id, item.receiverId, item.receiverType);
        }


        
        if(isMyMess){
            return (
                <View>
                    <View style={[{flexDirection: 'row' }]}>
                        <View style={styles.row}>
                            {
                                item.type == 'text' ? this.txtView(isMyMess,item) : this.mediaView(isMyMess,item)
                            }
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
                            style={{alignSelf: isMyMess ? 'flex-end' : 'flex-start'}}>
                            {
                                item.type == 'text' ? this.txtView(isMyMess,item) : this.mediaView(isMyMess,item)
                            }
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
        if(messagelist != null){
            setTimeout(() => messagelist.scrollToEnd(), 100)
        }
    }

    
    getMimeType(type){
        var MimeList = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            gif: 'image/gif',
            png: 'image/png',
            svg: 'image/svg+xml',
            webp: 'image/webp',
            mpeg: 'video/mpeg',
            ogv: 'video/ogg',
            webm: 'video/webm',
            mp4: 'video/mp4',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            pdf: 'application/pdf',
            pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            zip: 'application/zip',
            aac: 'audio/aac',
            wav: 'audio/wav',
            weba: 'audio/webm',
            mp3: 'audio/mpeg',
            oga: 'audio/ogg'
        };
        return MimeList[type];
    }

    documentPicker(){
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        },(error,response) => {
            if(Platform.OS === 'ios'){
                var ext = response.fileName.split('.')[1].toLowerCase();               
                var type = this.getMimeType(ext);
            }
            var file = {
                name: response.fileName,
                type: Platform.OS === "android" ? response.type : type, 
                uri: Platform.OS === "android" ? response.uri : response.uri.replace("file://",""),
            }
            this.setState({ mediaMsg: file });
        });
    }

    imagePicker(){
        const options = {
            quality: 1.0,
            storageOptions: {
              skipBackup: true,
            },
          };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled photo picker');
              } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
              } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
              } else {
                console.log('ImagePicker Response: ',response);
                if(Platform.OS === 'ios' && response.fileName != undefined){
                    var ext = response.fileName.split('.')[1].toLowerCase();               
                    var type = this.getMimeType(ext);
                    var name = response.fileName;
                }else{
                    var type = response.type;
                    var name = 'Camera_001.jpeg';
                }
                var file = {
                    name: Platform.OS === "android" ? response.fileName : name,
                    type: Platform.OS === "android" ? response.type : type, 
                    uri: Platform.OS === "android" ? response.uri : response.uri.replace("file://",""),
                }
                console.log('file: ', file);
                this.setState({ mediaMsg: file });
            }
        });
    }

    showActionSheet() {
        this.ActionSheet.show();
    }

    renderFullScreenVideo(item){
        this.props.navigation.navigate('Video',{
            url: item.data.url,
        });
    }

    renderFullScreenImage(item){
        this.props.navigation.navigate('Image',{
            url: item.data.url,
        });
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
                    <TouchableOpacity style={styles.roundedbackgroud} onPress={this.showActionSheet}>
                        <Image 
                            style={{height: 30, width: 30, alignSelf: 'center'}}
                            source={require('./assets/images/attach_media_icon.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundedbackgroud} onPress={this.sendMsg}>
                        <Image 
                            style={{height: 30,width: 30, alignSelf: 'center'}}
                            source={require('./assets/images/send_icon.png')}
                        />
                    </TouchableOpacity>

                </View>
                <ActionSheet
                    title={'Choose File'}
                    ref={o => this.ActionSheet = o}
                    options={['Image', 'Document','Cancel']}
                    cancelButtonIndex={2}
                    onPress={(index) => { if(index == 0){this.imagePicker()}else if(index == 1){this.documentPicker()} }}
                />
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
        //.log('on handle refresh');
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
                    if(textMessage.sender.uid == uid && textMessage.receiverType == 'user'){
                        this.setState((state)=>{
                            return state.messages.push(textMessage)
                        });
                    }
                },
                onMediaMessageReceived: mediaMessage => {
                    console.log("Media message received successfully", mediaMessage);
                    if(mediaMessage.sender.uid == uid && mediaMessage.receiverType == 'user'){
                        this.setState((state)=>{
                            return state.messages.push(mediaMessage)
                        });
                    }
                },
                onCutomMessageReceived: customMessage => {
                    console.log("Media message received successfully", customMessage);
                    if(customMessage.sender.uid == uid && customMessage.receiverType == 'user'){
                        this.setState((state)=>{
                            return state.messages.push(customMessage)
                        });
                    }
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
    
    sendMsg(){
        if(this.state.txtMessage != ''){
            console.log("sending text message");
            this.sendMessage();
        }else if(this.state.mediaMsg != ''){
            console.log("sending media message");
            this.sendMediaMessage();
        }
    }

    sendMessage() {
        console.log('Send message called =', this.state.txtMessage);
        var messageType = CometChat.MESSAGE_TYPE.TEXT;
        var receiverType = CometChat.RECEIVER_TYPE.USER;
        var textMessage = new CometChat.TextMessage(uid, this.state.txtMessage, receiverType);
        this.setState({
            txtMessage: ''
        })

        console.log("Send End typing called",textMessage)
        CometChat.endTyping(typingNotification);

        CometChat.sendMessage(textMessage).then(
            message => {
                console.log('cometchat send message', message);
                this.setState((state) => {
                    return state.messages.push(message)
                })
            },
            error => {
                console.log("Message sending failed with error:", error);
            }
        );
    }

    sendMediaMessage(){
        var messageType;
        if(this.state.mediaMsg.type.split('/')[0] == 'image'){
            messageType = CometChat.MESSAGE_TYPE.IMAGE;
        }else if(this.state.mediaMsg.type.split('/')[0] == 'video'){
            messageType = CometChat.MESSAGE_TYPE.VIDEO;
        }else{
            messageType = CometChat.MESSAGE_TYPE.FILE;
        }
        var receiverType = CometChat.RECEIVER_TYPE.USER;
        var mediaMessage = new CometChat.MediaMessage(uid, this.state.mediaMsg, messageType, receiverType);
        this.setState({
            mediaMsg: ''
        });
        console.log("mediaMessage: ", mediaMessage); 
        
        CometChat.sendMessage(mediaMessage)
        .then(message => {
            console.log('cometchat send media message', message);
            this.setState((state) => {
                return state.messages.push(message)
            })
        },
        error => {
            console.log("Media message sending failed with error", error);
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
        fontSize: 15
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