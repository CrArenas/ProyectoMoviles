import React, { useEffect, useMemo, useState } from 'react'

import {
    View,
    Text,
    ScrollView,
    Pressable,
    RefreshControl,
    ActivityIndicator,
} from 'react-native'

import { useAuth } from '../../context/AuthContext'
import { getReservations } from '../../services/userApi'
import { COLORS } from '../../theme'
import styles from '../../styles/homeStyles'

const formatDate = (value) => {
    if (!value) {
        return 'Sin fecha'
    }

    return new Date(value).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

const normalizeStatus = (value) => String(value ?? '').toLowerCase()

export default function Home({ navigation }) {
    const { extractApiError } = useAuth()

    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const loadReservations = async ({ refreshing = false } = {}) => {
        if (refreshing) {
            setRefreshing(true)
        } else {
            setLoading(true)
        }

        try {
            const response = await getReservations()
            setReservations(response?.data ?? [])
        } catch (error) {
            console.warn(extractApiError(error, 'No se pudieron cargar las reservas'))
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        loadReservations()
    }, [])

    const activeReservations = useMemo(
        () => reservations.filter((reservation) => {
            const status = normalizeStatus(reservation.status)

            return status === 'activa' || status === 'pendiente de pago'
        }),
        [reservations]
    )

    const finishedReservations = useMemo(
        () => reservations.filter((reservation) => normalizeStatus(reservation.status) === 'finalizada'),
        [reservations]
    )

    const nextReservation = useMemo(() => {
        if (!activeReservations.length) {
            return null
        }

        return [...activeReservations].sort((left, right) => {
            const leftDate = new Date(left.check_in ?? left.created_at ?? 0).getTime()
            const rightDate = new Date(right.check_in ?? right.created_at ?? 0).getTime()

            return leftDate - rightDate
        })[0]
    }, [activeReservations])

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => loadReservations({ refreshing: true })}
                    tintColor={COLORS.accent}
                />
            }
        >
            <View style={styles.heroCard}>
                <Text style={styles.kicker}>Roomix móvil</Text>
                <Text style={styles.heroTitle}>Tu estadía, en un solo lugar</Text>
                <Text style={styles.heroText}>
                    Revisa tus reservas activas, confirma pagos y mantén el historial sincronizado con tu usuario.
                </Text>

                <View style={styles.heroActions}>
                    <Pressable style={styles.primaryButton} onPress={() => navigation?.navigate?.('Reservations')}>
                        <Text style={styles.primaryButtonText}>Ir a reservas</Text>
                    </Pressable>

                    <Pressable style={styles.secondaryButton} onPress={() => navigation?.navigate?.('Profile')}>
                        <Text style={styles.secondaryButtonText}>Ver perfil</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{loading ? '...' : reservations.length}</Text>
                    <Text style={styles.statLabel}>Reservas totales</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{loading ? '...' : activeReservations.length}</Text>
                    <Text style={styles.statLabel}>Activas</Text>
                </View>

                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{loading ? '...' : finishedReservations.length}</Text>
                    <Text style={styles.statLabel}>Finalizadas</Text>
                </View>
            </View>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Próxima reserva</Text>

                {loading ? (
                    <ActivityIndicator color={COLORS.accent} />
                ) : nextReservation ? (
                    <View style={styles.nextReservationCard}>
                        <Text style={styles.nextReservationTitle}>
                            Habitación {nextReservation.room?.number ?? nextReservation.room_id}
                        </Text>
                        <Text style={styles.nextReservationMeta}>
                            Entrada: {formatDate(nextReservation.check_in)}
                        </Text>
                        <Text style={styles.nextReservationMeta}>
                            Salida: {formatDate(nextReservation.check_out)}
                        </Text>
                        <Text style={styles.nextReservationMeta}>
                            Estado: {nextReservation.status}
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.emptyText}>
                        No tienes reservas activas por ahora.
                    </Text>
                )}
            </View>

            <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Flujo del usuario móvil</Text>
                <Text style={styles.paragraph}>
                    La aplicación está pensada para que el usuario común consulte el estado de sus reservas, agregue acompañantes y confirme el pago sin salir del entorno móvil.
                </Text>
                <Text style={styles.paragraph}>
                    Si alguna reserva no aparece, actualiza esta pantalla para volver a consultar el backend con tu token actual.
                </Text>
            </View>
        </ScrollView>
    )
}
