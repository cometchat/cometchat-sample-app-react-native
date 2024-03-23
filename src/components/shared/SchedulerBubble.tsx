import { View, ScrollView } from "react-native";
import React from "react";
import { CometChatSchedulerBubble, } from "@cometchat/chat-uikit-react-native";
import { SchedulerMessage } from "@cometchat/chat-uikit-react-native";

const SchedulerBubble = (props: any) => {
  function getSchedulerMessage() {
    const json = {
      mentionedUsers: [],
      mentionedMe: false,
      receiverId: "group_1706078382528",
      type: "scheduler",
      receiverType: "group",
      category: "interactive",
      data: {
        muid: "16Jan3:41PM",
        duration: 30,
        entities: {
          sender: {
            entity: {
              uid: "jcob",
              name: "Dr Jacob",
              role: "default",
              avatar:
                "https://upload.wikimedia.org/wikipedia/en/e/e1/Thomas_D._Baird_%28low-resolution%29.jpg",
              status: "offline",
              createdAt: 1705652843,
              updatedAt: 1705653514,
              lastActiveAt: 1706166570,
            },
            entityType: "user",
          },
          receiver: {
            entity: {
              guid: "group_1706078382528",
              name: "Scheduler TimeDate",
              type: "public",
              owner: "superhero2",
              createdAt: 1706078391,
              updatedAt: 1706078425,
              membersCount: 12,
              conversationId: "group_group_1706078382528",
              onlineMembersCount: 39,
            },
            entityType: "group",
          },
        },
        receiver: "group_1706078382528",
        resource: "sachin",
        bufferTime: 0,
        receiverType: "group",
        interactionGoal: { elementIds: [], type: "anyAction" },
        interactiveData: {
          title: "Meet with Dr. Jacob",
          duration: 60,
          bufferTime: 15,
          icsFileUrl: "",
          availability: {
            friday: [{ to: "2359", from: "0000" }],
            monday: [{ to: "1700", from: "0600" }],
            tuesday: [
              { to: "1400", from: "1000" },
              { to: "2000", from: "1700" },
            ],
            saturday: [
              { to: "0800", from: "0600" },
              { to: "2300", from: "1200" },
            ],
            thursday: [{ to: "2359", from: "0000" }],
            wednesday: [
              { to: "0800", from: "0600" },
              { to: "2300", from: "1200" },
            ],
          },
          dateRangeEnd: "2026-02-09",
          timezoneCode: "Asia/Kolkata",
          dateRangeStart: "2023-02-10",
          scheduleElement: {
            action: {
              url: "https://example.com",
              method: "post",
              headers: {
                accept: "application/json",
                "content-type": "application/json",
              },
              payload: {
                data: { text: "Meeting Scheduled Successfully!" },
                type: "text",
                category: "message",
                receiver: "demo2",
                receiverType: "user",
              },
              actionType: "apiAction",
            },
            elementId: "1",
            buttonText: "Schedule",
            elementType: "button",
            disableAfterInteracted: true,
          },
          goalCompletionText: "Appointment scheduled",
          interactableElementIds: ["1"],
        },
        allowSenderInteraction: false,
      },
      id: "923",
      conversationId: "group_group_1706078382528",
      sender: {
        hasBlockedMe: false,
        blockedByMe: false,
        deactivatedAt: 0,
        uid: "jcob",
        name: "Dr Jacob",
        avatar:
          "https://upload.wikimedia.org/wikipedia/en/e/e1/Thomas_D._Baird_%28low-resolution%29.jpg",
        lastActiveAt: 1706166570,
        role: "default",
        status: "offline",
      },
      receiver: {
        hasJoined: false,
        membersCount: 12,
        guid: "group_1706078382528",
        name: "Scheduler TimeDate",
        type: "public",
        owner: "superhero2",
        createdAt: 1706078391,
        updatedAt: 1706078425,
        conversationId: "group_group_1706078382528",
        onlineMembersCount: 39,
      },
      sentAt: 1706678107,
      updatedAt: 1706678107,
    };
    const schedulerMessage = SchedulerMessage.fromJSON(json);
    return schedulerMessage;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          width: "100%",
          marginLeft: 20,
          marginVertical: 30,
        }}
      >
        <CometChatSchedulerBubble
          style={{ backgroundColor: "#eeeeee" }}
          schedulerMessage={getSchedulerMessage()}
          onScheduleClick={() => {}}
        />
      </View>
    </ScrollView>
  );
};

export default SchedulerBubble;
