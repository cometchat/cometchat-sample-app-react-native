import React, { Component } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { users} from './fake_data'
import { TouchableRipple, Text, BottomNavigation } from 'react-native-paper';
import NavigationService from './NavigationService';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Menu,MenuOptions,MenuOption,MenuTrigger } from 'react-native-popup-menu';

import ActionSheet from 'react-native-actionsheet';

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: '#FFF',
    }
};

export class HomeScreen extends Component {
    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        console.log("IN HOME SCREEN.");
        super(props);
        this.state = {
            dataItem: '?',
            index: 0,
            routes: [
                {key: 'single', title: 'Contacts', icon: 'contacts', color: '#3F51B5'},
                {key: 'groups', title: 'Group', icon: 'group', color: '#009688'},
            ],
        }
        this._renderScene = this._renderScene.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                <BottomNavigation 
                    theme={theme}
                    navigationState={this.state}
                    onIndexChange={this._handleIndexChange}
                    renderScene={this._renderScene}
                />
            </View>
        );
    }

    _handleIndexChange = index => this.setState({index});

    _renderScene = BottomNavigation.SceneMap({
        single: Contacts,
        groups: Groups,
    });
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        padding: 15,
        fontSize: 18,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 30,
    },
    userName: {
        marginStart: 15,
    },
    roundedbackgroud: {
        height: 40,
        width: 40,
        margin: 5,
        justifyContent: 'center',
        borderRadius: 30,
        backgroundColor: "#3f51b5"
    }, inputsContainer: {
        marginTop: 10,
        marginStart: 10,
        marginEnd: 10,
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#FFF'
    }, activityBackground: {
        flex: 1,
        backgroundColor: '#3f51b5'
    }, activityTitle: {
        padding: 10,
        color: "#FFF",
        fontSize: 20,
        fontWeight: 'bold'
    },circle: {
        width: 10,
        height: 10,
        borderRadius: 10/2,
        marginTop:5,
        marginStart: 15,
    }
})

class Contacts extends Component {
    
    showActionSheet = (item) => {
        this.setState({block: item});
        this.ActionSheet.show();
    }

    constructor() {
        super()
        this.state = {
            dataItem: '?',
            users: [],
            block: [],
        }
        this.blockUser = this.blockUser.bind(this);
        this.onPress = this.onPress.bind(this);
    }

    componentDidMount(){
        this.fetchUser();
        this.addUserListner();
    }

    componentWillUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void {
        console.log("Next state"+JSON.stringify(nextState))
    }

    blockUser(){
        console.log("Block User", this.state.block.uid);
        if(this.state.block != ''){
            let usersList = [this.state.block.uid];
            CometChat.blockUsers(usersList).then(list => {
                console.log("users list blocked", { list });
                this.setState({block: ''});
                this.fetchUser();
            }, error => {
                console.log("Blocking user fails with error", error);
            });
        }
        
    }

     logout(){
        CometChat.logout().then(() =>{
            console.log("Logout completed successfully");
            NavigationService.navigate('Login');
        },error=>{
          console.log("Logout failed with exception:",{error});
        })
     }

     blockedUser(){
        console.log("Blocked Users");
        NavigationService.navigate('Block');
    }

    render() {
        console.log("helloworld!", this.state.users);
        return (

            <View style={styles.activityBackground}>
                <View style={{ flexDirection: 'row', flexWrap: 'nowrap', justifyContent:'space-between', alignItems: 'center' }}>
                    <Text style={[styles.activityTitle]}> Contacts </Text>
                    <Menu>
                        <MenuTrigger style={{ marginEnd: 20}} >
                            <Image source={require('./assets/images/menu_icon.png')} />
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={this.logout} text='Logout' />
                            <MenuOption onSelect={this.blockedUser} text='Block' />
                        </MenuOptions>
                    </Menu>
                </View>
                
                

                <View style={styles.inputsContainer}>
                    <FlatList
                        data={this.state.users}
                        keyExtractor={item => item.uid}
                        renderItem={this.renderItem}/>
                </View>
                <ActionSheet
                    title={'Actions'}
                    ref={o => this.ActionSheet = o}
                    options={['Block', 'Cancel']}
                    cancelButtonIndex={1}
                    onPress={(index) => { if(index == 0){this.blockUser();} }}
                />
            </View>

        )
    }

    fetchUser() {
        console.log('Fetch user called.....')
        var limit = 30;
        var usersRequest = new CometChat.UsersRequestBuilder().setLimit(limit).build();
        usersRequest.fetchNext().then(
            userList => {
                if(userList.length >0){
                    CometChat.getUnreadMessageCountForAllUsers().then(array=>{
                        var unread = Object.keys(array);
                        if(unread.length > 0){
                            unread.map(uid =>{
                                var index = userList.findIndex(user=> user.uid == uid);
                                if(index != -1){
                                    userList[index].unreadCount = array[uid];
                                }
                            });
                        } 
                        this.setState({
                            users: userList,
                        });  
                    })
                }
            },
            error => {
                console.log("User list fetching failed with error:", error);
            }
        );
    }
    
    addUserListner(){
        let  listenerID = "CONTACT_USER_LISTNER";
        let that=this;
        CometChat.addUserListener(
            listenerID,
            new CometChat.UserListener({
                onUserOnline: onlineUser => {
                    /* when someuser/friend comes online, user will be received here */
                    console.log("On User Online:", { onlineUser });
                    that.state.users.map(user=>{
                        if (user.uid == onlineUser.uid){
                            user.status="online"
                            that.setState({users:[...that.state.users]})
                        }
                    })
                },
                onUserOffline: offlineUser => {
                    /* when someuser/friend went offline, user will be received here */
                    console.log("On User Offline:", { offlineUser });
                    that.state.users.map(user=>{
                        if (user.uid == offlineUser.uid){
                            user.status="offline"
                            that.setState({users:[...that.state.users]})
                        }
                    })
                }
            })
        );
    }

    renderItem = ({item}) => {
        console.log("Render item called "+JSON.stringify(item))

        let isOnline,showUnreadCount,showBlockedLabel;

        if (item.avatar == null) {
            item.avatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"  // default avatar
        }

        if(item.status === 'online'){
            isOnline = true;
        }else{
            isOnline = false;
        }

        if(item.unreadCount > 0){
            showUnreadCount = true;
        }else{
            showUnreadCount = false;
        }

        if(item.blockedByMe == true){
            showBlockedLabel = true;
        }else{
            showBlockedLabel = false;
        }

        return (

            <TouchableRipple
                delayLongPress={10}
                onPress={() => {
                    this.onPress(item)
                }}
                onLongPress={() => {
                    console.log("on long press");
                    this.showActionSheet(item);
                }}
                rippleColor="rgba(0, 0, 0, .20)">
                <View style={styles.item} >
                    <Image
                        style={styles.image}
                        resizeMode={"cover"}
                        source={{uri: item.avatar}}
                    />
                    <View>
                        <View style={[{ flex: 1, flexDirection: 'row', width: '100%' }]}>
                            <Text>{item.name}</Text>  
                            { showBlockedLabel ? <Text style={{ color: 'red', fontSize: 12, fontWeight: 'bold' }}> blocked </Text>: null}          
                            { showUnreadCount ? <View style={{ width: 25, height: 25, backgroundColor: 'red', alignContent: 'flex-end', marginLeft: '65%', borderRadius: 25/2, padding: 3, justifyContent: 'center' }}><Text style={{ color: 'white', fontSize: 12, textAlign: 'center' }}>{item.unreadCount}</Text></View> : null }
                        </View>
                        

                        <View style={[{flexDirection: 'row' }]}>
                            <View style={[styles.circle,{ backgroundColor: isOnline?'#76ff03': '#9e9e9e'}]} />
                            <Text style={[{marginStart:5}]}>
                                {item.status}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableRipple>
        );
    };

    onPress(item) {
        this.state.users.map(user=>{
            if (user.uid == item.uid){
                user.unreadCount = 0;
                this.setState({users:[...this.state.users]});
            }
        });
        NavigationService.navigate('Chat', {
            uid: item.uid,
            username: item.name,
            status: item.status,
        });
    }
}

class Groups extends Component {

    constructor() {
        super()
        this.state = {
            dataItem: '?',
            groups: [],
        }
        this.onPress = this.onPress.bind(this)
        this.fetchGroups()
    }

    logout(){
        CometChat.logout().then(() =>{
            console.log("Logout completed successfully");
            NavigationService.navigate('Login');
        },error=>{
          console.log("Logout failed with exception:",{error});
        })
     }

     blockedUser(){
        console.log("Blocked Users");
        NavigationService.navigate('Block');
    }

    render() {
        return (

            <View style={styles.activityBackground}>
                <View style={{ flexDirection: 'row', flexWrap: 'nowrap', justifyContent:'space-between', alignItems: 'center' }}>
                <Text style={styles.activityTitle}> Groups </Text>
                    <Menu>
                        <MenuTrigger style={{ marginEnd: 20}} >
                            <Image source={require('./assets/images/menu_icon.png')} />
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={this.logout} text='Logout' />
                            <MenuOption onSelect={this.blockedUser} text='Block' />
                        </MenuOptions>
                    </Menu>
                </View>
                <View style={styles.inputsContainer}>
                    <FlatList
                        data={this.state.groups}
                        keyExtractor={item => item.guid}
                        renderItem={this.renderItem}/>
                </View>
            </View>
        )
    }

    fetchGroups() {
        var limit = 30;

        var groupsRequest = new CometChat.GroupsRequestBuilder().setLimit(limit).build();

        groupsRequest.fetchNext().then(
            groupList => {
                console.log("Groups list fetched successfully", groupList);
                // this.setState({
                //     groups: groupList,
                // });
                if(groupList.length >0){
                    CometChat.getUnreadMessageCountForAllGroups().then(array=>{
                        var unread = Object.keys(array);
                        if(unread.length > 0){
                            unread.map(guid =>{
                                var index = groupList.findIndex(group=> group.guid == guid);
                                if(index != -1){
                                    groupList[index].unreadCount = array[guid];
                                }
                            });
                        } 
                        this.setState({
                            groups: groupList,
                        });
                    })
                }
                this.state.groups.map(group=>{
                    CometChat.getUnreadMessageCountForGroup(group.guid).then( array => {
                        console.log('array',array);
                        if(array[group.guid] == undefined || array[group.guid] == 'undefined'){
                            array[group.guid] = 0;
                        }
                        group.unreadCount = array[group.guid];
                        this.setState({ groups:[...this.state.groups]});
                    }, error =>{
                        console.log("Error", error);
                    });
                    
                });
                console.log("Groups list 1", this.state.groups);
            },
            error => {
                console.log("Groups list fetching failed with error", error);
            }
        );
    }

    renderItem = ({item}) => {
        if (item.avatar == null) {
            item.avatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"  // default avatar
        }

        if(item.unreadCount > 0){
            showUnreadCount = true;
        }else{
            showUnreadCount = false;
        }

        return (

            <TouchableRipple
                onPress={() => {
                    this.onPress(item)
                }}
                rippleColor="rgba(0, 0, 0, .20)">
                <View style={styles.item}>

                    <View style={styles.roundedbackgroud}>
                        <FontAwesome style={[{alignSelf: 'center'}]} name='group' size={20} color="#FFF"/>
                    </View>

                    <Text style={styles.userName}>
                        {item.name}
                    </Text>

                    { showUnreadCount ? <View style={{ width: 25, height: 25, backgroundColor: 'red', alignContent: 'flex-end', marginLeft: '15%', borderRadius: 25/2, justifyContent: 'center', padding: 3 }}><Text style={{ color: 'white', fontSize: 12, textAlign: 'center' }}>{item.unreadCount}</Text></View> : null }

                </View>
            </TouchableRipple>
        );
    };

    onPress(item) {
        this.state.groups.map(group=>{
            if (group.guid == item.guid){
                group.unreadCount = 0;
                this.setState({groups:[...this.state.groups]});
            }
        });
        console.log(this.state.groups);
        console.log('Group id = ' + item.guid);
        console.log('Group name = ' + item.name);
        NavigationService.navigate('Group', {
            guid: item.guid,
            username: item.name,
        });
    }
}