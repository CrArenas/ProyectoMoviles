import React, { useState } from 'react'

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native'

import { useAuth } from '../../context/AuthContext'

export default function Login({ navigation }) {

    const [email, setEmail] = useState('')

    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)

    const { signIn, extractApiError } = useAuth()

    const handleLogin = async () => {

        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Completa correo y contraseña')
            return
        }

        try {

            setLoading(true)

            await signIn(email.trim(), password)

            Alert.alert(
                'Éxito',
                'Inicio de sesión correcto'
            )

        } catch (error) {

            Alert.alert(
                'Error',
                extractApiError(error, 'Error al iniciar sesión')
            )
        } finally {
            setLoading(false)
        }
    }

    return (

        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                padding: 20
            }}
        >

            <Text
                style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    marginBottom: 20
                }}
            >
                Roomix
            </Text>

            <TextInput
                placeholder='Correo'
                value={email}
                onChangeText={setEmail}
                style={{
                    borderWidth: 1,
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 10
                }}
            />

            <TextInput
                placeholder='Contraseña'
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{
                    borderWidth: 1,
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 20
                }}
            />

            <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                style={{
                    backgroundColor: '#007AFF',
                    padding: 15,
                    borderRadius: 10,
                    opacity: loading ? 0.7 : 1
                }}
            >

                {
                    loading ? (
                        <ActivityIndicator color='white' />
                    ) : (
                        <Text
                            style={{
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}
                        >
                            Iniciar sesión
                        </Text>
                    )
                }

            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                style={{
                    marginTop: 20
                }}
            >

                <Text
                    style={{
                        textAlign: 'center'
                    }}
                >
                    ¿No tienes cuenta? Regístrate
                </Text>

            </TouchableOpacity>

        </View>
    )
}