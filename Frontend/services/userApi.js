import api from './api'

export const getReservations = async () => {
    const response = await api.get('reservations')

    return response.data
}

export const getRooms = async () => {
    const response = await api.get('rooms')

    return response.data
}

export const createReservation = async (payload) => {
    const response = await api.post('reservations', payload)

    return response.data
}

export const updateReservation = async (id, payload) => {
    const response = await api.put(`reservations/${id}`, payload)

    return response.data
}

export const deleteReservation = async (id) => {
    const response = await api.delete(`reservations/${id}`)

    return response.data
}

export const createCompanion = async (payload) => {
    const response = await api.post('companions', payload)

    return response.data
}

export const updateCompanion = async (id, payload) => {
    const response = await api.put(`companions/${id}`, payload)

    return response.data
}

export const deleteCompanion = async (id) => {
    const response = await api.delete(`companions/${id}`)

    return response.data
}

export const createPayment = async (payload) => {
    const response = await api.post('payments', payload)

    return response.data
}