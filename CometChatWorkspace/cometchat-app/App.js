import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {Provider} from 'react-redux';
import {store, persistor} from './store/store';
import StackNavigator from './StackNavigator';
import {COMETCHAT_CONSTANTS} from './CONSTS';
import {LogBox} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  LogBox.ignoreAllLogs();
  var appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(COMETCHAT_CONSTANTS.REGION)
    .build();

  CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting).catch(() => {
    return null;
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StackNavigator />
      </PersistGate>
    </Provider>
  );
};

export default App;
