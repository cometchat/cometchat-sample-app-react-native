import React, {Component} from 'react';
import {View, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { TouchableRipple, Text } from 'react-native-paper';

const styles = StyleSheet.create({
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
    inputsContainer: {
        marginTop: 10,
        marginStart: 10,
        marginEnd: 10,
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#FFF'
    }
})

export class BlockedUsers extends Component {
    
    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: (
                <View>
                    <Text style={{fontSize: 20, fontWeight: 'bold', color: '#FFF'}}>Blocked Users</Text>
                </View>
            ),
            headerStyle: {
                backgroundColor: '#3f51b5',
            },
            headerTintColor: '#fff',
            headerLeft: <TouchableOpacity onPress={()=>{navigation.push('Home')}}><Image style={{marginLeft: 10, width:24, height: 24}} source={require('./assets/images/back_icon.png')}/></TouchableOpacity>
        };
    };

    showActionSheet = (item) => {
        this.setState({unblock: item});
        this.ActionSheet.show();
    }

    constructor(props){
        super(props);
        this.state = {
            blockedUsers: [],
            unblock: [],
        }
        this.unBlockUser = this.unBlockUser.bind(this);
    }

    componentDidMount(){
        this.getBlockedUsers();
    }

    unBlockUser(){
        console.log("Block User", this.state.unblock.uid);
        if(this.state.unblock != ''){
            let usersList = [this.state.unblock.uid];
            CometChat.unblockUsers(usersList).then(list => {
                console.log("users list unblocked", { list });
                this.setState({unblock: ''});
                this.getBlockedUsers(); 
            }, error => {
                console.log("Blocking user fails with error", error);
            });
        }
    }

    getBlockedUsers(){
        var limit = 30;
        var blockedUsersRequest = new CometChat.BlockedUsersRequestBuilder().setLimit(limit).build();
        blockedUsersRequest.fetchNext().then(
            userList => {        
                console.log("Blocked user list received:", userList);   
                this.setState({blockedUsers: userList});     
            },
            error => {
                console.log("Blocked user list fetching failed with error:", error);
            }
        );
    }
    

    render(){
        return(
            <View style={{flex: 1, backgroundColor: '#3f51b5'}}>
                <View style={styles.inputsContainer}>
                    <FlatList
                        data={this.state.blockedUsers}
                        keyExtractor={item => item.uid}
                        renderItem={this.renderItem}/>
                </View>
                <ActionSheet
                    title={'Actions'}
                    ref={o => this.ActionSheet = o}
                    options={['Unblock', 'Cancel']}
                    cancelButtonIndex={1}
                    onPress={(index) => { if(index == 0){this.unBlockUser();} }}
                />
            </View>
        )
    }

    renderItem = ({item}) => {
        console.log("Render item called "+JSON.stringify(item))

        if (item.avatar == null) {
            item.avatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"  // default avatar
        }

        return (

            <TouchableRipple
                onPress={() => {
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
                        </View>
                    </View>
                </View>
            </TouchableRipple>
        );
    };

}