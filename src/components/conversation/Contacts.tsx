import { View, Text } from 'react-native'
import React from 'react'
import { CometChatContacts } from '@cometchat/chat-uikit-react-native'

const Contacts = (props) => {
  return (
    <CometChatContacts onClose={props.navigation.goBack} onSubmitIconClick={props.navigation.goBack} />
  )
}

export default Contacts