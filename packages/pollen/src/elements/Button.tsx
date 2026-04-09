import { Spinner, Text, XStack, styled, type GetProps } from 'pollen-ui-core'

const ButtonFrame = styled(XStack, {
  name: 'Button',
  role: 'button',
  ai: 'center',
  jc: 'center',
  gap: '$md',
  bg: '$colorPrimary',
  px: '$md',
  py: 12,
  br: '$md',
  borderWidth: 1,
  borderColor: '$colorPrimary',
  cursor: 'pointer',
  userSelect: 'none',
  pressStyle: {
    opacity: 0.85,
    scale: 0.98,
  },
  hoverStyle: {
    opacity: 0.92,
  },

  variants: {
    fullWidth: {
      true: {
        w: '100%',
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        pointerEvents: 'none',
      },
    },
  } as const,
})

export const ButtonText = styled(Text, {
  name: 'ButtonText',
  fontFamily: '$body',
  fontSize: '$md',
  lineHeight: 20,
  fontWeight: '600',
  color: '$colorInverse',
  userSelect: 'none',
})

type ButtonFrameProps = GetProps<typeof ButtonFrame>

interface ButtonProps extends ButtonFrameProps {
  loading?: boolean
}

export const Button = ButtonFrame.styleable<ButtonProps>(
  ({ children, disabled, loading, ...props }, ref) => (
    <ButtonFrame
      ref={ref}
      transition="quick"
      animateOnly={['opacity', 'transform']}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <Spinner color="$colorInverse" />
      ) : typeof children === 'string' ? (
        <ButtonText>{children}</ButtonText>
      ) : (
        children
      )}
    </ButtonFrame>
  ),
)
