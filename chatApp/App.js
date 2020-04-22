import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {LoginScreen} from './src/LoginScreen';
import {HomeScreen} from './src/HomeScreen';
import {ChatScreen} from './src/ChatScreen';
import {VideoPlayer} from './src/VideoPlayer';
import {BlockedUsers} from './src/BlockedUsers';
import {GroupChatScreen} from './src/GroupChatScreen';
import NavigationService from './src/NavigationService';
import {ImageViewer} from './src/ImageViewer';
import {MainCallScreen} from './src/MainCallScreen';
import {CallingScreen} from './src/CallingScreen';

const navigator = createStackNavigator(
  {
    Login: LoginScreen,
    Home: HomeScreen,
    Chat: ChatScreen,
    Group: GroupChatScreen,
    Video: VideoPlayer,
    Block: BlockedUsers,
    Image: ImageViewer,
    MainCallScreen: MainCallScreen,
    CallingScreen: CallingScreen,
  },
  {
    initialRouteName: 'Login',
  },
);

const AppContainer = createAppContainer(navigator);
export default class App extends Component {
  render() {
    console.disableYellowBox = true;
    return (
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}
