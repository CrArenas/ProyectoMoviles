import React from 'react'

import { View, ActivityIndicator, Text } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import Login from './views/public/Login'
import Register from './views/public/Register'

import Home from './views/private/Home'
import Reservations from './views/private/Reservations'
import Profile from './views/private/Profile'

import { AuthProvider, useAuth } from './context/AuthContext'
import { COLORS } from './theme'
import { containerStyle, createTabBarStyle, loadingCard, loadingScreen, loadingText } from './styles/routerStyles'

const Stack = createNativeStackNavigator()

const Tab = createBottomTabNavigator()

function LoadingScreen() {
    return (
        <View
            style={loadingScreen}
        >
            <View style={loadingCard}>
                <ActivityIndicator size='large' color={COLORS.accent} />
                <Text style={loadingText}>
                    Cargando sesión...
                </Text>
            </View>
        </View>
    )
}

function TabNavigation() {
    const insets = useSafeAreaInsets()

    return (

        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.accent,
                tabBarInactiveTintColor: COLORS.muted,
                tabBarStyle: createTabBarStyle(insets.bottom),
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600'
                },
                tabBarIcon: ({ color, size }) => {
                    const icons = {
                        Home: 'home-outline',
                        Reservations: 'calendar-outline',
                        Profile: 'person-circle-outline'
                    }

                    return <Ionicons name={icons[route.name] ?? 'ellipse-outline'} size={size} color={color} />
                }
            })}
        >

            <Tab.Screen
                name='Home'
                component={Home}
                options={{ tabBarLabel: 'Inicio' }}
            />

            <Tab.Screen
                name='Reservations'
                component={Reservations}
                options={{ tabBarLabel: 'Mis reservas' }}
            />

            <Tab.Screen
                name='Profile'
                component={Profile}
                options={{ tabBarLabel: 'Perfil' }}
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
        <SafeAreaView style={containerStyle} edges={['top', 'left', 'right']}>
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
        </SafeAreaView>
    )
}

export default function Router() {

    return (
        <SafeAreaProvider>
            <AuthProvider>
                <RootNavigator />
            </AuthProvider>
        </SafeAreaProvider>
    )
}