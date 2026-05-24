import React, { useState } from 'react'

import {
    View,
    Text,
    TextInput,
    Pressable,
    Alert,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker'

import { useAuth } from '../../context/AuthContext'
import { COLORS } from '../../theme'
import styles from '../../styles/registerStyles'

export default function Register({ navigation }) {
    const [form, setForm] = useState({
        name: '',
        last_name: '',
        email: '',
        password: '',
        phone: '',
        birth_date: ''
    })

    const [date, setDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [loading, setLoading] = useState(false)
    const { signUp, extractApiError } = useAuth()

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date

        setShowDatePicker(Platform.OS === 'ios')
        setDate(currentDate)

        const formattedDate =
            currentDate.getFullYear() +
            '-' +
            String(currentDate.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(currentDate.getDate()).padStart(2, '0')

        setForm((current) => ({
            ...current,
            birth_date: formattedDate
        }))
    }

    const handleRegister = async () => {
        if (
            !form.name.trim() ||
            !form.last_name.trim() ||
            !form.email.trim() ||
            !form.password.trim() ||
            !form.phone.trim() ||
            !form.birth_date
        ) {
            Alert.alert('Error', 'Completa todos los campos del registro')
            return
        }

        try {
            setLoading(true)
            await signUp(form)

            Alert.alert('Éxito', 'Usuario registrado correctamente')
            navigation.replace('Login')
        } catch (error) {
            Alert.alert('Error', extractApiError(error, 'No se pudo registrar'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.heroCard}>
                <Text style={styles.kicker}>Roomix móvil</Text>
                <Text style={styles.heroTitle}>Crea tu cuenta</Text>
                <Text style={styles.heroText}>
                    Regístrate con la misma estética del proyecto administrativo para mantener la experiencia visual consistente.
                </Text>
            </View>

            <View style={styles.formCard}>
                <Text style={styles.sectionTitle}>Registro</Text>
                <Text style={styles.sectionText}>Completa tus datos personales para crear tu cuenta.</Text>

                <View style={styles.dualRow}>
                    <TextInput
                        placeholder='Nombre'
                        placeholderTextColor={COLORS.muted}
                        value={form.name}
                        onChangeText={(text) => setForm({ ...form, name: text })}
                        style={[styles.input, styles.dualInput]}
                    />

                    <TextInput
                        placeholder='Apellido'
                        placeholderTextColor={COLORS.muted}
                        value={form.last_name}
                        onChangeText={(text) => setForm({ ...form, last_name: text })}
                        style={[styles.input, styles.dualInput]}
                    />
                </View>

                <TextInput
                    placeholder='Correo'
                    placeholderTextColor={COLORS.muted}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    value={form.email}
                    onChangeText={(text) => setForm({ ...form, email: text })}
                    style={styles.input}
                />

                <TextInput
                    placeholder='Contraseña'
                    placeholderTextColor={COLORS.muted}
                    secureTextEntry
                    value={form.password}
                    onChangeText={(text) => setForm({ ...form, password: text })}
                    style={styles.input}
                />

                <TextInput
                    placeholder='Teléfono'
                    placeholderTextColor={COLORS.muted}
                    keyboardType='numeric'
                    value={form.phone}
                    onChangeText={(text) => setForm({ ...form, phone: text.replace(/[^0-9]/g, '') })}
                    style={styles.input}
                />

                <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                    <Text style={[styles.dateButtonText, !form.birth_date && styles.dateButtonPlaceholder]}>
                        {form.birth_date || 'Seleccionar fecha de nacimiento'}
                    </Text>
                </Pressable>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode='date'
                        display='default'
                        maximumDate={new Date()}
                        onChange={onChangeDate}
                    />
                )}

                <Pressable onPress={handleRegister} disabled={loading} style={[styles.primaryButton, loading && styles.buttonDisabled]}>
                    {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.primaryButtonText}>Registrarse</Text>}
                </Pressable>

                <Pressable onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
                    <Text style={styles.linkText}>Ya tengo cuenta</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}

