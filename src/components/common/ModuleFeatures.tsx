import React from 'react'
import { ScrollView } from 'react-native'
import { CardView } from './CardView'

const ModuleFeatures = ({ navigation, features }) => {
    return (
        <ScrollView>
            {
                features.map(module => {
                    return <CardView
                        name={module.name}
                        info={module.info}
                        image={module.image}
                        onPress={() => navigation.navigate(module.id)}
                    />
                })
            }
        </ScrollView>
    )
}

export default ModuleFeatures