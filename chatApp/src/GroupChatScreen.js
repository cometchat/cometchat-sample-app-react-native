import React, { Component } from 'react';
import {View,FlatList,StyleSheet,TextInput,Image,TouchableOpacity,Keyboard} from 'react-native';
import { Text } from 'react-native-paper';
import {CometChat} from '@cometchat-pro/chat';



let guid,messagelist,myUserID;

export class GroupChatScreen extends Component {
    messagesRequest = null;

    constructor() {
        super()
        this.state = {
            messages: [],
            txtMessage:'',
            refreshing: false,
            autoScroll : true,
        }
        this.getLoggedInUser()
        this.messagesRequest = new CometChat.MessagesRequestBuilder().setGUID(guid).setLimit(30).build();
        this.receiveMessages()
        this.fetchMessages = this.fetchMessages.bind(this)
        this._handleRefresh = this._handleRefresh.bind(this)
        this.fetchMessages();
        this.messagelist;
        this.sendMessage = this.sendMessage.bind(this)
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    }

    static navigationOptions = ({ navigation }) => {
        guid = navigation.getParam('guid', 'NO-ID');
        username = navigation.getParam('username', 'some default value');

        console.log('Guid = '+guid)
        return {
          title: navigation.getParam('username', 'ChatScreen'),
        };
    };

    getLoggedInUser(){
        var user = CometChat.getLoggedinUser().then(user=>{
            console.log("user details:", {user});
            myUserID = user.uid;
          },error=>{
            console.log("error getting details:", {error})
          });
    }

    renderItem = ({ item }) => {
        let isMyMess;
        if(myUserID == item.sender.uid){
            isMyMess = true
        }else{
            isMyMess = false
        }

        if(isMyMess){
            return(
                <View>
                    <View style={[styles.row]}>
                    <View style={[styles.balloon,{backgroundColor: isMyMess? '#bdbdbd':'#3f51b5'},{alignSelf: isMyMess? 'flex-end':'flex-start'}]}>
                    <Text style={[styles.item,{color: isMyMess? '#757575':'white'} ]}>
                        {item.data.text}
                        </Text>
                    
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
                    
                    <View style={[styles.balloon,{backgroundColor: isMyMess? '#bdbdbd':'#3f51b5'},{alignSelf: isMyMess? 'flex-end':'flex-start'}]}>
                    <Text style={[styles.item,{color: isMyMess? '#757575':'white'} ]}>
                        {item.data.text}
                        </Text>
                    
                    </View>
                   
                    </View>
                </View>
            )
            
        }
        
    }


    _keyboardDidShow () {
        setTimeout(() => messagelist.scrollToEnd(), 100)
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
                    <TouchableOpacity style={styles.roundedbackgroud} onPress={ this.sendMessage } >
                        <Image style={[{height: 30},{width: 30},{alignSelf:'center'}]}
                        source={require('./assets/images/send_icon.png')}
                        />
                    </TouchableOpacity>
                    
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
        console.log('on handle refresh');
        this.setState({
            autoScroll:false,
            refreshing:true
        })
        this.fetchMessages();
    }

    receiveMessages(){
        console.log('Receive messages called');
        var listenerID = "CHAT_SCREEN_LISTENER_ID";

        CometChat.addMessageListener(
         listenerID,
         new CometChat.MessageListener({
               onTextMessageReceived: textMessage => {
                 console.log("Text message successfully", textMessage);
                     this.setState((state)=>{
                      return state.messages.push(textMessage)
                       })
               },
               onMediaMessageReceived: mediaMessage => {
                 console.log("Media message received successfully",  mediaMessage);

               },
                onCutomMessageReceived: customMessage => {
                 console.log("Media message received successfully",  mediaMessage);
                
               }

            })
        );
    }

    sendMessage(){
        console.log('Send message called =',this.state.txtMessage);
        var messageType = CometChat.MESSAGE_TYPE.TEXT;
        var receiverType = CometChat.RECEIVER_TYPE.GROUP;
        console.log('Guid = '+guid)
        var textMessage = new CometChat.TextMessage(guid, this.state.txtMessage, messageType, receiverType);
        this.setState({
            txtMessage :''
        })
        CometChat.sendMessage(textMessage).then(
          message => {  
            this.setState((state)=>{
                return state.messages.push(message)
            })
          },
          error => {
            console.log("Message sending failed with error:", error);
          }
        );
    }

    fetchMessages(){
        console.log('Fetch messages called.....')
        this.messagesRequest.fetchPrevious().then(
        	mess => {
        		console.log("Message list fetched:", mess);
                // Handle the list of messages
                
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