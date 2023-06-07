import React from 'react'
import { View, Text } from 'react-native'
import { AppStyle } from '../../AppStyle'
import { AppTopBar } from '../common/AppTopBar'
import ModuleFeatures from '../common/ModuleFeatures'
import { Component1, Component2, Component3, List } from '../../resources'

const CallModules = [
    {
        id: "CallButton",
        name: "Call Button",
        info: "CometChatCallButton is an independent component that will allows you to make a call.",
        image: Component3,
    },
]

export const CallFeatureList = (props) => {
    return (
        <View style={AppStyle.container}>
            <AppTopBar navigation={props.navigation} title={"Calls"} />
            <ModuleFeatures navigation={props.navigation} features={CallModules} />
        </View>
    )
}