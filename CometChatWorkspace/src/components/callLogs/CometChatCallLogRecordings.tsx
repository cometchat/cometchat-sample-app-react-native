import { View } from 'react-native'
import React from 'react'
import { CometChatRecordings } from '@cometchat/chat-uikit-react-native';
import { CallLog, CallUser } from '@cometchat/calls-sdk-react-native';

const CallLogRecordings = (props: any) => {

    const initiator = CallUser.getUserFromJson({
        name: 'Iron Man',
        avatar: "https://data-us.cometchat.io/assets/images/avatars/ironman.png",
        uid: 'superhero2',
    });
    const receiver = CallUser.getUserFromJson({
        name: "Kevin",
        avatar:
            "https://data-us.cometchat.io/assets/images/avatars/spiderman.png",
        uid: "UID233",
    });
    const call = CallLog.callLogFromJson({
        initiator,
        receiver,
        participants: [
            {
                name: 'Iron Man',
                avatar: "https://data-us.cometchat.io/assets/images/avatars/ironman.png",
                uid: 'superhero2',
                totalAudioMinutes: 120,
                totalDurationInMinutes: 120,
                totalVideoMinutes: 60,
            },
            {
                uid: "UID233",
                avatar:
                    "https://data-us.cometchat.io/assets/images/avatars/spiderman.png",
                name: "Kevin",
                totalAudioMinutes: 120,
                totalDurationInMinutes: 120,
                totalVideoMinutes: 60,
            },
        ],
        recordings: [
            {
                startTime: 1700822555,
                rid: "Recordings",
                recording_url:
                    "https://recordings-us.cometchat.io/236497dcc2cd529b/2023-12-15/v1.us.236497dcc2cd529b.170264141733632a2e3171d8a5dcb1f82b743fbc2730422263_2023-12-15-11-57-16.mp4",
                endTime: 1700822630,
                duration: 100,
            },
        ],
        totalDurationInMinutes: 0.6833333333333333,
        totalParticipants: 2,
        type: "audio",
        mid: "dcb170b0-99da-4beb-b65a8-86e48c89ef18",
        startedAt: 1697458341,
        endedAt: 1697458382,
        totalAudioMinutes: 0.6833333333333333,
        totalVideoMinutes: 0,
        totalDuration: "00:00:41",
        hasRecording: true,
        initiatedAt: 1697458328,
    });
    return (
        <View style={{ flex: 1 }}>
            <CometChatRecordings
                data={call?.getRecordings()}
                showBackButton={true}
                onBack={props.navigation.goBack}
            />
        </View>
    )
}

export default CallLogRecordings