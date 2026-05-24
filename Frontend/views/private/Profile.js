import React, { useEffect, useState } from 'react'

import {
    View,
    Text,
    ScrollView,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native'

import { useAuth } from '../../context/AuthContext'
import { getReservations } from '../../services/userApi'
import { COLORS } from '../../theme'
import styles from '../../styles/profileStyles'

const formatDate = (value) => {
    if (!value) {
        return 'Sin dato'
    }

    return new Date(value).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

export default function Profile() {
    const { user, signOut, refreshUser, extractApiError } = useAuth()

    const [summary, setSummary] = useState({
        loading: true,
        reservations: []
    })

    const loadSummary = async () => {
        setSummary((current) => ({ ...current, loading: true }))

        try {
            const response = await getReservations()

            setSummary({
                loading: false,
                reservations: response?.data ?? []
            })
        } catch (error) {
            setSummary((current) => ({ ...current, loading: false }))
            console.warn(extractApiError(error, 'No se pudo cargar el resumen del perfil'))
        }
    }

    useEffect(() => {
        loadSummary()
    }, [])

    const handleRefreshProfile = async () => {
        try {
            await refreshUser()
            await loadSummary()
            Alert.alert('Éxito', 'Perfil actualizado correctamente')
        } catch (error) {
            Alert.alert('Error', extractApiError(error, 'No se pudo actualizar el perfil'))
        }
    }

    const handleLogout = async () => {
        try {
            await signOut()
        } catch (error) {
            Alert.alert('Error', extractApiError(error, 'No se pudo cerrar sesión'))
        }
    }

    const activeReservations = summary.reservations.filter((reservation) => String(reservation.status ?? '').toLowerCase() === 'activa').length

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.heroCard}>
                <Text style={styles.kicker}>Mi perfil</Text>
                <Text style={styles.heroTitle}>
                    {user ? `${user.name} ${user.last_name}` : 'Usuario'}
                </Text>
                <Text style={styles.heroText}>
                    Revisa tu información básica y cierra sesión cuando termines de usar la aplicación.
                </Text>

                <View style={styles.heroActions}>
                    <Pressable style={styles.primaryButton} onPress={handleRefreshProfile}>
                        <Text style={styles.primaryButtonText}>Actualizar datos</Text>
                    </Pressable>

                    <Pressable style={styles.secondaryButton} onPress={handleLogout}>
                        <Text style={styles.secondaryButtonText}>Cerrar sesión</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Información de cuenta</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Correo</Text>
                    <Text style={styles.infoValue}>{user?.email ?? 'Sin correo'}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Teléfono</Text>
                    <Text style={styles.infoValue}>{user?.phone ?? 'Sin teléfono'}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fecha de nacimiento</Text>
                    <Text style={styles.infoValue}>{formatDate(user?.birth_date)}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Rol</Text>
                    <Text style={styles.infoValue}>{user?.role?.name ?? 'Usuario'}</Text>
                </View>
            </View>

            <View style={styles.summaryGrid}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryValue}>{summary.loading ? '...' : summary.reservations.length}</Text>
                    <Text style={styles.summaryLabel}>Reservas totales</Text>
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryValue}>{summary.loading ? '...' : activeReservations}</Text>
                    <Text style={styles.summaryLabel}>Reservas activas</Text>
                </View>
            </View>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Estado de la sesión</Text>

                {
                    summary.loading ? (
                        <ActivityIndicator color={COLORS.accent} />
                    ) : (
                        <Text style={styles.paragraph}>
                            La sesión está activa y las pantallas móviles consumen las rutas protegidas con tu token JWT.
                        </Text>
                    )
                }
            </View>
        </ScrollView>
    )
}

