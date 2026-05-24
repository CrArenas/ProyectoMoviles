import { StyleSheet } from 'react-native'
import { COLORS, SHADOW } from '../theme'

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    content: {
        padding: 18,
        paddingTop: 28,
        paddingBottom: 32,
        gap: 14
    },
    headerCard: {
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
    headerTitle: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 10
    },
    headerText: {
        color: COLORS.navyText,
        lineHeight: 22,
        fontSize: 14
    },
    metricsRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 18,
        flexWrap: 'wrap'
    },
    metricPill: {
        flexGrow: 1,
        minWidth: '46%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 16
    },
    metricValue: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: '800'
    },
    metricLabel: {
        color: COLORS.navyText,
        marginTop: 2,
        fontWeight: '600'
    },
    sectionCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 24,
        padding: 18,
        ...SHADOW,
        gap: 12
    },
    sectionTabs: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: COLORS.background,
        padding: 6,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    sectionTab: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 14,
        paddingVertical: 11
    },
    sectionTabActive: {
        backgroundColor: COLORS.accent
    },
    sectionTabText: {
        color: COLORS.muted,
        fontWeight: '700',
        fontSize: 13,
        textAlign: 'center'
    },
    sectionTabTextActive: {
        color: COLORS.white,
        fontWeight: '800',
        fontSize: 13,
        textAlign: 'center'
    },
    sectionHelper: {
        color: COLORS.muted,
        fontSize: 13,
        lineHeight: 20
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.text
    },
    flowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        alignItems: 'flex-start'
    },
    stepBadge: {
        backgroundColor: COLORS.accentSoft,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    stepBadgeText: {
        color: COLORS.accent,
        fontSize: 12,
        fontWeight: '800'
    },
    helperText: {
        color: COLORS.muted,
        lineHeight: 21,
        fontSize: 13
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 14,
        color: COLORS.text
    },
    dateButton: {
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 13,
        minHeight: 10,
        justifyContent: 'center',
        marginBottom: 15
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
    disabledInput: {
        backgroundColor: COLORS.background,
        color: COLORS.muted
    },
    roomsBox: {
        gap: 10
    },
    roomCard: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 18,
        padding: 14,
        backgroundColor: COLORS.surface
    },
    roomCardSelected: {
        borderColor: COLORS.accent,
        backgroundColor: COLORS.accentLight
    },
    roomCardHistory: {
        backgroundColor: COLORS.background,
        opacity: 0.95
    },
    roomCardDisabled: {
        opacity: 0.55
    },
    roomCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 10
    },
    roomTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.text
    },
    roomSubtitle: {
        marginTop: 2,
        color: COLORS.muted
    },
    roomMeta: {
        color: COLORS.muted,
        marginTop: 4
    },
    dualRow: {
        flexDirection: 'row',
        gap: 10
    },
    dualInput: {
        flex: 1
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    optionChip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: COLORS.background,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    optionChipActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent
    },
    optionChipText: {
        color: COLORS.text,
        fontWeight: '700',
        textTransform: 'capitalize'
    },
    optionChipTextActive: {
        color: COLORS.white,
        fontWeight: '700',
        textTransform: 'capitalize'
    },
    primaryButton: {
        backgroundColor: COLORS.accent,
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: 'center'
    },
    primaryButtonText: {
        color: COLORS.white,
        fontWeight: '800'
    },
    emptyText: {
        color: COLORS.muted,
        lineHeight: 21
    },
    reservationCard: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 20,
        padding: 16,
        backgroundColor: COLORS.surface
    },
    reservationCardSelected: {
        borderColor: COLORS.accent,
        backgroundColor: COLORS.accentLight
    },
    reservationTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 10
    },
    reservationTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: COLORS.text
    },
    reservationSubtitle: {
        marginTop: 2,
        color: COLORS.muted
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999
    },
    statusActive: {
        backgroundColor: COLORS.successSoft
    },
    statusFinished: {
        backgroundColor: COLORS.accentSoft
    },
    statusCanceled: {
        backgroundColor: COLORS.dangerSoft
    },
    statusText: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.text,
        textTransform: 'capitalize'
    },
    reservationMeta: {
        color: COLORS.muted,
        marginTop: 4
    },
    currentActionRow: {
        marginTop: 12,
        alignItems: 'flex-start'
    },
    detailCard: {
        backgroundColor: COLORS.background,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 8
    },
    detailText: {
        color: COLORS.muted,
        marginTop: 4
    },
    actionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 14
    },
    secondaryActionButton: {
        backgroundColor: COLORS.background,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 14
    },
    secondaryActionButtonText: {
        color: COLORS.text,
        fontWeight: '800'
    },
    summaryBox: {
        backgroundColor: COLORS.background,
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 4
    },
    summaryTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.text,
        marginBottom: 4
    },
    summaryText: {
        color: COLORS.muted,
        lineHeight: 20
    },
    paymentDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    paymentDateLabel: {
        color: COLORS.text,
        fontWeight: '700',
        minWidth: 96
    },
    paymentDateInput: {
        flex: 1,
        backgroundColor: COLORS.background,
        color: COLORS.muted
    },
    smallButton: {
        backgroundColor: COLORS.accent,
        borderRadius: 14,
        paddingVertical: 11,
        paddingHorizontal: 14
    },
    destructiveButton: {
        backgroundColor: COLORS.danger
    },
    smallButtonText: {
        color: COLORS.white,
        fontWeight: '800'
    },
    listBox: {
        backgroundColor: COLORS.background,
        borderRadius: 18,
        padding: 14,
        gap: 10
    },
    listTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.text
    },
    listRow: {
        backgroundColor: COLORS.surface,
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    listRowTitle: {
        fontWeight: '800',
        color: COLORS.text
    },
    listRowSubtitle: {
        marginTop: 3,
        color: COLORS.muted
    },
    inlineDestructiveButton: {
        alignSelf: 'flex-start',
        marginTop: 10,
        backgroundColor: COLORS.dangerSoft,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    inlineDestructiveButtonText: {
        color: COLORS.danger,
        fontWeight: '800',
        fontSize: 12
    }
})