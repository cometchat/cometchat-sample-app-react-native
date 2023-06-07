import React, { useContext } from 'react'
import { View } from 'react-native'
import { UserContext } from '../../../UserContext';
import { AppStyle } from '../../AppStyle';
import { CometChatMessageHeader } from '@cometchat/chat-uikit-react-native';

export const MessageHeader = (props) => {

  const { user } = useContext(UserContext);

  return (
    <View style={[AppStyle.container, {justifyContent: "center"}]}>
      <CometChatMessageHeader
        user={user}
        onBack={() => props.navigation.goBack()}
      />
    </View>
  )
}