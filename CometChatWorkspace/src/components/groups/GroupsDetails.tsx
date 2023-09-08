import React, { useContext } from 'react'
import { CometChatDetails } from '@cometchat/chat-uikit-react-native'
import { UserContext } from '../../../UserContext'

export const GroupDetails = (props) => {

    let group: CometChat.Group = {
        "guid": "supergroup",
        "name": "Comic Heros' Hangout",
        "icon": "https://data-us.cometchat.io/assets/images/avatars/supergroup.png",
        "type": "public",
        "scope": "admin",
        "membersCount": 8,
        "joinedAt": 1684307929,
        "conversationId": "group_supergroup",
        "hasJoined": true,
        "createdAt": 1684307929,
        "owner": "superhero1",
        "updatedAt": 1692784318,
        "onlineMembersCount": 30,
        getName: () => "test group",
        getIcon: () => "https://data-us.cometchat.io/assets/images/avatars/supergroup.png",
        getType: () => "public",
    }
    
    return (
        <CometChatDetails group={group} onBack={() => props.navigation.goBack()} />
    )
}
