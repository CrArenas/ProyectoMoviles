import { StyleSheet } from 'react-native'
import { COLORS, SHADOW } from '../theme'

export default StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: COLORS.background,
        padding: 20,
        justifyContent: 'center',
        gap: 16
    },
    heroCard: {
        backgroundColor: COLORS.panel,
        borderRadius: 28,
        padding: 24,
        ...SHADOW
    },
    kicker: {
        color: COLORS.highlight,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        fontSize: 12,
        marginBottom: 8,
        fontWeight: '700'
    },
    heroTitle: {
        color: COLORS.white,
        fontSize: 30,
        lineHeight: 36,
        fontWeight: '800',
        marginBottom: 12
    },
    heroText: {
        color: COLORS.navyText,
        lineHeight: 22,
        fontSize: 14
    },
    formCard: {
        backgroundColor: COLORS.surfaceTint,
        borderRadius: 28,
        padding: 22,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.75)',
        ...SHADOW
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 6
    },
    sectionText: {
        color: COLORS.muted,
        marginBottom: 18,
        lineHeight: 20
    },
    dualRow: {
        flexDirection: 'row',
        gap: 10
    },
    dualInput: {
        flex: 1
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 15,
        color: COLORS.text,
        marginBottom: 12
    },
    dateButton: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 14,
        marginBottom: 12
    },
    dateButtonText: {
        color: COLORS.text,
        fontSize: 15,
        fontWeight: '600'
    },
    dateButtonPlaceholder: {
        color: COLORS.muted,
        fontWeight: '500'
    },
    primaryButton: {
        backgroundColor: COLORS.accent,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 4
    },
    buttonDisabled: {
        opacity: 0.7
    },
    primaryButtonText: {
        color: COLORS.white,
        fontWeight: '800',
        fontSize: 15
    },
    linkButton: {
        marginTop: 18,
        alignItems: 'center'
    },
    linkText: {
        color: COLORS.accent,
        fontWeight: '700'
    }
})