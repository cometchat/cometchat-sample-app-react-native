import { View} from 'react-native'
import React from 'react'
import { CometChatFileBubble } from "@cometchat/chat-uikit-react-native";

export const FileBubble = () => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <CometChatFileBubble
        fileUrl='https://data-us.cometchat.io/2379614bd4db65dd/media/1682517934_233027292_069741a92a2f641eb428ba6d12ccb9af.pdf'
        title='Sample'
        subtitle='pdf'
        style={{
          width: "65%"
        }}
      />
    </View>
  )
}