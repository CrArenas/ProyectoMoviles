import { COLORS, SHADOW } from '../theme'

export const loadingScreen = {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
}

export const loadingCard = {
    backgroundColor: COLORS.surface,
    padding: 22,
    borderRadius: 24,
    ...SHADOW
}

export const loadingText = {
    marginTop: 12,
    color: COLORS.text,
    fontWeight: '700'
}

export const containerStyle = {
    flex: 1,
    backgroundColor: COLORS.background
}

export const createTabBarStyle = (bottomInset = 0) => ({
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    height: 62 + bottomInset,
    paddingBottom: bottomInset + 8,
    paddingTop: 8
})