import { createMedia, createTamagui } from 'tamagui'
import { animations } from './animations'
import { bodyFont, headingFont } from './fonts'
import { themes } from './themes'
import { tokens } from './tokens'

const media = createMedia({
  mobile: { maxWidth: 767 },
  gtMobile: { minWidth: 768 },
})

export const config = createTamagui({
  tokens,
  themes,
  media,
  animations,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  settings: {
    allowedStyleValues: 'somewhat-strict-web',
    autocomplete: 'on',
  },
  shorthands: {
    p: 'padding',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    m: 'margin',
    mt: 'marginTop',
    mb: 'marginBottom',
    w: 'width',
    h: 'height',
    bg: 'backgroundColor',
    br: 'borderRadius',
    bw: 'borderWidth',
    bc: 'borderColor',
    f: 'flex',
    ai: 'alignItems',
    jc: 'justifyContent',
    fd: 'flexDirection',
    fw: 'flexWrap',
    gap: 'gap',
  } as const,
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
