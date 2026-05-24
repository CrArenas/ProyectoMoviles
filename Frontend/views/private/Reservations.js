import React, { useEffect, useMemo, useState } from 'react'

import {
    View,
    Text,
    ScrollView,
    TextInput,
    Pressable,
    Alert,
    ActivityIndicator,
    RefreshControl,
    Platform,
} from 'react-native'

import DateTimePicker from '@react-native-community/datetimepicker'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

import { useAuth } from '../../context/AuthContext'
import {
    createCompanion,
    createPayment,
    createReservation,
    deleteReservation,
    deleteCompanion,
    getReservations,
    getRooms,
    updateReservation
} from '../../services/userApi'
import { COLORS, SHADOW } from '../../theme'
import styles from '../../styles/reservationsStyles'

const today = () => new Date().toISOString().slice(0, 10)

const reservationInitialForm = {
    room_id: '',
    check_in: today(),
    check_out: ''
}

const companionInitialForm = {
    name: '',
    document: '',
    relationship: ''
}

const createPaymentForm = () => ({
    method: 'efectivo',
    date: today()
})

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

const formatMoney = (value) => {
    return Number(value ?? 0).toLocaleString('es-CO')
}

const normalizeStatus = (value) => String(value ?? '').toLowerCase()

export default function Reservations() {
    const { extractApiError } = useAuth()

    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)
    const [selectedReservationId, setSelectedReservationId] = useState(null)
    const [reservationForm, setReservationForm] = useState({
        ...reservationInitialForm
    })
    const [companionForm, setCompanionForm] = useState(companionInitialForm)
    const [paymentForm, setPaymentForm] = useState(createPaymentForm)
    const [cardForm, setCardForm] = useState({
        number: '',
        holder: '',
        expiry: '',
        cvv: ''
    })
    const [flowStep, setFlowStep] = useState('details')
    const [pendingCompanions, setPendingCompanions] = useState([])
    const [rooms, setRooms] = useState([])
    const [roomsLoading, setRoomsLoading] = useState(true)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [checkOutDate, setCheckOutDate] = useState(new Date())
    const [reservationView, setReservationView] = useState('current')

    const currentReservations = useMemo(
        () => reservations.filter((reservation) => {
            const status = normalizeStatus(reservation.status)

            return status === 'activa' || status === 'pendiente de pago'
        }),
        [reservations]
    )

    const historyReservations = useMemo(
        () => reservations.filter((reservation) => normalizeStatus(reservation.status) === 'finalizada'),
        [reservations]
    )

    const selectedRoom = useMemo(
        () => rooms.find((room) => String(room.id) === reservationForm.room_id) ?? null,
        [rooms, reservationForm.room_id]
    )

    const estimatedNights = useMemo(() => {
        if (!reservationForm.check_in || !reservationForm.check_out) {
            return 0
        }

        const start = new Date(`${reservationForm.check_in}T00:00:00`)
        const end = new Date(`${reservationForm.check_out}T00:00:00`)
        const diff = end.getTime() - start.getTime()

        if (Number.isNaN(diff) || diff <= 0) {
            return 0
        }

        return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)))
    }, [reservationForm.check_in, reservationForm.check_out])

    const estimatedTotal = useMemo(() => {
        return Number(selectedRoom?.price ?? 0) * estimatedNights
    }, [selectedRoom, estimatedNights])

    const loadReservations = async ({ refreshing = false } = {}) => {
        if (refreshing) {
            setRefreshing(true)
        } else {
            setLoading(true)
        }

        try {
            const response = await getReservations()
            const items = response?.data ?? []

            setReservations(items)

            setSelectedReservationId((currentId) => {
                if (currentId && items.some((item) => item.id === currentId)) {
                    return currentId
                }

                return items[0]?.id ?? null
            })
        } catch (error) {
            Alert.alert('Error', extractApiError(error, 'No se pudieron cargar las reservas'))
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    const loadRooms = async () => {
        setRoomsLoading(true)

        try {
            const response = await getRooms()
            setRooms(response?.data ?? [])
        } catch (error) {
            Alert.alert('Error', extractApiError(error, 'No se pudieron cargar las habitaciones'))
        } finally {
            setRoomsLoading(false)
        }
    }

    useEffect(() => {
        loadReservations()
        loadRooms()
    }, [])

    const handleStartReservationFlow = () => {
        if (!reservationForm.room_id.trim() || !reservationForm.check_in || !reservationForm.check_out) {
            Alert.alert('Error', 'Completa habitación, fecha de entrada y fecha de salida')
            return
        }

        const roomId = Number(reservationForm.room_id)

        if (Number.isNaN(roomId) || roomId <= 0) {
            Alert.alert('Error', 'La habitación debe ser un número válido')
            return
        }

        if (reservationForm.check_out <= reservationForm.check_in) {
            Alert.alert('Error', 'La fecha de salida debe ser posterior a la de entrada')
            return
        }

        setPendingCompanions([])
        setCompanionForm(companionInitialForm)
        setPaymentForm(createPaymentForm())
        setFlowStep('companions')
    }

    const handleAddPendingCompanion = () => {
        if (!companionForm.name.trim()) {
            Alert.alert('Error', 'Ingresa el nombre del acompañante')
            return
        }

        setPendingCompanions((current) => [
            ...current,
            {
                name: companionForm.name.trim(),
                document: companionForm.document.trim(),
                relationship: companionForm.relationship.trim()
            }
        ])

        setCompanionForm(companionInitialForm)
    }

    const handleInvoiceDownload = async (reservationId, reservationData, paymentMethod, totalAmount, cardData = null) => {
        try {
            const fileName = `invoice-reservation-${reservationId}.txt`
            const fileUri = `${FileSystem.cacheDirectory}${fileName}`

            const lines = [
                'ROOMIX - FACTURA VIRTUAL',
                '================================',
                `Reserva: ${reservationId}`,
                `Habitacion: ${reservationData.room?.number ?? reservationData.room_id}`,
                `Tipo: ${reservationData.room?.roomType?.name ?? 'No disponible'}`,
                `Entrada: ${formatDate(reservationData.check_in)}`,
                `Salida: ${formatDate(reservationData.check_out)}`,
                `Noches: ${estimatedNights}`,
                `Total a pagar: $${formatMoney(totalAmount)}`,
                `Metodo de pago: ${paymentMethod}`,
                '',
                'Acompanantes:'
            ]

            if (pendingCompanions.length) {
                pendingCompanions.forEach((companion, index) => {
                    lines.push(`${index + 1}. ${companion.name}${companion.relationship ? ` - ${companion.relationship}` : ''}${companion.document ? ` - ${companion.document}` : ''}`)
                })
            } else {
                lines.push('Sin acompanantes')
            }

            if (cardData) {
                lines.push('', 'Datos de tarjeta:')
                lines.push(`Titular: ${cardData.holder}`)
                lines.push(`Tarjeta: ${cardData.number}`)
                lines.push(`Vencimiento: ${cardData.expiry}`)
            }

            lines.push('', 'Gracias por usar Roomix')

            await FileSystem.writeAsStringAsync(fileUri, lines.join('\n'), {
                encoding: FileSystem.EncodingType.UTF8
            })

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: 'text/plain',
                    dialogTitle: 'Descargar factura virtual'
                })
            } else {
                Alert.alert('Factura generada', 'La factura se creó, pero este dispositivo no permite compartirla directamente.')
            }

            return true
        } catch (error) {
            console.warn('Invoice generation failed', error)
            Alert.alert('Factura no disponible', 'La reserva y el pago se guardaron, pero no se pudo generar la factura.')
            return false
        }
    }

    const onChangeCheckOutDate = (event, selectedDate) => {
        const currentDate = selectedDate || checkOutDate

        setShowDatePicker(Platform.OS === 'ios')
        setCheckOutDate(currentDate)

        const formattedDate =
            currentDate.getFullYear() +
            '-' +
            String(currentDate.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(currentDate.getDate()).padStart(2, '0')

        setReservationForm((current) => ({
            ...current,
            check_out: formattedDate
        }))
    }

    const handleConfirmReservationStep = () => {
        setPaymentForm(createPaymentForm())
        setFlowStep('payment')
    }

    const handleConfirmPayment = async () => {
        if (!reservationForm.room_id.trim() || !reservationForm.check_in || !reservationForm.check_out) {
            Alert.alert('Error', 'Completa los datos de la reserva antes de confirmar el pago')
            return
        }

        const roomId = Number(reservationForm.room_id)
        const reservationStatus = paymentForm.method === 'efectivo' ? 'Pendiente de pago' : 'Activa'

        if (Number.isNaN(roomId) || roomId <= 0) {
            Alert.alert('Error', 'La habitación debe ser un número válido')
            return
        }

        if (!paymentForm.date) {
            Alert.alert('Error', 'Completa la fecha de pago')
            return
        }

        if (paymentForm.method === 'tarjeta') {
            if (!cardForm.number.trim() || !cardForm.holder.trim() || !cardForm.expiry.trim() || !cardForm.cvv.trim()) {
                Alert.alert('Error', 'Completa los datos de la tarjeta')
                return
            }
        }

        setActionLoading(true)
        let createdReservationId = null

        try {
            let createdReservation

            try {
                createdReservation = await createReservation({
                    room_id: roomId,
                    check_in: reservationForm.check_in,
                    check_out: reservationForm.check_out,
                    status: reservationStatus
                })
            } catch (error) {
                throw new Error(extractApiError(error, 'No se pudo crear la reserva'))
            }

            createdReservationId = createdReservation.id

            for (const companion of pendingCompanions) {
                try {
                    await createCompanion({
                        reservation_id: createdReservationId,
                        name: companion.name,
                        document: companion.document,
                        relationship: companion.relationship
                    })
                } catch (error) {
                    throw new Error(extractApiError(error, 'No se pudo crear el acompañante'))
                }
            }

            try {
                await createPayment({
                    reservation_id: createdReservationId,
                    method: paymentForm.method,
                    date: paymentForm.date || today()
                })
            } catch (error) {
                throw new Error(extractApiError(error, 'No se pudo registrar el pago'))
            }

            if (paymentForm.method === 'efectivo') {
                await handleInvoiceDownload(
                    createdReservationId,
                    createdReservation,
                    paymentForm.method,
                    estimatedTotal
                )
            }

            if (paymentForm.method === 'tarjeta') {
                await handleInvoiceDownload(
                    createdReservationId,
                    createdReservation,
                    paymentForm.method,
                    estimatedTotal,
                    cardForm
                )
            }

            Alert.alert('Éxito', 'La reserva fue creada con éxito')

            setReservationForm(reservationInitialForm)
            setCompanionForm(companionInitialForm)
            setPaymentForm(createPaymentForm())
            setCardForm({
                number: '',
                holder: '',
                expiry: '',
                cvv: ''
            })
            setPendingCompanions([])
            setFlowStep('details')
            setSelectedReservationId(createdReservationId)
            await loadReservations({ refreshing: true })
        } catch (error) {
            try {
                if (createdReservationId) {
                    await deleteReservation(createdReservationId)
                }
            } catch (rollbackError) {
                console.warn(rollbackError)
            }

            Alert.alert('Error', error.message || 'No se pudo confirmar el pago')
        } finally {
            setActionLoading(false)
        }
    }

    const handleUpdateStatus = async (status) => {
        if (!selectedReservationId) {
            return
        }

        setActionLoading(true)

        try {
            await updateReservation(selectedReservationId, { status })
            Alert.alert('Éxito', 'Estado actualizado correctamente')
            if (normalizeStatus(status) === 'finalizada') {
                setReservationView('history')
            }
            await loadReservations({ refreshing: true })
        } catch (error) {
            Alert.alert('Error', extractApiError(error, 'No se pudo actualizar la reserva'))
        } finally {
            setActionLoading(false)
        }
    }

    const handleDeleteReservation = () => {
        if (!selectedReservationId) {
            return
        }

        Alert.alert('Eliminar reserva', 'Esta acción liberará la habitación asociada. ¿Deseas continuar?', [
            {
                text: 'Cancelar',
                style: 'cancel'
            },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    setActionLoading(true)

                    try {
                        await deleteReservation(selectedReservationId)
                        Alert.alert('Éxito', 'Reserva eliminada correctamente')
                        await loadReservations({ refreshing: true })
                    } catch (error) {
                        Alert.alert('Error', extractApiError(error, 'No se pudo eliminar la reserva'))
                    } finally {
                        setActionLoading(false)
                    }
                }
            }
        ])
    }

    const reservationCount = currentReservations.length
    const activeCount = currentReservations.filter((reservation) => normalizeStatus(reservation.status) === 'activa').length
    const historyCount = historyReservations.length

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
            <View style={styles.headerCard}>
                <Text style={styles.kicker}>Mis reservas</Text>
                <Text style={styles.headerTitle}>Gestiona tu estadía</Text>
                <Text style={styles.headerText}>
                    Aquí puedes crear reservas, agregar acompañantes y confirmar el pago usando únicamente las rutas de usuario común.
                </Text>

                <View style={styles.metricsRow}>
                    <View style={styles.metricPill}>
                        <Text style={styles.metricValue}>{loading ? '...' : reservationCount}</Text>
                        <Text style={styles.metricLabel}>Reservas</Text>
                    </View>

                    <View style={styles.metricPill}>
                        <Text style={styles.metricValue}>{loading ? '...' : activeCount}</Text>
                        <Text style={styles.metricLabel}>Activas</Text>
                    </View>

                    <View style={styles.metricPill}>
                        <Text style={styles.metricValue}>{loading ? '...' : historyCount}</Text>
                        <Text style={styles.metricLabel}>Historial</Text>
                    </View>
                </View>
            </View>

            <View style={styles.sectionCard}>
                <View style={styles.flowHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            {flowStep === 'details' && 'Reservar ahora'}
                            {flowStep === 'companions' && 'Agregar acompañante'}
                            {flowStep === 'payment' && 'Registrar pago'}
                        </Text>
                        <Text style={styles.helperText}>
                            {flowStep === 'details' && 'Selecciona la habitación y completa los datos base de la reserva.'}
                            {flowStep === 'companions' && 'Agrega uno o varios acompañantes antes de continuar al pago.'}
                            {flowStep === 'payment' && 'Confirma el pago para guardar la reserva y ver el aviso de éxito.'}
                        </Text>
                    </View>

                    <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeText}>
                            {flowStep === 'details' ? 'Paso 1 de 3' : flowStep === 'companions' ? 'Paso 2 de 3' : 'Paso 3 de 3'}
                        </Text>
                    </View>
                </View>

                {flowStep === 'details' && (
                    <>
                        <View style={styles.roomsBox}>
                            {
                                roomsLoading ? (
                                    <ActivityIndicator color={COLORS.accent} />
                                ) : rooms.length === 0 ? (
                                    <Text style={styles.emptyText}>No hay habitaciones disponibles para mostrar.</Text>
                                ) : (
                                    rooms.map((room) => {
                                        const isSelected = String(room.id) === reservationForm.room_id
                                        const isAvailable = room.status === 'disponible'

                                        return (
                                            <Pressable
                                                key={room.id}
                                                onPress={() => isAvailable && setReservationForm((current) => ({ ...current, room_id: String(room.id) }))}
                                                style={[
                                                    styles.roomCard,
                                                    isSelected && styles.roomCardSelected,
                                                    !isAvailable && styles.roomCardDisabled
                                                ]}
                                            >
                                                <View style={styles.roomCardHeader}>
                                                    <View>
                                                        <Text style={styles.roomTitle}>Habitación {room.number}</Text>
                                                        <Text style={styles.roomSubtitle}>
                                                            {room.roomType?.name ?? 'Sin tipo'}
                                                        </Text>
                                                    </View>

                                                    <View style={[
                                                        styles.statusBadge,
                                                        isAvailable ? styles.statusActive : styles.statusCanceled
                                                    ]}>
                                                        <Text style={styles.statusText}>{room.status}</Text>
                                                    </View>
                                                </View>

                                                <Text style={styles.roomMeta}>{room.description || 'Sin descripción'}</Text>
                                                <Text style={styles.roomMeta}>Precio por noche: ${formatMoney(room.price)}</Text>
                                                <Text style={styles.roomMeta}>ID: {room.id}</Text>
                                            </Pressable>
                                        )
                                    })
                                )
                            }
                        </View>

                        <TextInput
                            placeholder='Habitación seleccionada'
                            value={reservationForm.room_id}
                            editable={false}
                            style={[styles.input, styles.disabledInput]}
                        />

                        <View style={styles.dualRow}>
                            <TextInput
                                placeholder='Fecha de entrada'
                                value={reservationForm.check_in}
                                onChangeText={(value) => setReservationForm((current) => ({ ...current, check_in: value }))}
                                style={[styles.input, styles.dualInput]}
                            />

                            <Pressable onPress={() => setShowDatePicker(true)} style={[styles.dateButton, styles.dualInput]}>
                                <Text style={[styles.dateButtonText, !reservationForm.check_out && styles.dateButtonPlaceholder]}>
                                    {reservationForm.check_out || 'Seleccionar fecha de salida'}
                                </Text>
                            </Pressable>

                        </View>

                        {showDatePicker && (
                            <DateTimePicker
                                value={checkOutDate}
                                mode='date'
                                display='default'
                                minimumDate={new Date(reservationForm.check_in || today())}
                                onChange={onChangeCheckOutDate}
                            />
                        )}

                        <Pressable style={styles.primaryButton} onPress={handleStartReservationFlow} disabled={actionLoading}>
                            <Text style={styles.primaryButtonText}>Reservar ahora</Text>
                        </Pressable>
                    </>
                )}

                {flowStep === 'companions' && (
                    <>
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>Resumen de reserva</Text>
                            <Text style={styles.summaryText}>Habitación: {reservationForm.room_id}</Text>
                            <Text style={styles.summaryText}>Entrada: {reservationForm.check_in}</Text>
                            <Text style={styles.summaryText}>Salida: {reservationForm.check_out}</Text>
                            <Text style={styles.summaryText}>Estado: se definirá automáticamente al confirmar el pago</Text>
                        </View>

                        <TextInput
                            placeholder='Nombre completo'
                            value={companionForm.name}
                            onChangeText={(value) => setCompanionForm((current) => ({ ...current, name: value }))}
                            style={styles.input}
                        />

                        <TextInput
                            placeholder='Documento'
                            value={companionForm.document}
                            onChangeText={(value) => setCompanionForm((current) => ({ ...current, document: value }))}
                            style={styles.input}
                        />

                        <TextInput
                            placeholder='Relación'
                            value={companionForm.relationship}
                            onChangeText={(value) => setCompanionForm((current) => ({ ...current, relationship: value }))}
                            style={styles.input}
                        />

                        <View style={styles.actionRow}>
                            <Pressable style={styles.secondaryActionButton} onPress={handleAddPendingCompanion} disabled={actionLoading}>
                                <Text style={styles.secondaryActionButtonText}>Agregar acompañante</Text>
                            </Pressable>

                            <Pressable style={styles.primaryButton} onPress={handleConfirmReservationStep} disabled={actionLoading}>
                                <Text style={styles.primaryButtonText}>Confirmar reserva</Text>
                            </Pressable>
                        </View>

                        <View style={styles.listBox}>
                            <Text style={styles.listTitle}>Acompañantes pendientes</Text>
                            {
                                pendingCompanions.length ? (
                                    pendingCompanions.map((companion, index) => (
                                        <View key={`${companion.name}-${index}`} style={styles.listRow}>
                                            <Text style={styles.listRowTitle}>{companion.name}</Text>
                                            <Text style={styles.listRowSubtitle}>
                                                {companion.relationship || 'Sin relación'}{companion.document ? ` · ${companion.document}` : ''}
                                            </Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.emptyText}>No has agregado acompañantes todavía.</Text>
                                )
                            }
                        </View>
                    </>
                )}

                {flowStep === 'payment' && (
                    <>
                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>Registrar pago</Text>
                            <Text style={styles.summaryText}>Habitación: {reservationForm.room_id}</Text>
                            <Text style={styles.summaryText}>Entrada: {reservationForm.check_in}</Text>
                            <Text style={styles.summaryText}>Salida: {reservationForm.check_out}</Text>
                            <Text style={styles.summaryText}>Noches: {estimatedNights}</Text>
                            <Text style={styles.summaryText}>Total a pagar: ${formatMoney(estimatedTotal)}</Text>
                            <Text style={styles.summaryText}>Estado de la reserva: {paymentForm.method === 'efectivo' ? 'Pendiente de pago' : 'Activa'}</Text>
                        </View>

                        <View style={styles.optionsRow}>
                            {['efectivo', 'tarjeta'].map((method) => (
                                <Pressable
                                    key={method}
                                    onPress={() => setPaymentForm((current) => ({ ...current, method }))}
                                    style={[
                                        styles.optionChip,
                                        paymentForm.method === method && styles.optionChipActive
                                    ]}
                                >
                                    <Text style={paymentForm.method === method ? styles.optionChipTextActive : styles.optionChipText}>
                                        {method}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {
                            paymentForm.method === 'tarjeta' ? (
                                <View style={styles.summaryBox}>
                                    <Text style={styles.summaryTitle}>Datos de tarjeta</Text>

                                    <TextInput
                                        placeholder='Nombre del titular'
                                        placeholderTextColor={COLORS.muted}
                                        value={cardForm.holder}
                                        onChangeText={(value) => setCardForm((current) => ({ ...current, holder: value }))}
                                        style={styles.input}
                                    />

                                    <TextInput
                                        placeholder='Número de tarjeta'
                                        placeholderTextColor={COLORS.muted}
                                        keyboardType='numeric'
                                        value={cardForm.number}
                                        onChangeText={(value) => setCardForm((current) => ({ ...current, number: value.replace(/[^0-9]/g, '') }))}
                                        style={styles.input}
                                    />

                                    <View style={styles.dualRow}>
                                        <TextInput
                                            placeholder='MM/AA'
                                            placeholderTextColor={COLORS.muted}
                                            value={cardForm.expiry}
                                            onChangeText={(value) => setCardForm((current) => ({ ...current, expiry: value }))}
                                            style={[styles.input, styles.dualInput]}
                                        />

                                        <TextInput
                                            placeholder='CVV'
                                            placeholderTextColor={COLORS.muted}
                                            keyboardType='numeric'
                                            value={cardForm.cvv}
                                            onChangeText={(value) => setCardForm((current) => ({ ...current, cvv: value.replace(/[^0-9]/g, '') }))}
                                            style={[styles.input, styles.dualInput]}
                                        />
                                    </View>

                                    <View style={styles.paymentDateRow}>
                                        <Text style={styles.paymentDateLabel}>Fecha del pago</Text>
                                        <TextInput
                                            value={paymentForm.date}
                                            editable={false}
                                            selectTextOnFocus={false}
                                            style={[styles.input, styles.paymentDateInput]}
                                        />
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.summaryBox}>
                                    <Text style={styles.summaryTitle}>Factura virtual</Text>
                                    <Text style={styles.summaryText}>Al confirmar el pago en efectivo se descargará una factura con el resumen completo.</Text>

                                    <View style={styles.paymentDateRow}>
                                        <Text style={styles.paymentDateLabel}>Fecha del pago</Text>
                                        <TextInput
                                            value={paymentForm.date}
                                            editable={false}
                                            selectTextOnFocus={false}
                                            style={[styles.input, styles.paymentDateInput]}
                                        />
                                    </View>
                                </View>
                            )
                        }

                        <Pressable style={styles.primaryButton} onPress={handleConfirmPayment} disabled={actionLoading}>
                            <Text style={styles.primaryButtonText}>
                                {actionLoading ? 'Procesando...' : paymentForm.method === 'efectivo' ? 'Descargar factura' : 'Confirmar pago'}
                            </Text>
                        </Pressable>
                    </>
                )}
            </View>

            <View style={styles.sectionCard}>
                <View style={styles.sectionTabs}>
                    <Pressable
                        onPress={() => setReservationView('current')}
                        style={[styles.sectionTab, reservationView === 'current' && styles.sectionTabActive]}
                    >
                        <Text style={reservationView === 'current' ? styles.sectionTabTextActive : styles.sectionTabText}>
                            Reservas registradas
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setReservationView('history')}
                        style={[styles.sectionTab, reservationView === 'history' && styles.sectionTabActive]}
                    >
                        <Text style={reservationView === 'history' ? styles.sectionTabTextActive : styles.sectionTabText}>
                            Historial de reservas
                        </Text>
                    </Pressable>
                </View>

                <Text style={styles.sectionHelper}>
                    {reservationView === 'current'
                        ? 'Aquí quedan las reservas activas y las que están pendientes de pago.'
                        : 'Aquí aparecen las reservas finalizadas o canceladas.'}
                </Text>

                {
                    loading ? (
                        <ActivityIndicator color={COLORS.accent} />
                    ) : reservationView === 'current' && currentReservations.length === 0 ? (
                        <Text style={styles.emptyText}>
                            Todavía no tienes reservas. Crea la primera desde el formulario superior.
                        </Text>
                    ) : reservationView === 'history' && historyReservations.length === 0 ? (
                        <Text style={styles.emptyText}>
                            Aún no tienes reservas en el historial.
                        </Text>
                    ) : (
                        (reservationView === 'current' ? currentReservations : historyReservations).map((reservation) => {
                            return (
                                <View
                                    key={reservation.id}
                                    style={[styles.reservationCard, reservationView === 'history' && styles.reservationCardHistory]}
                                >
                                    <View style={styles.reservationTopRow}>
                                        <View>
                                            <Text style={styles.reservationTitle}>
                                                Habitación {reservation.room?.number ?? reservation.room_id}
                                            </Text>
                                            <Text style={styles.reservationSubtitle}>
                                                {reservation.room?.roomType?.name ?? 'Tipo no disponible'}
                                            </Text>
                                        </View>

                                        <View style={[
                                            styles.statusBadge,
                                            normalizeStatus(reservation.status) === 'activa' && styles.statusActive,
                                            normalizeStatus(reservation.status) === 'finalizada' && styles.statusFinished,
                                            normalizeStatus(reservation.status) === 'cancelada' && styles.statusCanceled,
                                            normalizeStatus(reservation.status) === 'pendiente de pago' && styles.statusFinished
                                        ]}>
                                            <Text style={styles.statusText}>{reservation.status}</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.reservationMeta}>
                                        Entrada: {formatDate(reservation.check_in)}
                                    </Text>
                                    <Text style={styles.reservationMeta}>
                                        Salida: {formatDate(reservation.check_out)}
                                    </Text>
                                    <Text style={styles.reservationMeta}>
                                        Total: ${formatMoney(reservation.total)}
                                    </Text>
                                    <Text style={styles.reservationMeta}>
                                        Acompañantes: {reservation.companions?.length ?? 0} | Pagos: {reservation.payments?.length ?? 0}
                                    </Text>

                                    {reservationView === 'current' && (
                                        <View style={styles.currentActionRow}>
                                            <Pressable
                                                style={styles.smallButton}
                                                onPress={() => handleUpdateStatus('Finalizada')}
                                                disabled={actionLoading}
                                            >
                                                <Text style={styles.smallButtonText}>Finalizar reserva</Text>
                                            </Pressable>
                                        </View>
                                    )}
                                </View>
                            )
                        })
                    )
                }
            </View>

        </ScrollView>
    );
}