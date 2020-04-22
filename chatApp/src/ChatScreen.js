/* eslint-disable quotes */
/* eslint-disable no-return-assign */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable keyword-spacing */
/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {View, FlatList, StyleSheet, TextInput, Image, TouchableOpacity, Keyboard, Platform } from 'react-native';
import {Text} from 'react-native-paper';
import {CometChat} from '@cometchat-pro/react-native-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Video from 'react-native-video';
import { Linking } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
let uid, messagelist, typingNotification, status, myUserID, username, avatar;

export class ChatScreen extends Component {
    messagesRequest = null;

    constructor() {
        super();
        this.state = {
            messages: [],
            txtMessage: '',
            mediaMsg: '',
            refreshing: false,
            autoScroll: true,
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.sendMediaMessage = this.sendMediaMessage.bind(this);
        this.sendMsg = this.sendMsg.bind(this);
        this.imagePicker = this.imagePicker.bind(this);
        this.documentPicker = this.documentPicker.bind(this);
        this.showActionSheet = this.showActionSheet.bind(this);
        this.fetchMessages = this.fetchMessages.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this.getLoggedInUser();
        this.messagesRequest = new CometChat.MessagesRequestBuilder().setUID(uid).setLimit(30).build();
        this.receiveMessages();
        this.fetchMessages();
        this.messagelist;
        this.addUserListner();
        this.addCallListner();
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        let receiverType = CometChat.RECEIVER_TYPE.USER;
        typingNotification = new CometChat.TypingIndicator(uid, receiverType);
    }

    componentDidMount(){
        this.props.navigation.setParams({initiateCall: this.initiateCall});
        this.props.navigation.setParams({navigation: this.props.navigation});
    }

    componentWillUnmount(){
        this.removeListeners();
    }

    removeListeners(){
        CometChat.removeUserListener("CHAT_SCREEN_USER_LISTNER");
        CometChat.removeCallListener("CHAT_SCREEN_CALL_LISTNER");
        CometChat.removeMessageListener("CHAT_SCREEN_MESSAGE_LISTENER");
    }

    static navigationOptions = ({navigation}) => {

        uid = navigation.getParam('uid', 'defaultUser');

        username = navigation.getParam('username', 'Default User');

        status = navigation.getParam('status', 'offline');

        avatar = navigation.getParam('avatar', 'user');
        
        const {state} = navigation;

        return {
            headerTitle: (
                <View style={{ flex: 1 }}>

                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                        <View style={{ flexDirection: "row", alignSelf: "center", justifyContent: "space-between" }}>

                            { 
                                avatar === 'user'
                                ?
                                <FontAwesome style={[{ height: 48, width: 48, borderRadius: 24, marginRight: 16 }]} name="user" size={48} color="#fff"/>
                                :
                                <Image style={{ height: 48, width: 48, borderRadius: 24, marginRight: 16 }} source={{uri: avatar}} />
                            }

                            <View style={{ alignSelf: "flex-start" }}>

                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFF' }}>{username}</Text>

                                <Text style={{ fontSize: 15, fontStyle: 'italic', color: '#FFF' }}>{state.params.title}</Text>

                            </View>

                        </View>

                    </View>

                </View>
            ),
            headerRight: (
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row" }}>

                        <TouchableOpacity onPress={()=>{state.params.initiateCall('video', state.params.navigation);}}>

                            <MaterialCommunityIcons style={{ padding: 8 }} name="video" size={32} color="white"/>

                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=>{state.params.initiateCall('audio', state.params.navigation);}}>

                            <MaterialCommunityIcons style={{ padding: 8 }} name="phone" size={32} color="white"/>

                        </TouchableOpacity>

                    </View>
                </View>
            ),
            headerStyle: {
                backgroundColor: '#3f51b5',
            },
            headerTintColor: '#fff',
        };
    };

    initiateCall(type, state){
        var call = new CometChat.Call(this.uid, type, 'user');
        CometChat.initiateCall(call).then(
            Call => {
                CometChat.getUser(uid).then(
                    user => {
                        if(user){
                            const isAudio = type === 'audio' ? 1 : 0;
                            const defaultLayout = 1;
                            const initiator = 1;
                            const isOutgoing = 1;
                            state.navigate('CallingScreen',{
                                call: Call,
                                isInitiator: initiator,
                                isAudioOnly: isAudio,
                                enableDefaultLayout: defaultLayout,
                                isOutgoingCall: isOutgoing,
                                entity: user,
                                entityType: 'user',
                            });
                        }
                    }
                );
            }
        );
    }

    getLoggedInUser(){
        CometChat.getLoggedinUser().then(
            user=>{
                myUserID = user.uid;
            },error=>{
                console.log('error getting details:', {error});
            }
        );
    }

    mediaView(isMyMess,item,isRead,isDelivered){
        switch(item.type){
            case 'image':{
                if(isMyMess){
                    return(
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={()=>this.renderFullScreenImage(item)}>
                                <View style={{alignSelf:'flex-end'}}>
                                    <Image style={{ height: 120, width: 120 }} source={{uri: item.data.url}} />
                                </View>
                            </TouchableOpacity>
                            <View style={{flexDirection: 'column', justifyContent: 'flex-end'}}>
                                <Text style={{alignSelf: 'flex-end'}}>{this.displayReceipt(isRead,isDelivered)} </Text>
                            </View>
                        </View>
                    );
                }else{
                    return(
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={()=>this.renderFullScreenImage(item)}>
                                <View style={{alignSelf: 'flex-start'}}>
                                    <Image style={{ height: 120, width: 120 }} source={{uri: item.data.url}} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                }
                
            }
            case 'video':{
                if(isMyMess){
                    return(
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={()=>this.renderFullScreenVideo(item)}>
                                <View style={{alignSelf: 'flex-end'}}>
                                    <Video style={{ height: 150, width: 150 }} source={{uri: item.data.url}} paused={true} ref={(ref) => {this.player = ref;}}/> 
                                </View>
                            </TouchableOpacity>
                            <View style={{flexDirection: 'column', justifyContent: 'flex-end'}}>
                                <Text style={{alignSelf: 'flex-end'}}>{this.displayReceipt(isRead,isDelivered)} </Text>
                            </View>
                        </View>
                    );
                }else{
                    return(
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={()=>this.renderFullScreenVideo(item)}>
                                <View style={{alignSelf: 'flex-start'}}>
                                    <Video style={{ height: 150, width: 150 }} source={{uri: item.data.url}} paused={true} ref={(ref) => {this.player = ref;}}/> 
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                }
                
            }
            case 'file':{
                if(isMyMess){
                    var msg = item.sender.name + ' has sent you a file: ';
                    return(
                        <View style={{flexDirection: 'row', marginLeft: 30, marginRight: 10}}>
                            <View style={[styles.balloon, {backgroundColor: '#bdbdbd' }, {alignSelf:'flex-end'}]}>
                                <Text style={[styles.item, {color: '#757575'}, {fontWeight: '600', fontStyle: 'italic'}]}>
                                    {msg}
                                    <Text onPress={ ()=> Linking.openURL(item.data.url)} style={{color: '#0000EE',fontWeight: '600'}}>
                                        Download it here
                                    </Text>
                                </Text>
                            </View>
                            <View style={{flexDirection: 'column', justifyContent: 'flex-end'}}>
                                <Text style={{alignSelf: 'flex-end'}}>{this.displayReceipt(isRead,isDelivered)} </Text>
                            </View>
                        </View>
                    );
                }else{
                    var msg = item.sender.name + ' has sent you a file: ';
                    return(
                        <View style={{flexDirection: 'row', marginLeft: 30, marginRight: 10}}>
                            <View style={[styles.balloon, {backgroundColor: '#3f51b5'}, {alignSelf: 'flex-start'}]}>
                                <Text style={[styles.item, {color: 'white'}, {fontWeight: '600', fontStyle: 'italic'}]}>
                                    {msg}
                                    <Text onPress={ ()=> Linking.openURL(item.data.url)} style={{color: '#0000EE',fontWeight: '600'}}>
                                        Download it here
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    );
                }
            }
            default:{
                return null;
            }
        }
    }

    txtView(isMyMess,item,isRead, isDelivered){
        if(isMyMess){
            return(
                <View style={{flexDirection: 'row'}}>
                    <View style={[styles.balloon, {backgroundColor: '#3f51b5'}, {alignSelf: 'flex-end'}]}>
                        <Text style={[styles.item, {color:'#ffffff'}]}>{item.data.text}</Text>
                    </View>
                    <View style={{flexDirection: 'column', justifyContent: 'flex-end'}}>
                        <Text style={{alignSelf: 'flex-end'}}>{this.displayReceipt(isRead,isDelivered)} </Text>
                    </View>
                </View>
            );
        }else{
            return(
                <View style={{flexDirection: 'row'}}>
                    <View style={[styles.balloon, {backgroundColor: '#e6e9ed'}, {alignSelf: 'flex-start'}]}>
                        <Text style={[styles.item, {color:'#797777'}]}>{item.data.text}</Text>
                    </View>
                </View>
            );
        }
        
    }

    renderItem = ({item}) => {
        let isMyMess,isRead,isDelivered;
        isMyMess = false;
        if (item.receiverId == uid) {
            isMyMess = true;
            'readAt' in item ? isRead = true : isRead = false;
            'deliveredAt' in item ? isDelivered = true : isDelivered = false;
        }
        if(item.category === 'message'){
            if(isMyMess){
                return (
                    <View>
                        <View style={styles.row}>
                            <View style={{alignSelf: 'flex-end'}}>
                                {
                                    item.type == 'text' ? this.txtView(isMyMess,item,isRead,isDelivered) : this.mediaView(isMyMess,item,isRead,isDelivered)
                                }
                            </View>
                        </View>
                    </View>
                );
            }else{
                return (
                    <View style={{ marginRight: 10}}>
                        <View style={styles.row}>
                            <View style={{alignSelf: 'flex-start'}}>
                                {
                                    item.type == 'text' ? this.txtView(isMyMess,item) : this.mediaView(isMyMess,item)
                                }
                            </View>
                        </View>
                    </View>
                );
            }
        }else if(item.category === 'call'){
            return (
                <View>
                    <View style={styles.row}>
                        <View style={{alignSelf: 'center'}}>
                            {
                                this.displayCallMessages(item)
                            }
                        </View>
                    </View>
                </View>
            );
        }
    }

    displayCallMessages(item){
        var message;
        switch (item.status){
            case 'initiated':{
                message = "Call Initiated";
                break;
            }
            case 'ongoing':{
                message = "Call Ongoing";
                break;
            }
            case 'unanswered':{
                message = "Call Unanswered";
                break;
            }
            case 'rejected':{
                message = "Call Rejected";
                break;
            }
            case 'busy':{
                message = "Call Busy";
                break;
            }
            case 'cancelled':{
                message = "Call Cancelled";
                break;
            }
            case 'ended':{
                message = "Call Ended";
                break;
            }
            default:{
                break;
            }
        }
        return(
            <View style={{flexDirection: 'row'}}>
                <View style={[styles.balloon, {backgroundColor: '#c2c5ca'}, {alignSelf: 'center'}]}>
                    <Text style={[styles.item, {color:'#fff'}]}>{message}</Text>
                </View>
            </View>
        );
    }

    displayReceipt(isRead,isDelivered){
        if(isRead){
            return <MaterialCommunityIcons style={[{alignSelf: 'flex-end'}]} name="check-all" size={15} color="#2196f3"/>;
        }else if(isDelivered){
            return <MaterialCommunityIcons style={[{alignSelf: 'flex-end'}]} name="check-all" size={15} color="#000"/>;
        } else {
            return <MaterialCommunityIcons style={[{alignSelf: 'flex-end'}]} name="check" size={15} color="#000"/>;
        }
    }
    
    addCallListner(){
        var listnerID = "CHAT_SCREEN_CALL_LISTNER";
        var that = this;
        CometChat.addCallListener(
            listnerID,
            new CometChat.CallListener({
                onIncomingCallReceived(call) {
                    const defaultLayout = 1;
                    const isOutgoing = 0;
                    that.props.navigation.navigate('CallingScreen',{
                        call: call,
                        enableDefaultLayout: defaultLayout,
                        isOutgoingCall: isOutgoing,
                        entity: call.getCallInitiator(),
                        entityType: 'user',
                        acceptedFrom: 'Chat',
                    });
                },
            })
        );
    }

    addUserListner(){
        var listenerID = 'CHAT_SCREEN_USER_LISTNER';

        CometChat.addUserListener(
            listenerID,
            new CometChat.UserListener({
                onUserOnline: onlineUser => {
                    console.log("user online");
                    if(onlineUser.uid == uid){
                        status = 'Online';
                        this.changeTypingText(status);
                    }
                },
                onUserOffline: offlineUser => {
                    console.log("user offline");
                    if(offlineUser.uid == uid){
                        status = 'Offline';
                        this.changeTypingText(status);
                    }
                },
            })
        );
    }

    _keyboardDidShow() {
        if(messagelist != null){
            setTimeout(() => messagelist.scrollToEnd(), 100);
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
            oga: 'audio/ogg',
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
                type: Platform.OS === 'android' ? response.type : type, 
                uri: Platform.OS === 'android' ? response.uri : response.uri.replace('file://',''),
            };
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
                    name: Platform.OS === 'android' ? response.fileName : name,
                    type: Platform.OS === 'android' ? response.type : type, 
                    uri: Platform.OS === 'android' ? response.uri : response.uri.replace('file://',''),
                };
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
                    onPress={(index) => { if(index == 0){this.imagePicker();}else if(index == 1){this.documentPicker();} }}
                />

            </View>
        );
    }

    onTextChange(text) {
        this.setState({txtMessage: text});
        this.sendTypingIndicator();
    }

    _onContentSizeChange = () => {
        if (this.state.autoScroll) {
            messagelist.scrollToEnd({animated: false});
        } else {
            setTimeout(() => this.setState({autoScroll: true}), 500);
        }
    }

    _handleRefresh() {
        this.setState({
            autoScroll: false,
            refreshing: true,
        });
        this.fetchMessages();
    }

    receiveMessages() {
        var listenerID = 'CHAT_SCREEN_MESSAGE_LISTENER';

        CometChat.addMessageListener(
            listenerID,
            new CometChat.MessageListener({
                onTextMessageReceived: textMessage => {
                    if(textMessage.sender.uid === uid && textMessage.receiverType === 'user'){
                        CometChat.markAsRead(textMessage.id,textMessage.sender.uid,'user');
                        this.setState(
                            prevState => ({
                                messages: [...prevState.messages, textMessage],
                            })
                        );
                        messagelist.scrollToEnd({animated: false});
                    }
                },
                onMediaMessageReceived: mediaMessage => {
                    if(mediaMessage.sender.uid == uid && mediaMessage.receiverType == 'user'){
                        CometChat.markAsRead(mediaMessage.id,mediaMessage.sender.uid,'user');
                        this.setState( 
                            prevState => ({
                                messages: [...prevState.messages, mediaMessage],
                            })
                        );
                        messagelist.scrollToEnd({animated: false});
                    }
                },
                onCutomMessageReceived: customMessage => {
                    if(customMessage.sender.uid == uid && customMessage.receiverType == 'user'){
                        CometChat.markAsRead(customMessage.id,customMessage.sender.uid,'user');
                        this.setState( 
                            prevState => ({
                                messages: [...prevState.messages, customMessage],
                            })
                        );
                        messagelist.scrollToEnd({animated: false});
                    }
                },
                onTypingStarted: (typingIndicator) => {
                    this.changeTypingText(typingIndicator.sender.uid+" is typing....")
                },
                onTypingEnded: (typingIndicator) => {
                    this.changeTypingText(status);
                },
                onMessagesDelivered: (messageReceipt) => {
                    var messages = this.state.messages;
                    for(var i = 0; i < messages.length; i++){
                        var message = messages[i];
                        if(message.deliveredAt == null || message.deliveredAt == undefined){
                            message.deliveredAt = messageReceipt.timestamp;
                            this.setState({messages: messages});
                        }
                    }

                }, onMessagesRead: (messageReceipt) => {
                    var messages = this.state.messages;
                    for(var i = 0; i < messages.length; i++){
                        var message = messages[i];
                        if(message.readAt == null || message.readAt == undefined){
                            message.readAt = messageReceipt.timestamp;
                            this.setState({messages: messages});
                        }
                    }
                },

            })
        );
    }

    changeTypingText = (titleText) => {
        const {setParams} = this.props.navigation;
        setParams({title: titleText});
    }

    sendTypingIndicator() {
        CometChat.startTyping(typingNotification);
    }
    
    sendMsg(){
        if(this.state.txtMessage != ''){
            CometChat.endTyping(typingNotification);
            this.sendMessage();
        }else if(this.state.mediaMsg != ''){
            this.sendMediaMessage();
        }
    }

    sendMessage() {
        var receiverType = CometChat.RECEIVER_TYPE.USER;
        var textMessage = new CometChat.TextMessage(uid, this.state.txtMessage, receiverType);
        this.setState({
            txtMessage: '',
        });
        CometChat.sendMessage(textMessage).then(
            message => {
                console.log('message', message);
                this.setState( 
                    prevState => ({
                        messages: [...prevState.messages, message],
                    })
                );
            },
            error => {
                console.log('Message sending failed with error:', error);
            }
        );
    }

    sendMediaMessage(){
        if(this.state.mediaMsg.type.split('/')[0] == 'image'){
            messageType = CometChat.MESSAGE_TYPE.IMAGE;
        }else if(this.state.mediaMsg.type.split('/')[0] == 'video'){
            messageType = CometChat.MESSAGE_TYPE.VIDEO;
        }else if(this.state.mediaMsg.type.split('/')[0] == 'audio'){
            messageType = CometChat.MESSAGE_TYPE.AUDIO;
        }else{
            messageType = CometChat.MESSAGE_TYPE.FILE;
        }
        var receiverType = CometChat.RECEIVER_TYPE.USER;
        var mediaMessage = new CometChat.MediaMessage(uid, this.state.mediaMsg, messageType, receiverType);
        this.setState({
            mediaMsg: '',
        });
        
        CometChat.sendMediaMessage(mediaMessage).then(
            message => {
                this.setState( 
                    prevState => ({
                        messages: [...prevState.messages, message],
                    })
                );
            },error => {
                console.log('Media message sending failed with error', error);
            }
        );
    }

    fetchMessages() {
        this.messagesRequest.fetchPrevious().then(
            mess => {
                let lastMessage = mess[mess.length - 1];
                if(lastMessage.readAt == null || lastMessage.readAt == undefined && lastMessage.receiverId == myUserID){
                    CometChat.markAsRead(lastMessage.id, lastMessage.sender.uid, lastMessage.receiverType);
                }
                this.setState({
                    messages: [...mess, ...this.state.messages],
                    refreshing: false,
                });
                this.changeTypingText(status);
            },
            error => {
                console.log('Message fetching failed with error:', error);
            }
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        padding: 10,
        fontSize: 15,
    },
    itemRight: {
        padding: 10,
        fontSize: 18,
        height: 44,
        alignSelf: 'flex-end',
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
        backgroundColor: '#FFFFFF',
    },
    messageinputcontainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 5,
    },
    roundedbackgroud: {
        height: 40,
        width: 40,
        margin: 5,
        justifyContent: 'center',
        borderRadius: 30,
        backgroundColor: '#3f51b5',
    },
});
