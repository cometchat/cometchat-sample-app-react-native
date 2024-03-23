import React from 'react'
import { Text, View } from 'react-native'
import { CometChatTextBubble } from "@cometchat/chat-uikit-react-native";

export const TextBubble = () => {
  return <View style={{ flex: 1, justifyContent: "center" }}>
    <CometChatTextBubble
      text={"Can I customize UI"}
      style={{
        width: "65%",
        height: 100,
        backgroundColor: "rgba(20, 20, 20, 0.04)",
        borderRadius: 18,
      }}
    />

    <View style={{ alignSelf: "flex-end" }}>
      <CometChatTextBubble
        text={"Yes.\n\nYou can refer to our documentation\n\n https://www.cometchat.com/docs/react-native-chat-ui-kit/customize-ui-kit"}
        style={{
          width: "65%",
          backgroundColor: "rgb(51, 155, 255)",
          borderRadius: 18,
        }}
      />
    </View>
  </View>
}
