
import React, { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform, SafeAreaView, StatusBar, Text } from 'react-native';
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { COMETCHAT_CONSTANTS } from './src/CONSTS';
import { CometChatContextProvider, CometChatConversationsWithMessages } from '@cometchat/chat-uikit-react-native';
import { CometChatTheme } from '@cometchat/chat-uikit-react-native';
import { CometChatUIKit } from '@cometchat/chat-uikit-react-native';
import StackNavigator from './src/StackNavigator';
import { UserContextProvider } from './UserContext';
import { CometChatIncomingCall } from '@cometchat/chat-uikit-react-native';
import { CometChatUIEventHandler } from '@cometchat/chat-uikit-react-native';
import { metaInfo } from './src/metaInfo';
var listnerID = "UNIQUE_LISTENER_ID";

const App = () => {

  const getPermissions = () => {
    if (Platform.OS == "android") {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  }

  const [callRecevied, setCallReceived] = useState(false);
  const incomingCall = useRef(null);

  useEffect(() => {
    getPermissions();
    CometChatUIKit.init({
      appId: COMETCHAT_CONSTANTS.APP_ID,
      authKey: COMETCHAT_CONSTANTS.AUTH_KEY,
      region: COMETCHAT_CONSTANTS.REGION,
    })
      .then(() => {
        try{CometChat.setDemoMetaInfo(metaInfo)}catch(err){}
        if (CometChat.setSource) {
          CometChat.setSource('ui-kit', Platform.OS, 'react-native');
        }
      })
      .catch(() => {
        return null;
      });

    CometChat.addCallListener(
      listnerID,
      new CometChat.CallListener({
        onIncomingCallReceived: (call) => {
          incomingCall.current = call;
          setCallReceived(true);
        },
        onOutgoingCallRejected: (call) => {
          incomingCall.current = null;
          setCallReceived(false);
        },
        onIncomingCallCancelled: (call) => {
          incomingCall.current = null;
          setCallReceived(false);
        }
      })
    );

    CometChatUIEventHandler.addCallListener(listnerID, {
      ccCallEnded: () => {
        incomingCall.current = null;
        setCallReceived(false);
      },
    });

    return () => {
      CometChatUIEventHandler.removeCallListener(listnerID);
      CometChat.removeCallListener(listnerID)
    }

  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={"white"} barStyle={"dark-content"} />
      {
        callRecevied &&
        <CometChatIncomingCall
          call={incomingCall.current}
          onDecline={(call) => {
            setCallReceived(false)
          }}
          incomingCallStyle={{
            backgroundColor: 'white',
            titleColor: 'black',
            subtitleColor: 'gray',
            titleFont: {
              fontSize: 20,
              fontWeight: 'bold'
            }
          }}
        />
      }
      <UserContextProvider>
        <CometChatContextProvider theme={new CometChatTheme({})}>
          <StackNavigator />
        </CometChatContextProvider>
      </UserContextProvider>
    </SafeAreaView>
  );
};

export default App;
