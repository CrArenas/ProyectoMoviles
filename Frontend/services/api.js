import axios from 'axios'
import { Platform } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'

const resolveBackendHost = () => {

    const hostUri = Constants.expoConfig?.hostUri ?? ''

    const host = hostUri.split(':')[0]

    if (host) {

        if (Platform.OS === 'android' && (host === 'localhost' || host === '127.0.0.1')) {

            return '10.0.2.2'

        }

        return host

    }

    if (Platform.OS === 'android') {

        return '10.0.2.2'

    }

    return 'localhost'

}

const api = axios.create({
    baseURL: `http://${resolveBackendHost()}:8000/api/`,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    } else {
        delete config.headers.Authorization
    }

    return config
})

export default api