import { View, Text } from 'react-native'
import React from 'react'
import { CometChatAudioBubble } from '@cometchat/chat-uikit-react-native'

export const AudioBubble = () => {
  return <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
    <CometChatAudioBubble
      audioUrl='https://data-us.cometchat.io/2379614bd4db65dd/media/1682517916_1406731591_130612180fb2e657699814eb52817574.mp3'
      title='SoundHelix'
      subtitle='Song'
      style={{
          width: "65%"
      }}
    />
  </View>
}