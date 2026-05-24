import React from 'react'

import {
    View,
    Text,
    TouchableOpacity,
    Alert
} from 'react-native'

import { useAuth } from '../../context/AuthContext'

export default function Profile({ navigation }) {

    const { user, signOut, extractApiError } = useAuth()

    const handleLogout = async () => {

        try {
            await signOut()
        } catch (error) {
            Alert.alert(
                'Error',
                extractApiError(error, 'No se pudo cerrar sesión')
            )
        }
    }

    return (

        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >

            <Text>
                {user ? `${user.name} ${user.last_name}` : 'Perfil'}
            </Text>

            <Text>
                {user?.email}
            </Text>

            <TouchableOpacity
                onPress={handleLogout}
                style={{
                    marginTop: 20,
                    backgroundColor: 'red',
                    padding: 15,
                    borderRadius: 10
                }}
            >

                <Text
                    style={{
                        color: 'white'
                    }}
                >
                    Cerrar sesión
                </Text>

            </TouchableOpacity>

        </View>
    )
}