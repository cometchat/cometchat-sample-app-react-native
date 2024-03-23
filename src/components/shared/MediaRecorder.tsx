import { View, Text } from 'react-native'
import React from 'react'
import { CometChatBottomSheet, CometChatMediaRecorder } from '@cometchat/chat-uikit-react-native'

const MediaRecorder = (props) => {

    return (
        <View style={{ flex: 1, alignItems: "flex-end" }}>
            <CometChatBottomSheet
                // ref={sheetRef}
                onClose={props.navigation.goBack}
            // style={cometChatBottomSheetStyle}
            >
                <CometChatMediaRecorder
                    onClose={props.navigation.goBack}
                    onSend={props.navigation.goBack}
                />
            </CometChatBottomSheet>
        </View>
    )
}

export default MediaRecorder