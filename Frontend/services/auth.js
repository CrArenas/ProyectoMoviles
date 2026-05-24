import api from './api'
import AsyncStorage from '@react-native-async-storage/async-storage'

const TOKEN_KEY = 'token'

export const getStoredToken = async () => {
    return AsyncStorage.getItem(TOKEN_KEY)
}

export const getCurrentUser = async () => {
    const response = await api.get('me/')

    return response.data.user
}

export const extractApiError = (error, fallbackMessage) => {
    return (
        error.response?.data?.error ||
        error.response?.data?.message ||
        Object.values(error.response?.data?.errors || {})?.flat?.()?.[0] ||
        fallbackMessage
    )
}

export const loginUser = async (email, password) => {

    const response = await api.post('login/', {
        email,
        password
    })

    const token = response.data.token

    await AsyncStorage.setItem(TOKEN_KEY, token)

    return response.data
}

export const registerUser = async (data) => {

    const response = await api.post('register/', data)

    return response.data
}

export const logoutUser = async () => {
    try {
        await api.post('logout/', {})
    } finally {
        await AsyncStorage.removeItem(TOKEN_KEY)
    }
}