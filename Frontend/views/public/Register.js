import React, { useState } from 'react'

import {
    View,
    Text,
    TextInput,
    Pressable,
    Alert,
    ScrollView,
    Platform
} from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker'

import { useAuth } from '../../context/AuthContext'

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

        setForm({
            ...form,
            birth_date: formattedDate
        })
    }

    const handleRegister = async () => {

        try {

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

            setLoading(true)

            await signUp(form)

            Alert.alert(
                'Éxito',
                'Usuario registrado correctamente'
            )

            navigation.replace('Login')

        } catch (error) {

            Alert.alert(
                'Error',
                extractApiError(error, 'No se pudo registrar')
            )
        } finally {
            setLoading(false)
        }
    }

    return (

        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                padding: 20
            }}
        >

            <Text
                style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    marginBottom: 20,
                    textAlign: 'center'
                }}
            >
                Registro
            </Text>

            <TextInput
                placeholder='Nombre'
                value={form.name}
                onChangeText={(text) =>
                    setForm({
                        ...form,
                        name: text
                    })
                }
                style={{
                    borderWidth: 1,
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 10
                }}
            />

            <TextInput
                placeholder='Apellido'
                value={form.last_name}
                onChangeText={(text) =>
                    setForm({
                        ...form,
                        last_name: text
                    })
                }
                style={{
                    borderWidth: 1,
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 10
                }}
            />

            <TextInput
                placeholder='Correo'
                keyboardType='email-address'
                autoCapitalize='none'
                value={form.email}
                onChangeText={(text) =>
                    setForm({
                        ...form,
                        email: text
                    })
                }
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
                value={form.password}
                onChangeText={(text) =>
                    setForm({
                        ...form,
                        password: text
                    })
                }
                style={{
                    borderWidth: 1,
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 10
                }}
            />

            <TextInput
                placeholder='Teléfono'
                keyboardType='numeric'
                value={form.phone}
                onChangeText={(text) =>
                    setForm({
                        ...form,
                        phone: text.replace(/[^0-9]/g, '')
                    })
                }
                style={{
                    borderWidth: 1,
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 10
                }}
            />

            <Pressable
                onPress={() => setShowDatePicker(true)}
                style={{
                    borderWidth: 1,
                    padding: 15,
                    borderRadius: 10,
                    marginBottom: 20
                }}
            >

                <Text
                    style={{
                        color: form.birth_date ? 'black' : 'gray'
                    }}
                >
                    {
                        form.birth_date
                            ? form.birth_date
                            : 'Seleccionar fecha de nacimiento'
                    }
                </Text>

            </Pressable>

            {
                showDatePicker && (

                    <DateTimePicker
                        value={date}
                        mode='date'
                        display='default'
                        maximumDate={new Date()}
                        onChange={onChangeDate}
                    />

                )
            }

            <Pressable
                onPress={handleRegister}
                disabled={loading}
                style={{
                    backgroundColor: '#007AFF',
                    padding: 15,
                    borderRadius: 10,
                    opacity: loading ? 0.7 : 1
                }}
            >

                <Text
                    style={{
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? 'Registrando...' : 'Registrarse'}
                </Text>

            </Pressable>

        </ScrollView>
    )
}