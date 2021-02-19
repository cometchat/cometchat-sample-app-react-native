import React, { createRef } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import theme from '../../../resources/theme';
import CometChatThreadedMessageReplyCount from '../CometChatThreadedMessageReplyCount';
import { CometChatMessageReactions } from '../../Messages/Extensions';
import CometChatReadReceipt from '../CometChatReadReceipt';
import style from './styles';
import { CometChatAvatar } from '../../Shared';
import * as actions from '../../../utils/actions';
import * as enums from '../../../utils/enums';

const CometChatReceiverVideoMessageBubble = (props) => {
  const message = {
    ...props.message,
    messageFrom: enums.MESSAGE_FROM_RECEIVER,
  };
  const viewTheme = { ...theme, ...props.theme };
  const player = createRef();
  let senderAvatar = null;
  if (message.receiverType === enums.TYPE_GROUP) {
    senderAvatar = { uri: message.sender.avatar };
  }
  return (
    <View style={style.container}>
      <View style={style.innerContainer}>
        {props.message.receiverType === enums.TYPE_GROUP ? (
          <View style={style.avatarStyle}>
            <CometChatAvatar
              cornerRadius={18}
              borderColor={viewTheme.color.secondary}
              borderWidth={0}
              image={senderAvatar}
              name={message.sender.name}
            />
          </View>
        ) : null}
        <View>
          {props.message.receiverType === enums.TYPE_GROUP ? (
            <View style={style.senderNameContainer}>
              <Text>{message.sender.name}</Text>
            </View>
          ) : null}
          <View style={style.messageWrapperStyle}>
            <TouchableWithoutFeedback
              onLongPress={() =>
                props.actionGenerated(actions.OPEN_MESSAGE_ACTIONS, message)
              }>
              <View style={style.messageVideoWrapperStyle}>
                <VideoPlayer
                  source={{
                    uri: message.data.url,
                  }} // Can be a URL or a local file.
                  ref={player} // Store reference
                  style={style.messageVideo}
                  navigator={props.navigator}
                  disableBack
                  disableFullscreen
                  disableVolume
                  paused
                  resizeMode="contain"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={style.containerStyle}>
            <View style={style.messageInfoWrapperStyle}>
              <CometChatReadReceipt {...props} message={message} />
              <CometChatThreadedMessageReplyCount
                {...props}
                message={message}
              />
            </View>
          </View>
          <CometChatMessageReactions
            theme={props.theme}
            {...props}
            message={message}
          />
        </View>
      </View>
    </View>
  );
};
export default CometChatReceiverVideoMessageBubble;
