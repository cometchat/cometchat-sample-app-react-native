import React, { Component } from 'react';
import {View,FlatList,StyleSheet,Image} from 'react-native';
import {CometChat,User, Group} from '@cometchat-pro/chat';
import {users} from './fake_data'
import { TouchableRipple, Text,BottomNavigation } from 'react-native-paper';
import NavigationService from './NavigationService';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3F51B5',
    }
  };

export class HomeScreen extends Component {
    static navigationOptions = {
        title:"Chat App"
    }

    constructor(){
        super()
        this.state = {dataItem:'?',
        index: 0,
        routes: [
            { key: 'single', title: 'Contacts', icon: 'contacts' , color: '#3F51B5' },
            { key: 'groups', title: 'Group', icon: 'group', color: '#009688' },
        ],
        }
        this._renderScene = this._renderScene.bind(this)
      
    }

    renderItem = ({ item }) => {
        if(item.avatar == null){
            item.avatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"  // default avatar
        }

        return (

            <TouchableRipple
                onPress={()=>{
                    this.onPress(item)
                }}
                rippleColor="rgba(0, 0, 0, .20)">
                <View style={styles.item}>
                <Image 
                    style={styles.image}
                    resizeMode={"cover"}
                    source={{ uri: item.avatar}}
                />

                    <Text style={styles.userName}>
                        {item.name}
                    </Text>
                    
                </View>
            </TouchableRipple>
        );
    };

    render(){
        return(
            <View style={styles.container}>
                <BottomNavigation theme={theme}
                   navigationState={this.state}
                   onIndexChange={this._handleIndexChange}
                   renderScene={this._renderScene}
                />    
            </View>  
        );
    }

    _handleIndexChange = index => this.setState({ index });

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
      padding: 10,
      fontSize: 18,
      height: 60,
      flexDirection: 'row',
      justifyContent: 'flex-start',
        alignItems: 'center',
    },
    image: {
        height: 40,
        width: 40,
        borderRadius: 20,
      },
      userName:{
        padding: 10,
      },
      roundedbackgroud:{
        height:40,
        width:40,
        margin:5,
      justifyContent: 'center',
      borderRadius: 30 ,
      backgroundColor : "#3f51b5"
    }
  })


   class Contacts extends Component{

    constructor(){
        super()
        this.state = {dataItem:'?',
            users: [],
        }
        this.onPress = this.onPress.bind(this)
        this.fetchUser()
    }
    
    render(){
          return (
            <FlatList
            data={this.state.users}
            keyExtractor={item => item.uid}
            renderItem={this.renderItem} />
          )
      }

      fetchUser(){
        console.log('Fetch user called.....')
        var limit = 30;
        var usersRequest = new CometChat.UsersRequestBuilder().setLimit(limit).build();

        usersRequest.fetchNext().then(
          userList => {
            console.log("User list received:", userList);
            this.setState({
                users : userList,
            });
          },
          error => {
            console.log("User list fetching failed with error:", error);
          }
        );
    }

      renderItem = ({ item }) => {
        if(item.avatar == null){
            item.avatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"  // default avatar
        }

        return (

            <TouchableRipple
                onPress={()=>{
                    this.onPress(item)
                }}
                rippleColor="rgba(0, 0, 0, .20)">
                <View style={styles.item}>
                <Image 
                    style={styles.image}
                    resizeMode={"cover"}
                    source={{ uri: item.avatar}}
                />

                    <Text style={styles.userName}>
                        {item.name}
                    </Text>
                    
                </View>
            </TouchableRipple>
        );
    };

    onPress(item){
          NavigationService.navigate('Chat', {
            uid: item.uid,
            username: item.name,
          });
    }
  }

   class Groups extends Component{

    constructor(){
        super()
        this.state = {dataItem:'?',
            groups: [],
        }
        this.onPress = this.onPress.bind(this)
        this.fetchGroups()
    }
    
    render(){
          return (
            <FlatList
            data={this.state.groups}
            keyExtractor={item => item.uid}
            renderItem={this.renderItem} />
          )
      }

      fetchGroups(){
        var limit = 30;

        var groupsRequest = new CometChat.GroupsRequestBuilder().setLimit(limit).build();

        groupsRequest.fetchNext().then(
          groupList => {
            console.log("Groups list fetched successfully", groupList);
            this.setState({
                groups : groupList,
            });
          },
          error => {
            console.log("Groups list fetching failed with error", error);
          }
        );
    }

      renderItem = ({ item }) => {
        if(item.avatar == null){
            item.avatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"  // default avatar
        }

        return (

            <TouchableRipple
                onPress={()=>{
                    this.onPress(item)
                }}
                rippleColor="rgba(0, 0, 0, .20)">
                <View style={styles.item}>

                <View style={styles.roundedbackgroud}>
                    <FontAwesome style={[{alignSelf:'center'}]} name='group' size={20} color="#FFF"/>
                </View>
                
                    <Text style={styles.userName}>
                        {item.name}
                    </Text>
                    
                </View>
            </TouchableRipple>
        );
    };

    onPress(item){
        console.log('Group id = '+item.guid)
        console.log('Group name = '+item.name)
          NavigationService.navigate('Group', {
            guid: item.guid,
            username: item.name,
          });
    }
  }