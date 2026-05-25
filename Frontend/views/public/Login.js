import React, { useState } from 'react'

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native'

import { useAuth } from '../../context/AuthContext'
import { COLORS } from '../../theme'
import styles from '../../styles/loginStyles'

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

            Alert.alert('Éxito', 'Inicio de sesión correcto')
        } catch (error) {
            Alert.alert('Error', extractApiError(error, 'Error al iniciar sesión'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.heroCard}>
                <Text style={styles.brand}>
                    Room<Text style={styles.brandAccent}>ix</Text>
                </Text>
                <Text style={styles.heroTitle}>Panel móvil del usuario</Text>
                <Text style={styles.heroText}>
                    Inicia sesión para revisar tus reservas, gestionar acompañantes y confirmar pagos.
                </Text>
            </View>

            <View style={styles.formCard}>
                <Text style={styles.sectionTitle}>Iniciar sesión</Text>
                <Text style={styles.sectionText}>Usa tu correo y contraseña registrados.</Text>

                <TextInput
                    placeholder='Correo'
                    placeholderTextColor={COLORS.muted}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize='none'
                    keyboardType='email-address'
                    style={styles.input}
                />

                <TextInput
                    placeholder='Contraseña'
                    placeholderTextColor={COLORS.muted}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                />

                <TouchableOpacity onPress={handleLogin} disabled={loading} style={[styles.primaryButton, loading && styles.buttonDisabled]}>
                    {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.primaryButtonText}>Iniciar sesión</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkButton}>
                    <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

