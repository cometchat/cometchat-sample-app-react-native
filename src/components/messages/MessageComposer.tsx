import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { CometChatMessageComposer } from '@cometchat/chat-uikit-react-native'
import { UserContext } from '../../../UserContext'
import { AppStyle } from '../../AppStyle'

export const MessageComposer = () => {

  const { user } = useContext(UserContext);

  return (
    <View style={[AppStyle.container, {justifyContent: "center"}]}>
      <CometChatMessageComposer
        user={user}
      />
    </View>
  )
}