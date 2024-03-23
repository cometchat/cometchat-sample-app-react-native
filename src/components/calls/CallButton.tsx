import React, { useContext } from 'react'
import { View, Text } from 'react-native'
import { AppStyle } from '../../AppStyle'
import { CometChatCallButtons } from '@cometchat/chat-uikit-react-native'
import { UserContext } from "../../../UserContext";

export const CallButton = () => {
    const { user } = useContext(UserContext);
    return (
        <View style={[AppStyle.container, AppStyle.center]}>
            <CometChatCallButtons user={user} />
        </View>
    )
}
