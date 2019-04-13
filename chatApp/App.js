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
import { ChatScreen } from './src/ChatScreen';
import { GroupChatScreen } from './src/GroupChatScreen';
import NavigationService from './src/NavigationService'

const navigator = createStackNavigator(
  {
    Login: LoginScreen,
    Home: HomeScreen,
    Chat: ChatScreen,
    Group:GroupChatScreen,
  },
  {
    initialRouteName: 'Login'
  }
);

const AppContainer = createAppContainer(navigator)
export default class App extends Component {
  render() {
    return (
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}
