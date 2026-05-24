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
        letterSpacing: 1.1,
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
        lineHeight: 22,
        fontSize: 14
    },
    heroActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 18
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
        color: COLORS.text
    },
    infoRow: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
    },
    infoLabel: {
        color: COLORS.muted,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 4
    },
    infoValue: {
        color: COLORS.text,
        fontWeight: '700',
        fontSize: 15
    },
    summaryGrid: {
        flexDirection: 'row',
        gap: 12
    },
    summaryCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 18,
        ...SHADOW
    },
    summaryValue: {
        color: COLORS.accent,
        fontSize: 26,
        fontWeight: '800'
    },
    summaryLabel: {
        marginTop: 4,
        color: COLORS.muted,
        fontWeight: '600'
    },
    paragraph: {
        color: COLORS.muted,
        lineHeight: 22,
        fontSize: 14
    }
})