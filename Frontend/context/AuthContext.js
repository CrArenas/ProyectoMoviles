import React, { createContext, useContext, useEffect, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import {
    extractApiError,
    getCurrentUser,
    getStoredToken,
    loginUser,
    logoutUser,
    registerUser
} from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const bootstrapAuth = async () => {
            try {
                const token = await getStoredToken()

                if (!token) {
                    setUser(null)
                    return
                }

                const currentUser = await getCurrentUser()

                setUser(currentUser)
            } catch (error) {
                await AsyncStorage.removeItem('token')
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        bootstrapAuth()
    }, [])

    const signIn = async (email, password) => {
        const response = await loginUser(email, password)

        setUser(response.user ?? null)

        return response
    }

    const signUp = async (data) => {
        return registerUser(data)
    }

    const signOut = async () => {
        try {
            await logoutUser()
        } finally {
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: Boolean(user),
                signIn,
                signUp,
                signOut,
                refreshUser: async () => {
                    const currentUser = await getCurrentUser()
                    setUser(currentUser)
                    return currentUser
                },
                extractApiError
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}