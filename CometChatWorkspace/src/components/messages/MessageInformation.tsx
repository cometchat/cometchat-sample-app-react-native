import React, { useContext } from 'react'
import { ChatConfigurator, CometChatContext, CometChatContextType, CometChatMessageInformation, CometChatMessageTemplate } from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';

const MessageInformation = (props) => {
    const { theme } = useContext<CometChatContextType>(CometChatContext);

    let _sender: CometChat.User = {
        name: 'Kevin',
        uid: 'UID233',
        avatar:
            "https://data-us.cometchat.io/assets/images/avatars/spiderman.png",
        role: "test",
        status: "online",
        statusMessage: "This is now status"
    };

    let _receiver: CometChat.User = {
        name: 'IronMan',
        uid: 'superhero1',
        avatar:
            "https://data-us.cometchat.io/assets/images/avatars/ironman.png",
        role: "test",
        status: "online",
        statusMessage: "This is now status"
    };

    let _message: CometChat.BaseMessage = {
        receiverType: "user",
        receiverUid: "superhero1",
        readAt: 1687112043,
        sentAt: 1687111674,
        deliveredAt: 1687112043,
        type: "text",
        receiver: _receiver,
        sender: _sender,
        category: "text",
        text: "Sorry, I didn't say anything. I was just clearing my throat. How's it going, Spiderman?",
    };

    const messageObject: any = {
        getReceiver: () => {
            return {
                getAvatar: () => "https://data-us.cometchat.io/assets/images/avatars/spiderman.png",
                getBlockedByMe: () => false,
                getDeactivatedAt: () => 0,
                getHasBlockedMe: () => false,
                getLastActiveAt: () => 1686810809,
                getName: () => "Spiderman",
                getRole: () => "default",
                getStatus: () => "online",
                getUid: () => "superhero3",
                getConversationId: () => "superhero1_user_superhero3",
                "uid": "superhero3",
                "name": "Spiderman",
                "role": "default",
                "avatar": "https://data-us.cometchat.io/assets/images/avatars/spiderman.png",
                "status": "online",
                "lastActiveAt": 1686810809,
                "conversationId": "superhero1_user_superhero3"
            }
        },
        getSender: () => {
            return {
                getAvatar: () => "https://data-us.cometchat.io/assets/images/avatars/ironman.png",
                getBlockedByMe: () => false,
                getDeactivatedAt: () => 0,
                getHasBlockedMe: () => false,
                getLastActiveAt: () => 1684838515,
                getName: () => "Iron Man",
                getRole: () => "default",
                getStatus: () => "online",
                getUid: () => "superhero1",
                "uid": "superhero1",
                "name": "Iron Man",
                "role": "default",
                "avatar": "https://data-us.cometchat.io/assets/images/avatars/ironman.png",
                "status": "online",
                "lastActiveAt": 1684838515
            }
        },
        getConversationId: () => "superhero1_user_superhero3",
        getText: () => "Sorry, I didn't say anything. I was just clearing my throat. How's it going, Spiderman?",
        getSentAt: () => 1687111674,
        getReadAt: () => 1687112043,
        getDeliveredAt: () => 1687112043,
        getReceiverType: () => "user",
        getReceiverId: () => "superhero3",
        getId: () => 970,
        getType: () => "text",
        getCategory: () => "message",
        getDeletedBy: () => null,
        getMetadata: () => ({
            "@injected": {
                "extensions": {
                    "link-preview": {
                        "links": []
                    },
                    "human-moderation": {
                        "success": true
                    }
                }
            }
        }),
        "id": "970",
        "conversationId": "superhero1_user_superhero3",
        "sender": "superhero1",
        "receiverType": "user",
        "receiver": "superhero3",
        "category": "message",
        "type": "text",
        "data": {
            "text": "Sorry, I didn't say anything. I was just clearing my throat. How's it going, Spiderman?",
            "entities": {
                "sender": {
                    "entity": {
                        "uid": "superhero1",
                        "name": "Iron Man",
                        "role": "default",
                        "avatar": "https://data-us.cometchat.io/assets/images/avatars/ironman.png",
                        "status": "available",
                        "lastActiveAt": 1684838515
                    },
                    "entityType": "user"
                },
                "receiver": {
                    "entity": {
                        "uid": "superhero3",
                        "name": "Spiderman",
                        "role": "default",
                        "avatar": "https://data-us.cometchat.io/assets/images/avatars/spiderman.png",
                        "status": "offline",
                        "lastActiveAt": 1686810809,
                        "conversationId": "superhero1_user_superhero3"
                    },
                    "entityType": "user"
                }
            },
            "metadata": {
                "@injected": {
                    "extensions": {
                        "link-preview": {
                            "links": []
                        },
                        "human-moderation": {
                            "success": true
                        }
                    }
                }
            },
            "resource": "REACT_NATIVE-3_0_12-e5b70dc3-c8cf-482b-b765-4bc793f2be87-1687100812709"
        },
        "sentAt": 1687111674,
        "deliveredAt": 1687112043,
        "readAt": 1687112043,
        "updatedAt": 1687112043,
        ..._message
    };

    let templates: CometChatMessageTemplate = ChatConfigurator.dataSource.getTextMessageTemplate(theme);
    console.log("templates", templates)

    return (
        <CometChatMessageInformation
            message={messageObject}
            template={templates}
            onBack={props.navigation.goBack}
        />
    )
}

export default MessageInformation