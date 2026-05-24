import React from 'react'

import { View, ActivityIndicator, Text } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Login from './views/public/Login'
import Register from './views/public/Register'

import Home from './views/private/Home'
import Reservations from './views/private/Reservations'
import Profile from './views/private/Profile'

import { AuthProvider, useAuth } from './context/AuthContext'

const Stack = createNativeStackNavigator()

const Tab = createBottomTabNavigator()

function LoadingScreen() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <ActivityIndicator size='large' color='#007AFF' />
            <Text style={{ marginTop: 12 }}>
                Cargando sesión...
            </Text>
        </View>
    )
}

function TabNavigation() {

    return (

        <Tab.Navigator>

            <Tab.Screen
                name='Home'
                component={Home}
            />

            <Tab.Screen
                name='Reservations'
                component={Reservations}
            />

            <Tab.Screen
                name='Profile'
                component={Profile}
            />

        </Tab.Navigator>
    )
}

function RootNavigator() {
    const { loading, isAuthenticated } = useAuth()

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <NavigationContainer>

            <Stack.Navigator>

                {
                    isAuthenticated ? (
                        <Stack.Screen
                            name='Tabs'
                            component={TabNavigation}
                            options={{ headerShown: false }}
                        />
                    ) : (
                        <>
                            <Stack.Screen
                                name='Login'
                                component={Login}
                                options={{ headerShown: false }}
                            />

                            <Stack.Screen
                                name='Register'
                                component={Register}
                                options={{ headerShown: false }}
                            />
                        </>
                    )
                }

            </Stack.Navigator>

        </NavigationContainer>
    )
}

export default function Router() {

    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    )
}