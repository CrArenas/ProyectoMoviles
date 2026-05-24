import { StyleSheet } from 'react-native'
import { COLORS, SHADOW } from '../theme'

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    content: {
        padding: 18,
        paddingBottom: 28,
        gap: 14
    },
    heroCard: {
        backgroundColor: COLORS.panel,
        borderRadius: 28,
        padding: 22,
        ...SHADOW
    },
    kicker: {
        color: COLORS.highlight,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        fontSize: 12,
        marginBottom: 8
    },
    heroTitle: {
        color: COLORS.white,
        fontSize: 30,
        fontWeight: '800',
        marginBottom: 10
    },
    heroText: {
        color: COLORS.navyText,
        fontSize: 15,
        lineHeight: 22
    },
    heroActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 18,
        flexWrap: 'wrap'
    },
    primaryButton: {
        backgroundColor: COLORS.accent,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16
    },
    primaryButtonText: {
        color: COLORS.white,
        fontWeight: '800'
    },
    secondaryButton: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16
    },
    secondaryButtonText: {
        color: COLORS.white,
        fontWeight: '700'
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12
    },
    statCard: {
        flexGrow: 1,
        minWidth: '47%',
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 16,
        ...SHADOW
    },
    statValue: {
        fontSize: 26,
        fontWeight: '800',
        color: COLORS.accent
    },
    statLabel: {
        marginTop: 4,
        color: COLORS.muted,
        fontSize: 13,
        fontWeight: '600'
    },
    sectionCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        padding: 18,
        ...SHADOW,
        gap: 10
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 12
    },
    nextReservationCard: {
        backgroundColor: COLORS.accentLight,
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.accentSoft
    },
    nextReservationTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 4
    },
    nextReservationMeta: {
        color: '#334155',
        fontSize: 14,
        marginTop: 3
    },
    paragraph: {
        color: COLORS.muted,
        fontSize: 14,
        lineHeight: 21,
        marginBottom: 10
    },
    emptyText: {
        color: COLORS.muted,
        lineHeight: 21
    }
})