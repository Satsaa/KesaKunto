import { createTokens } from 'tamagui'

export const palette = {
  ink: '#1f2328',
  slate: '#59636e',
  mist: '#d0d7de',
  cloud: '#f6f8fa',
  white: '#ffffff',
  blue: '#1f6feb',
  blueSoft: '#eaf2ff',
} as const

export const tokens = createTokens({
  space: {
    md: 16,
    true: 16,
  },
  size: {
    md: 16,
    true: 16,
  },
  radius: {
    md: 10,
    true: 10,
  },
  zIndex: {
    md: 10,
    true: 10,
  },
  color: palette,
})
