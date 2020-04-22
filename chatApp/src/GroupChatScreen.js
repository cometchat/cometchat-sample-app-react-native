/* eslint-disable no-return-assign */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable eol-last */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-lone-blocks */
/* eslint-disable keyword-spacing */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unreachable */
/* eslint-disable quotes */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {View, FlatList, StyleSheet, TextInput, Image, TouchableOpacity, Keyboard, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import {CometChat} from '@cometchat-pro/react-native-chat';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Video from 'react-native-video';
import { Linking } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
let guid, messagelist, myUserID, username, avatar;

export class GroupChatScreen extends Component {
    messagesRequest = null;

    constructor() {
        super()
        this.state = {
            messages: [],
            txtMessage:'',
            mediaMsg: '',
            refreshing: false,
            autoScroll : true,
        }
        this.sendMessage = this.sendMessage.bind(this);
        this.sendMediaMessage = this.sendMediaMessage.bind(this);
        this.sendMsg = this.sendMsg.bind(this);
        this.imagePicker = this.imagePicker.bind(this);
        this.documentPicker = this.documentPicker.bind(this);
        this.showActionSheet = this.showActionSheet.bind(this);
        this.fetchMessages = this.fetchMessages.bind(this);
        this._handleRefresh = this._handleRefresh.bind(this);
        this.getLoggedInUser();
        this.messagesRequest = new CometChat.MessagesRequestBuilder().setGUID(guid).setLimit(30).build();
        this.receiveMessages();
        this.fetchMessages();
        this.addCallListner();
        this.messagelist;
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    }

    componentDidMount(){
        this.props.navigation.setParams({initiateCall: this.initiateCall});
        this.props.navigation.setParams({navigation: this.props.navigation});
    }

    componentWillUnmount(){
        CometChat.removeCallListener("GROUP_CALL_LISTENER");
        CometChat.removeMessageListener("GROUP_SCREEN_MESSAGE_LISTENER");
    }

    static navigationOptions = ({ navigation }) => {

        guid = navigation.getParam('guid', 'defaultGroup');

        username = navigation.getParam('username', 'Default Group');
        
        avatar = navigation.getParam('avatar', 'group');

        const {state} = navigation;

         return {

            headerTitle: (
                <View style={{flex: 1 }}>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginEnd: 16 }}>

                        <View style={{ flexDirection: "row", alignSelf: "center", justifyContent: "space-between" }}>

                            { 
                                avatar === 'group'
                                ?
                                <FontAwesome style={[{ height: 48, width: 48, borderRadius: 24, marginRight: 16 }]} name="group" size={48} color="#fff"/>
                                :
                                <Image style={{ height: 48, width: 48, borderRadius: 24, marginRight: 16 }} source={{uri: avatar}} />
                            }

                            <View style={{ alignSelf: "flex-start" }}>

                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFF' }}>{username}</Text>

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
        var call = new CometChat.Call(this.guid, type, 'group');
        CometChat.initiateCall(call).then(
            Call => {
                CometChat.getGroup(guid).then(
                    group => {
                        if(group){
                            const defaultLayout = 1;
                            const isOutgoing = 1;
                            state.navigate('CallingScreen',{
                                call: Call,
                                enableDefaultLayout: defaultLayout,
                                isOutgoingCall: isOutgoing,
                                entity: group,
                                entityType: 'group',
                                acceptedFrom: 'Group'
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
                console.log("error getting details:", {error})
            }
        );
    }

    addCallListner(){
        var listnerID = "GROUP_CALL_LISTENER";
        var that = this;
        CometChat.addCallListener(
            listnerID,
            new CometChat.CallListener({
                onIncomingCallReceived(call) {
                    console.log("incoming call", guid);
                    const defaultLayout = 1;
                    const isOutgoing = 0;
                    that.props.navigation.navigate('CallingScreen',{
                        call: call,
                        enableDefaultLayout: defaultLayout,
                        isOutgoingCall: isOutgoing,
                        entity: call.getCallReceiver(),
                        entityType: 'group',
                        acceptedFrom: 'Chat',
                    });                            
                },
            })
        );
    }

    mediaView(isMyMess,item){
        switch(item.type){
            case 'image':{
                return(
                    <TouchableOpacity onPress={()=>this.renderFullScreenImage(item)}>
                        <View style={{alignSelf: isMyMess ? 'flex-end' : 'flex-start'}}>
                            <Image style={{ height: 120, width: 120 }} source={{uri: item.data.url}} />
                        </View>
                    </TouchableOpacity>
                );
            }

            case 'video':{
                return(
                    <TouchableOpacity onPress={()=>this.renderFullScreenVideo(item)}>
                        <View style={{alignSelf: isMyMess ? 'flex-end' : 'flex-start'}}>
                             <Video style={{ height: 150, width: 150 }} source={{uri: item.data.url}} paused={true} ref={(ref) => {this.player = ref}}/> 
                        </View>
                    </TouchableOpacity>
                );
            }

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

    renderItem = ({ item }) => {
        let isMyMess,isDelivered,isRead;
        isMyMess = false;
        if(myUserID == item.sender.uid){
            isMyMess = true;
            "readAt" in item ? isRead = true : isRead = false;
            "deliveredAt" in item ? isDelivered = true : isDelivered = false;
        }
        if(item.sender.avatar == null){
            item.sender.avatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
        }
        if(item.category === 'message'){
            if(isMyMess){
                return(
                    <View>
                        <View style={[{flexDirection: 'row' }]}>
                            <View style={[styles.row]}>
                                {
                                    item.type == 'text' ? this.txtView(isMyMess,item) : this.mediaView(isMyMess,item)
                                }                  
                            </View>
                        </View>
                    </View>
                );
            }else{
                return(
                        <View style={[{flexDirection: 'row' }]}>
                        <Image 
                            style={[styles.image,{marginTop:10}]}
                            resizeMode={"cover"}
                            source={{ uri: item.sender.avatar}}
                        />
                        <View style={styles.row}>
                            <View style={{alignSelf: isMyMess ? 'flex-end' : 'flex-start'}}>
                                {
                                    item.type == 'text' ? this.txtView(isMyMess,item) : this.mediaView(isMyMess,item)
                                }
                            </View>
                        </View>
                    </View>
                )
                
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

    _keyboardDidShow () {
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

    render(){
        return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.messages}
                    renderItem={this.renderItem}
                    extraData={this.state.messages}
                    keyExtractor={item => item.id}
                    ref={(ref) => messagelist = ref}
                    onContentSizeChange={()=> this._onContentSizeChange()}
                    onRefresh={this._handleRefresh}
                    refreshing={this.state.refreshing}
                />
                <View style={styles.messageinputcontainer}>
                    <TextInput style={styles.messageinput}
                        placeholder="Enter Message"
                        value = {this.state.txtMessage}
                        onChangeText={text => this.setState({ txtMessage: text })}
                    />
                    <TouchableOpacity style={styles.roundedbackgroud} onPress={this.showActionSheet}>
                        <Image 
                            style={{height: 30, width: 30, alignSelf: 'center'}}
                            source={require('./assets/images/attach_media_icon.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundedbackgroud} onPress={ this.sendMsg } >
                        <Image style={[{height: 30},{width: 30},{alignSelf:'center'}]}
                        source={require('./assets/images/send_icon.png')}
                        />
                    </TouchableOpacity>
                    <ActionSheet
                        title={'Choose File'}
                        ref={o => this.ActionSheet = o}
                        options={['Image', 'Document','Cancel']}
                        cancelButtonIndex={2}
                        onPress={(index) => { if(index == 0){this.imagePicker()}else if(index == 1){this.documentPicker()} }}
                    />
                </View>
             </View>
        );
        
    }

    _onContentSizeChange(){
        if(this.state.autoScroll){
            messagelist.scrollToEnd({animated: false})
        }else{
            setTimeout(() => this.setState({autoScroll:true}), 500)
        }
    }

    _handleRefresh(){
        this.setState({
            autoScroll:false,
            refreshing:true
        })
        this.fetchMessages();
    }

    receiveMessages(){
        var listenerID = "GROUP_SCREEN_MESSAGE_LISTENER";

        CometChat.addMessageListener(
         listenerID,
         new CometChat.MessageListener({
               onTextMessageReceived: textMessage => {
                    if(textMessage.receiverId == guid){
                        if(textMessage.sender.uid != myUserID){
                            CometChat.markAsRead(textMessage.id,textMessage.receiverId,'group');
                            this.setState(
                                prevState => ({
                                    messages: [...prevState.messages, textMessage],
                                })
                            );
                            messagelist.scrollToEnd({animated: false});
                        }
                        
                    }
               },
               onMediaMessageReceived: mediaMessage => {
                if(mediaMessage.receiverId == guid){
                    if(mediaMessage.sender.uid != myUserID){
                        CometChat.markAsRead(mediaMessage.id,mediaMessage.receiverId,'group');
                        this.setState(
                            prevState => ({
                                messages: [...prevState.messages, mediaMessage],
                            })
                        );
                        messagelist.scrollToEnd({animated: false});
                    }
                    
                }
               },
                onCutomMessageReceived: customMessage => {
                 if(customMessage.receiverId == guid){
                    if(customMessage.sender.uid != myUserID){
                        CometChat.markAsRead(customMessage.id,customMessage.receiverId,'group');
                        this.setState(
                            prevState => ({
                                messages: [...prevState.messages, customMessage],
                            })
                        );
                        messagelist.scrollToEnd({animated: false});
                    }
                    
                }
               }
            })
        );
    }

    sendMsg(){
        if(this.state.txtMessage != ''){
            this.sendMessage();
        }else if(this.state.mediaMsg != ''){
            this.sendMediaMessage();
        }
    }

    sendMessage(){
        let receiverType = CometChat.RECEIVER_TYPE.GROUP;
        let textMessage = new CometChat.TextMessage(guid, this.state.txtMessage, receiverType);
        this.setState({
            txtMessage : ''
        })
        CometChat.sendMessage(textMessage).then(
            message => {
                this.setState( 
                    prevState => ({
                        messages: [...prevState.messages, message],
                    })
                );
            },
            error => {
                console.log("message sending failed with error", error);
            }
        );
    }

    sendMediaMessage(){
        var messageType;
        if(this.state.mediaMsg.type.split('/')[0] == 'image'){
            messageType = CometChat.MESSAGE_TYPE.IMAGE;
        }else if(this.state.mediaMsg.type.split('/')[0] == 'video'){
            messageType = CometChat.MESSAGE_TYPE.VIDEO;
        }else if(this.state.mediaMsg.type.split('/')[0] == 'audio'){
            messageType = CometChat.MESSAGE_TYPE.AUDIO;
        }else{
            messageType = CometChat.MESSAGE_TYPE.FILE;
        }
        var receiverType = CometChat.RECEIVER_TYPE.GROUP;
        var mediaMessage = new CometChat.MediaMessage(guid, this.state.mediaMsg, messageType, receiverType);
        this.setState({
            mediaMsg: ''
        });
        
        CometChat.sendMessage(mediaMessage)
        .then(message => {
            this.setState( 
                prevState => ({
                    messages: [...prevState.messages, message],
                })
            );
        },
        error => {
            console.log("Media message sending failed with error", error);
        }
        );
    }

    fetchMessages(){
        this.messagesRequest.fetchPrevious().then(
        	mess => {
                let lastMessage = mess[mess.length - 1];
                if(lastMessage.readAt == null || lastMessage.readAt == undefined && lastMessage.receiverId == guid && lastMessage.sender.uid !== myUserID){
                    CometChat.markAsRead(lastMessage.id, lastMessage.receiverId, lastMessage.receiverType);
                }
                this.setState({
                    messages :[...mess,...this.state.messages],
                    refreshing: false
                })
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
        alignSelf:'baseline',
        paddingHorizontal: 5,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 20,
     },
    row: {
        padding: 5,
        flex : 1
      },
      messageinput :{
          flex:1,
        textAlign: 'justify',
        height: 50,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 20 ,
        padding: 10,
        backgroundColor : "#FFFFFF"
      },
      messageinputcontainer:{
        flexDirection: 'row',
        backgroundColor : "transparent",
          margin:5
      },
      roundedbackgroud:{
          height:40,
          width:40,
          margin:5,
        justifyContent: 'center',
        borderRadius: 30 ,
        backgroundColor : "#3f51b5"
      },image: {
        height: 40,
        width: 40,
        borderRadius: 20,
      }
})