import { createFont } from 'tamagui'

const systemFont =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'

export const headingFont = createFont({
  family: systemFont,
  size: {
    md: 16,
  },
  lineHeight: {
    md: 24,
  },
  weight: {
    md: '600',
  },
  letterSpacing: {
    md: 0,
  },
})

export const bodyFont = createFont({
  family: systemFont,
  size: {
    md: 16,
  },
  lineHeight: {
    md: 24,
  },
  weight: {
    md: '400',
  },
  letterSpacing: {
    md: 0,
  },
})
