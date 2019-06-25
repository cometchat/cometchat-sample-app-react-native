/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { createStackNavigator,createAppContainer } from 'react-navigation'
import {LoginScreen} from './src/LoginScreen';
import {HomeScreen} from './src/HomeScreen';
import {ChatScreen} from './src/ChatScreen';
import {VideoPlayer} from './src/VideoPlayer';
import {BlockedUsers} from './src/BlockedUsers';
import { GroupChatScreen } from './src/GroupChatScreen';
import NavigationService from './src/NavigationService';
import { ImageViewer } from './src/ImageViewer';

const navigator = createStackNavigator(
  {
    Login: LoginScreen,
    Home: HomeScreen,
    Chat: ChatScreen,
    Group: GroupChatScreen,
    Video: VideoPlayer,
    Block: BlockedUsers,
    Image: ImageViewer,
  },
  {
    initialRouteName: 'Login'
  }
);

const AppContainer = createAppContainer(navigator)
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
