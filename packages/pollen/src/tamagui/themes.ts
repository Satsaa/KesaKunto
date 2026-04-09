import { palette } from './tokens'

const baseTheme = {
  background: palette.cloud,
  backgroundSoft: palette.blueSoft,
  backgroundStrong: palette.white,
  color: palette.ink,
  colorMuted: palette.slate,
  colorInverse: palette.white,
  borderColor: palette.mist,
  colorPrimary: palette.blue,
}

export const light = {
  ...baseTheme,
}

export const dark = {
  ...baseTheme,
}

export const themes = {
  light,
  dark,
} as const
