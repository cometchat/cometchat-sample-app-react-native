import React, {Component} from 'react';
import {View, FlatList, StyleSheet, Image} from 'react-native';
import {CometChat, User, Group} from '@cometchat-pro/chat';
import {users} from './fake_data'
import {TouchableRipple, Text, BottomNavigation} from 'react-native-paper';
import NavigationService from './NavigationService';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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

    constructor() {
        super()
        this.state = {
            dataItem: '?',
            index: 0,
            routes: [
                {key: 'single', title: 'Contacts', icon: 'contacts', color: '#3F51B5'},
                {key: 'groups', title: 'Group', icon: 'group', color: '#009688'},
            ],
        }
        this._renderScene = this._renderScene.bind(this)

    }

    renderItem = ({item}) => {
        if (item.avatar == null) {
            item.avatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"  // default avatar
        }

        return (

            <TouchableRipple
                onPress={() => {
                    this.onPress(item)
                }}
                rippleColor="rgba(0, 0, 0, .20)">
                <View style={styles.item}>
                    <Image
                        style={styles.image}
                        resizeMode={"cover"}
                        source={{uri: item.avatar}}
                    />
                    <View>
                        <Text style={styles.userName}>
                            {item.name}
                        </Text>

                        <Text>
                            OnLine
                        </Text>
                    </View>
                </View>
            </TouchableRipple>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <BottomNavigation theme={theme}
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

    constructor() {
        super()
        this.state = {
            dataItem: '?',
            users: [],
        }
        this.onPress = this.onPress.bind(this)
        this.fetchUser()
        this.addUserListner()
    }

     componentWillUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void {
        console.log("Next state"+JSON.stringify(nextState))
     }

    render() {
        console.log("helloworld!")
        return (

            <View style={styles.activityBackground}>

                <Text style={styles.activityTitle}> Contacts </Text>

                <View style={styles.inputsContainer}>
                    <FlatList
                        data={this.state.users}
                        keyExtractor={item => item.uid}
                        renderItem={this.renderItem}/>
                </View>
            </View>

        )
    }

    fetchUser() {
        console.log('Fetch user called.....')
        var limit = 30;
        var usersRequest = new CometChat.UsersRequestBuilder().setLimit(limit).build();

        usersRequest.fetchNext().then(
            userList => {
                console.log("User list received:", userList);
                this.setState({
                    users: userList,
                });
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

        let isOnline;

        if (item.avatar == null) {
            item.avatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"  // default avatar
        }
        console.log("UserName = "+item.name +"  Status = "+item.status)
        if(item.status === 'online'){
            isOnline = true;
        }else{
            isOnline = false;
        }


        return (

            <TouchableRipple
                onPress={() => {
                    this.onPress(item)
                }}
                rippleColor="rgba(0, 0, 0, .20)">
                <View style={styles.item}>
                    <Image
                        style={styles.image}
                        resizeMode={"cover"}
                        source={{uri: item.avatar}}
                    />
                    <View >
                        <Text style={styles.userName}>
                            {item.name}
                        </Text>

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

    render() {
        return (

            <View style={styles.activityBackground}>

                <Text style={styles.activityTitle}> Groups </Text>

                <View style={styles.inputsContainer}>
                    <FlatList
                        data={this.state.groups}
                        keyExtractor={item => item.uid}
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
                this.setState({
                    groups: groupList,
                });
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

                </View>
            </TouchableRipple>
        );
    };

    onPress(item) {
        console.log('Group id = ' + item.guid)
        console.log('Group name = ' + item.name)
        NavigationService.navigate('Group', {
            guid: item.guid,
            username: item.name,
        });
    }
}