/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import {
  View,
  SafeAreaView,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { CometChat } from '@cometchat-pro/react-native-chat';
import _ from 'lodash';
import { CometChatUserDetails } from '../../Users';
import {
  CometChatLiveReactions,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
  CometChatMessageActions,
  CometChatMessageThread,
} from '../index';
import { CometChatGroupDetails } from '../../Groups';

import theme from '../../../resources/theme';
import { CometChatManager } from '../../../utils/controller';
import * as enums from '../../../utils/enums';
import * as actions from '../../../utils/actions';
import { checkMessageForExtensionsData, logger } from '../../../utils/common';

import BottomSheet from 'reanimated-bottom-sheet';
import style from './styles';

class CometChatMessages extends React.PureComponent {
  loggedInUser = null;

  constructor(props) {
    super(props);
    const { route } = props;

    this.state = {
      messageList: [],
      scrollToBottom: true,
      messageToBeEdited: '',
      replyPreview: null,
      tab: 'conversations',
      item: route.params.item,
      liveReaction: false,
      messageToReact: null,
      threadMessageView: false,
      threadMessageType: null,
      threadMessageItem: {},
      threadMessageParent: {},
      userDetailVisible: false,
      groupDetailVisible: false,
      user: route.params.type === enums.TYPE_USER ? route.params.item : null,
    };

    this.composerRef = React.createRef();
    this.sheetRef = React.createRef(null); //ref here

    this.reactionName = props.reaction || 'heart';
    this.theme = { ...theme, ...route.params.theme };
  }

  componentDidMount() {
    new CometChatManager()
      .getLoggedInUser()
      .then((user) => {
        this.loggedInUser = user;
      })
      .catch((error) => {
        logger('[CometChatMessages] getLoggedInUser error', error);
      });
  }

  componentDidUpdate(prevProps, prevState) {
    try {
      const { route: prevRoute } = prevProps;
      const { route } = this.props;
      if (!prevState.threadMessageView && this.state.threadMessageView) {
        this.sheetRef.current.snapTo(0);
      }
      if (
        route.params.type === enums.TYPE_USER &&
        prevRoute.params.item.uid !== route.params.item.uid
      ) {
        this.setState({
          messageList: [],
          scrollToBottom: true,
          messageToBeEdited: '',
        });
      } else if (
        route.params.type === enums.TYPE_GROUP &&
        prevRoute.params.item.guid !== route.params.item.guid
      ) {
        this.setState({
          messageList: [],
          scrollToBottom: true,
          messageToBeEdited: '',
        });
      } else if (prevRoute.params.type !== route.params.type) {
        this.setState({
          messageList: [],
          scrollToBottom: true,
          messageToBeEdited: '',
        });
      } else if (
        prevState.composedThreadMessage !== this.state.composedThreadMessage
      ) {
        this.updateReplyCount(this.state.composedThreadMessage);
      } else if (prevRoute.params.callMessage !== route.params.callMessage) {
        if (prevRoute.params.callMessage.id !== route.params.callMessage.id) {
          this.actionHandler(actions.CALL_UPDATED, route.params.callMessage);
        }
      } else if (prevRoute.params.groupMessage !== route.params.groupMessage) {
        this.appendMessage(route.params.groupMessage);
      }
    } catch (error) {
      logger(error);
    }
  }

  /**
   * When logged in user deletes a group, the user navigates to the back screen and groupList is updated. 
   * @param group: group object
  */
  deleteGroup = (group) => {
    try {
      this.setState(
        {
          groupDetailVisible: false,
          groupToDelete: group,
          item: {},
          type: enums.TYPE_GROUP,
          viewDetailScreen: false,
        },
        () => {
          this.props.route.params.actionGenerated(actions.GROUP_DELETED, group);
          this.props.navigation.goBack();
        },
      );
    } catch (error) {
      logger(error);
    }
  };
  
  /**
   * handler implemeted when user leaves the group.
   * @param 
  */
  leaveGroup = (group) => {
    try {
      this.setState(
        {
          groupDetailVisible: false,
          groupToLeave: group,
          item: {},
          type: enums.TYPE_GROUP,
          viewDetailScreen: false,
        },
        () => {
          this.props.navigation.goBack();
        },
      );
    } catch (error) {
      logger(error);
    }
  };

  updateMembersCount = (item, count) => {
    try {
      const { route } = this.props;
      const group = { ...this.state.item, membersCount: count };
      this.setState({ item: group, groupToUpdate: group });
      route.params.actionGenerated(actions.MEMBERS_UPDATED, item, count);
    } catch (error) {
      logger(error);
    }
  };
 
  /**
   * handler for various actions and updations
   * @param action: action name
   * @param messages: messages object
   * @param key: key object
   * @param group: group object
   * @param options: options object
  */

  actionHandler = (action, messages, key, group, options) => {
    try {
      const { route } = this.props;

      switch (action) {
        case actions.CUSTOM_MESSAGE_RECEIVED:
        case actions.MESSAGE_RECEIVED:
          {
            const message = messages[0];
            if (message.parentMessageId) {
              this.updateReplyCount(messages);
            } else {
              this.smartReplyPreview(messages);
              this.appendMessage(messages);
            }
          }
          break;
        case actions.GROUP_DELETED:
          this.deleteGroup(messages);
          break;
        case actions.LEFT_GROUP:
          this.leaveGroup(messages);
          break;
        case actions.MEMBERS_UPDATED:
          this.updateMembersCount(messages, key);
          break;
        case actions.MESSAGE_READ:
          route.params.actionGenerated(action, messages);
          break;
        case actions.MESSAGE_COMPOSED: {
          this.appendMessage(messages);
          route.params.actionGenerated(actions.MESSAGE_COMPOSED, messages);
          break;
        }
        case actions.VIEW_MESSAGE_THREAD:
          this.setState({ messageToReact: null }, () => {
            this.viewMessageThread(messages);
          });
          break;
        case actions.CLOSE_THREAD_CLICKED:
          this.closeThreadMessages();
          break;
        case actions.MESSAGE_UPDATED: {
          this.updateMessages(messages);
          break;
        }
        case actions.MESSAGE_FETCHED:
          this.prependMessages(messages);
          break;
        case actions.MESSAGE_FETCHED_AGAIN:
          this.prependMessagesAndScrollBottom(messages);
          break;
        case actions.MESSAGE_DELETED:
          this.removeMessages(messages);
          break;
        case actions.THREAD_MESSAGE_DELETED:
          route.params.actionGenerated(actions.MESSAGE_DELETED, messages);
          break;
        case actions.DELETE_MESSAGE:
          this.setState({ messageToReact: null });
          this.deleteMessage(messages);
          break;
        case actions.EDIT_MESSAGE:
          this.setState({ messageToReact: null });
          this.editMessage(messages);
          break;
        case actions.MESSAGE_EDITED:
          this.messageEdited(messages);
          break;
        case actions.CLEAR_EDIT_PREVIEW:
          this.clearEditPreview();
          break;
        case actions.GROUP_UPDATED:
          this.groupUpdated(messages, key, group, options);
          break;
        case actions.CALL_UPDATED:
          this.callUpdated(messages);
          break;
        case actions.POLL_ANSWERED:
          this.updatePollMessage(messages);
          break;
        case actions.POLL_CREATED:
          this.appendPollMessage(messages);
          break;
        case actions.VIEW_ACTUAL_IMAGE:
          route.params.actionGenerated(actions.VIEW_ACTUAL_IMAGE, messages);
          break;
        case actions.AUDIO_CALL:
        case actions.VIDEO_CALL:
        case actions.MENU_CLICKED:
          route.params.actionGenerated(action);
          break;
        case actions.SEND_REACTION:
          this.toggleReaction(true);
          break;
        case actions.SHOW_REACTION:
          this.showReaction(messages);
          break;
        case actions.STOP_REACTION:
          this.toggleReaction(false);
          break;
        case actions.REACT_TO_MESSAGE:
          this.reactToMessage(messages);
          break;
        case actions.GO_BACK:
          this.props.navigation.goBack();
          break;
        case actions.CLOSE_DETAIL:
          this.setState({
            userDetailVisible: false,
            groupDetailVisible: false,
          });
          break;
        case actions.VIEW_DETAIL:
          if (route.params.type === enums.TYPE_USER) {
            this.setState({ userDetailVisible: true });
          } else {
            this.setState({ groupDetailVisible: true });
          }
          break;
        case actions.BLOCK_USER:
          this.blockUser();
          break;
        case actions.UNBLOCK_USER:
          this.unblockUser();
          break;
        case actions.CLOSE_MESSAGE_ACTIONS:
          this.setState({ messageToReact: null });
          break;
        case actions.OPEN_MESSAGE_ACTIONS:
          this.setState({ messageToReact: messages });
          break;
        case actions.UPDATE_THREAD_MESSAGE:
          this.updateThreadMessage(messages[0], key);
          break;
        case actions.THREAD_MESSAGE_COMPOSED:
          this.onThreadMessageComposed(messages);
          route.params.actionGenerated(actions.THREAD_MESSAGE_COMPOSED, messages);
          break;
        case actions.MEMBER_SCOPE_CHANGED:
          this.memberScopeChanged(messages);
          break;
        case actions.MEMBERS_REMOVED:
          this.membersRemoved(messages);
          break;
        case actions.MEMBERS_ADDED:
          this.membersAdded(messages);
          break;
        case actions.MEMBER_BANNED:
          this.memberBanned(messages);
          break;
        case actions.MEMBER_UNBANNED:
          this.memberUnbanned(messages);
          break;
        default:
          break;
      }
    } catch (error) {
      logger(error);
    }
  };
  
  /**
   * handler implemented when members are unbanned
   * @param memebers: object members
  */

  memberUnbanned = (members) => {
    try {
      const messageList = [...this.state.messageList];
      let filteredMembers = _.uniqBy(members, 'id');
      filteredMembers.forEach((eachMember) => {
        const message = `${this.loggedInUser.name} unbanned ${eachMember.name}`;
        const sentAt = (new Date() / 1000) | 0;
        const messageObj = {
          category: 'action',
          message: message,
          type: enums.ACTION_TYPE_GROUPMEMBER,
          sentAt: sentAt,
        };
        messageList.push(messageObj);
      });

      this.setState({ messageList: messageList });
    } catch (error) {
      logger(error);
    }
  };
 
  /**
   * hander implemented when members are added by a user
   * @param members: object members
  */
  membersAdded = (members) => {
    try {
      const messageList = [...this.state.messageList];
      members.forEach((eachMember) => {
        const message = `${this.loggedInUser.name} added ${eachMember.name}`;
        const sentAt = (new Date() / 1000) | 0;
        const messageObj = {
          category: 'action',
          message,
          type: enums.ACTION_TYPE_GROUPMEMBER,
          sentAt,
        };
        messageList.push(messageObj);
      });

      this.setState({ messageList: messageList });
    } catch (error) {
      logger(error);
    }
  };
 
  /**
   * handlers implemented when members are removed by the user.
   * @param members: object members
  */
  membersRemoved = (members) => {
    try {
      const messageList = [...this.state.messageList];
      let filteredMembers = _.uniqBy(members, 'id');
      filteredMembers.forEach((eachMember) => {
        const message = `${this.loggedInUser.name} kicked ${eachMember.name}`;
        const sentAt = (new Date() / 1000) | 0;
        const messageObj = {
          category: 'action',
          message: message,
          type: enums.ACTION_TYPE_GROUPMEMBER,
          sentAt: sentAt,
        };
        messageList.push(messageObj);
      });

      this.setState({ messageList: messageList });
    } catch (error) {
      logger(error);
    }
  };

  /**
   * handler when the scope is changed by the user
   * @param members:object members 
  */
  memberScopeChanged = (members) => {
    try {
      const messageList = [...this.state.messageList];
      let filteredMembers = _.uniqBy(members, 'id');
      filteredMembers.forEach((eachMember) => {
        const message = `${this.loggedInUser.name} made ${eachMember.name} ${eachMember.scope}`;
        const sentAt = (new Date() / 1000) | 0;
        const messageObj = {
          category: 'action',
          message: message,
          type: enums.ACTION_TYPE_GROUPMEMBER,
          sentAt: sentAt,
        };
        messageList.push(messageObj);
      });

      this.setState({ messageList: messageList });
    } catch (error) {
      logger(error);
    }
  };
 
  /**
   * handler when members are banned 
   * @param members: members object
  */
  memberBanned = (members) => {
    try {
      const messageList = [...this.state.messageList];
      members.forEach((eachMember) => {
        const message = `${this.loggedInUser.name} banned ${eachMember.name}`;
        const sentAt = (new Date() / 1000) | 0;
        const messageObj = {
          category: 'action',
          message,
          type: enums.ACTION_TYPE_GROUPMEMBER,
          sentAt,
        };
        messageList.push(messageObj);
      });

      this.setState({ messageList: messageList });
    } catch (error) {
      logger(error);
    }
  };
  
  /**
   * handler to close thread messages
   * @param 
  */
  closeThreadMessages = () => {
    this.setState({ viewDetailScreen: false, threadMessageView: false });
  };

  /**
   * handler to view thread messages.
   * @param parentMessage: message object
  */
  viewMessageThread = (parentMessage) => {
    try {
      const { route } = this.props;
      const message = { ...parentMessage };
      const threadItem = { ...this.state.item };
      this.setState({
        threadMessageView: true,
        threadMessageParent: message,
        threadMessageItem: threadItem,
        threadMessageType: route.params.type,
        viewDetailScreen: false,
      });
    } catch (error) {
      logger(error);
    }
  };
  
  /**
   * on thread message composed
   * @param composedMessage: object composedMessage 
  */

  onThreadMessageComposed = (composedMessage) => {
    try {
      const { route } = this.props;
      if (route.params.type !== this.state.threadMessageType) {
        return false;
      }

      if (
        (this.state.threadMessageType === enums.TYPE_GROUP &&
          this.state.item.guid !== this.state.threadMessageItem.guid) ||
        (this.state.threadMessageType === enums.TYPE_USER &&
          this.state.item.uid !== this.state.threadMessageItem.uid)
      ) {
        return false;
      }

      const message = { ...composedMessage };
      this.setState({ composedThreadMessage: message });
    } catch (error) {
      logger(error);
    }
  };

  /**
   * handler when a user is blocked. 
   * @param 
  */

  blockUser = () => {
    try {
      const { route } = this.props;
      const usersList = [this.state.item.uid];
      CometChatManager.blockUsers(usersList)
        .then(() => {
          this.setState({ user: { ...this.state.item, blockedByMe: true } });
          route.params.actionGenerated(actions.BLOCK_USER);
        })
        .catch((error) => {
          logger('Blocking user fails with error', error);
        });
    } catch (error) {
      logger(error);
    }
  };

  /**
   * handler for unlocking a user.
   * @param 
  */
  unblockUser = () => {
    try {
      const { route } = this.props;
      const usersList = [this.state.item.uid];
      CometChatManager.unblockUsers(usersList)
        .then(() => {
          this.setState({ user: { ...this.state.item, blockedByMe: false } });
          route.params.actionGenerated(actions.UNBLOCK_USER);
        })
        .catch((error) => {
          logger('unblocking user fails with error', error);
        });
    } catch (error) {
      logger(error);
    }
  };
 
  /**
   * live reaction toggler
   * @param flag: boolean
  */
  toggleReaction = (flag) => {
    this.setState({ liveReaction: flag });
  };
  
  /**
   * show reaction handler
   * @param 
  */
  showReaction = (reaction) => {
    if (!Object.prototype.hasOwnProperty.call(reaction, 'metadata')) {
      return false;
    }

    if (
      !Object.prototype.hasOwnProperty.call(reaction.metadata, 'type') ||
      !Object.prototype.hasOwnProperty.call(reaction.metadata, 'reaction')
    ) {
      return false;
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        enums.LIVE_REACTIONS,
        reaction.metadata.reaction,
      )
    ) {
      return false;
    }

    if (reaction.metadata.type === enums.LIVE_REACTION_KEY) {
      this.reactionName = reaction.metadata.reaction;
      this.setState({ liveReaction: true });
    }
  };
  
  /**
   * if action is delete -> Updates threadMessageParent
   * @param message:message object
   * @param actions: action name
  */

  updateThreadMessage = (message, action) => {
    if (this.state.threadMessageView === false) {
      return false;
    }

    if (action === 'delete') {
      this.setState({
        threadMessageParent: { ...message },
        threadMessageView: false,
      });
    } else {
      this.setState({ threadMessageParent: { ...message } });
    }
  };
  
   /**
   * handler implemented to delete message .
   * @param message: message object
  */

  deleteMessage = (message) => {
    try {
      const { route } = this.props;
      const messageId = message.id;
      CometChat.deleteMessage(messageId)
        .then((deletedMessage) => {
          this.removeMessages([deletedMessage]);

          const messageList = [...this.state.messageList];
          const messageKey = messageList.findIndex((m) => m.id === message.id);

          this.actionHandler(actions.UPDATE_THREAD_MESSAGE, [deletedMessage], 'delete');
          route.params.actionGenerated(
            actions.UPDATE_THREAD_MESSAGE,
            [deletedMessage],
            'delete',
          );

          if (messageList.length - messageKey === 1 && !message.replyCount) {
            route.params.actionGenerated(actions.MESSAGE_DELETED, [deletedMessage]);
          }
        })
        .catch(() => {});
    } catch (error) {
      logger(error);
    }
  };
  
  /**
   * Updates messageToBeEdited with received message.
   * @param message: message object.
  */

  editMessage = (message) => {
    this.setState({ messageToBeEdited: message, replyPreview: null });
  };
 
  /**
   * Updates the messageList via newMessageObject if received message's id exists in messageList. 
   *  Generates action -> UPDATE_THREAD_MESSAGE.  
   * @param message: message object
  */

  messageEdited = (message) => {
    try {
      const { route } = this.props;
      const messageList = [...this.state.messageList];
      const messageKey = messageList.findIndex((m) => m.id === message.id);
      if (messageKey > -1) {
        const messageObj = messageList[messageKey];

        const newMessageObj = { ...messageObj, ...message };

        messageList.splice(messageKey, 1, newMessageObj);
        this.updateMessages(messageList);

        route.params.actionGenerated(
          actions.UPDATE_THREAD_MESSAGE,
          [newMessageObj],
          'edit',
        );

        if (messageList.length - messageKey === 1 && !message.replyCount) {
          route.params.actionGenerated(actions.MESSAGE_EDITED, [newMessageObj]);
        }
      }
    } catch (error) {
      logger(error);
    }
  };
  
  /**
   * handler to update poll message 
   * @param message:message object
  */
  updatePollMessage = (message) => {
    try {
      const messageList = [...this.state.messageList];
      const messageId = message.poll.id;
      const messageKey = messageList.findIndex((m) => m.id === messageId);
      if (messageKey > -1) {
        const messageObj = messageList[messageKey];

        const metadataObj = {
          '@injected': { extensions: { polls: message.poll } },
        };

        const newMessageObj = { ...messageObj, metadata: metadataObj };

        messageList.splice(messageKey, 1, newMessageObj);
        this.updateMessages(messageList);
      }
    } catch (error) {
      logger(error);
    }
  };
  
  /**
   * append poll message handler
   * @param messages: object messages
  */
  appendPollMessage = (messages) => {
    this.appendMessage(messages);
  };

  // messages are deleted
  removeMessages = (messages) => {
    try {
      const deletedMessage = messages[0];
      const messageList = [...this.state.messageList];

      const messageKey = messageList.findIndex(
        (message) => message.id === deletedMessage.id,
      );
      if (messageKey > -1) {
        const messageObj = { ...messageList[messageKey] };
        const newMessageObj = { ...messageObj, ...deletedMessage };

        messageList.splice(messageKey, 1, newMessageObj);
        this.setState({ messageList: messageList, scrollToBottom: false });
      }
    } catch (error) {
      logger(error);
    }
  };

  // messages are fetched from backend
  prependMessages = (messages) => {
    const messageList = [...messages, ...this.state.messageList];
    this.setState({ messageList, scrollToBottom: false });
  };

  prependMessagesAndScrollBottom = (messages) => {
    const messageList = [...messages, ...this.state.messageList];
    this.setState({ messageList, scrollToBottom: true });
  };

  // message is received or composed & sent
  appendMessage = (newMessages = []) => {
    try {
      if (
        this.state.messageList &&
        newMessages.length &&
        this.state.messageList.length &&
        this.state.messageList.length &&
        newMessages[newMessages.length - 1].id ===
          this.state.messageList[this.state.messageList.length - 1].id
      ) {
        return;
      }
      let messages = [...this.state.messageList];
      messages = messages.concat(newMessages);
      messages = _.uniqBy(messages, 'id');
      this.setState({ messageList: messages, scrollToBottom: true });
    } catch (error) {
      logger(error);
    }
  };

  // message status is updated
  updateMessages = (messages) => {
    this.setState({ messageList: messages, scrollToBottom: false });
  };
   
  /**
   * Update group based on key 
   * @param message: message object
   * @param key:enums type
   * @param group:group object
   * @param options:options 
  */
  groupUpdated = (message, key, group, options) => {
    try {
      const { route } = this.props;
      this.appendMessage([message]);

      switch (key) {
        case enums.GROUP_MEMBER_BANNED:
        case enums.GROUP_MEMBER_KICKED: {
          if (options.user.uid === this.loggedInUser.uid) {
            this.setState({
              item: {},
              type: enums.TYPE_GROUP,
              viewDetailScreen: false,
            });
          }
          break;
        }
        case enums.GROUP_MEMBER_SCOPE_CHANGED: {
          if (options.user.uid === this.loggedInUser.uid) {
            const newObj = { ...this.state.item, scope: options.scope };
            this.setState({
              item: newObj,
              type: enums.TYPE_GROUP,
              viewDetailScreen: false,
            });
          }
          break;
        }
        default:
          break;
      }

      route.params.actionGenerated(
        actions.GROUP_UPDATED,
        message,
        key,
        group,
        options,
      );
    } catch (error) {
      logger(error);
    }
  };

  callUpdated = (message) => {
    this.appendMessage([message]);
  };

  updateReplyCount = (messages) => {
    try {
      const receivedMessage = messages[0];

      const messageList = [...this.state.messageList];
      const messageKey = messageList.findIndex(
        (m) => m.id === receivedMessage.parentMessageId,
      );
      if (messageKey > -1) {
        const messageObj = messageList[messageKey];
        let replyCount = Object.prototype.hasOwnProperty.call(
          messageObj,
          'replyCount',
        )
          ? messageObj.replyCount
          : 0;
        replyCount += 1;
        const newMessageObj = { ...messageObj, replyCount };

        messageList.splice(messageKey, 1, newMessageObj);
        this.setState({ messageList, scrollToBottom: false });
      }
    } catch (error) {
      logger(error);
    }
  };
  
  /**
   * handler for smart reply via checkMessageForExtensionsData()
   * @param messages: messages object
  */
  smartReplyPreview = (messages) => {
    try {
      const { route } = this.props;

      const message = messages[0];
      if (
        message.sender.uid === route.params.loggedInUser.uid ||
        message.category === enums.CATEGORY_CUSTOM
      ) {
        return false;
      }

      const smartReplyData = checkMessageForExtensionsData(
        message,
        'smart-reply',
      );
      if (
        smartReplyData &&
        Object.prototype.hasOwnProperty.call(smartReplyData, 'error') === false
      ) {
        this.setState({ replyPreview: message });
      } else {
        this.setState({ replyPreview: null });
      }
    } catch (error) {
      logger(error);
    }
  };
  
  /**
   * sets messageToBeEdited to an empty string
   * @param 
  */

  clearEditPreview = () => {
    this.setState({ messageToBeEdited: '' });
  };

  reactToMessage = (message) => {
    this.setState({ messageToReact: message });
  };

  render() {
    const { route } = this.props;
    let messageComposer = (
      <CometChatMessageComposer
        ref={(el) => {
          this.composerRef = el;
        }}
        theme={this.theme}
        item={
          route.params.type === enums.TYPE_USER
            ? this.state.user
            : this.state.item
        }
        type={route.params.type}
        loggedInUser={route.params.loggedInUser}
        messageToBeEdited={this.state.messageToBeEdited}
        replyPreview={this.state.replyPreview}
        reaction={this.reactionName}
        messageToReact={this.state.messageToReact}
        actionGenerated={this.actionHandler}
      />
    );

    let liveReactionView = null;
    if (this.state.liveReaction) {
      liveReactionView = (
        <View style={style.reactionsWrapperStyle}>
          <CometChatLiveReactions
            reactionName={this.reactionName}
            theme={this.theme}
          />
        </View>
      );
    }

    const threadMessageView = (
      <Modal
        transparent
        animated
        animationType="fade"
        visible={this.state.threadMessageView}>
        <View style={style.bottomSheetOuterContainer}>
          <BottomSheet
            ref={this.sheetRef}
            snapPoints={[Dimensions.get('window').height - 80, 0]}
            borderRadius={30}
            initialSnap={0}
            enabledInnerScrolling={true}
            enabledContentTapInteraction={false}
            overdragResistanceFactor={10}
            renderContent={() => {
              return (
                <View style={style.bottomSheetInnerContainer}>
                  <CometChatMessageThread
                    theme={this.theme}
                    tab={this.state.tab}
                    item={this.state.threadMessageItem}
                    type={this.state.threadMessageType}
                    parentMessage={this.state.threadMessageParent}
                    loggedInUser={this.loggedInUser}
                    actionGenerated={this.actionHandler}
                  />
                </View>
              );
            }}
            onCloseEnd={() => {
              this.actionHandler(actions.CLOSE_THREAD_CLICKED);
            }}
          />
        </View>
      </Modal>
    );

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={style.fullFlex}>
        <SafeAreaView style={style.chatWrapperStyle}>
          {this.state.userDetailVisible ? (
            <CometChatUserDetails
              open={this.state.userDetailVisible}
              theme={this.theme}
              item={
                route.params.type === enums.TYPE_USER
                  ? this.state.user
                  : this.state.item
              }
              type={route.params.type}
              actionGenerated={this.actionHandler}
            />
          ) : null}
          {threadMessageView}
          <CometChatGroupDetails
            theme={this.theme}
            open={this.state.groupDetailVisible}
            item={this.state.item}
            type={route.params.type}
            actionGenerated={this.actionHandler}
            loggedInUser={this.loggedInUser}
          />
          <CometChatMessageActions
            open={!!this.state.messageToReact}
            message={this.state.messageToReact}
            actionGenerated={this.actionHandler}
            close={() => {
              this.actionHandler(actions.CLOSE_MESSAGE_ACTIONS);
            }}
          />
          <CometChatMessageHeader
            sidebar={route.params.sidebar}
            theme={this.theme}
            item={
              route.params.type === enums.TYPE_USER
                ? this.state.user
                : this.state.item
            }
            type={route.params.type}
            viewdetail={route.params.viewdetail !== false}
            audioCall={route.params.audioCall !== false}
            videoCall={route.params.videoCall !== false}
            loggedInUser={route.params.loggedInUser}
            actionGenerated={this.actionHandler}
          />
          <CometChatMessageList
            theme={this.theme}
            messages={this.state.messageList}
            item={
              route.params.type === enums.TYPE_USER
                ? this.state.user
                : this.state.item
            }
            type={route.params.type}
            scrollToBottom={this.state.scrollToBottom}
            messageConfig={route.params.messageconfig}
            loggedInUser={route.params.loggedInUser}
            actionGenerated={this.actionHandler}
          />
          {liveReactionView}
          {messageComposer}
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

export default CometChatMessages;
