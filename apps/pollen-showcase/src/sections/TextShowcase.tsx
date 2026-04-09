import { Text, YStack } from 'pollen'
import { Section } from '../Section'

export function TextShowcase() {
  return (
    <Section title="Text">
      <YStack gap="$md">
        <Text fontFamily="$heading" fontSize={28} lineHeight={34} fontWeight="700">
          Heading built with style props
        </Text>
        <Text>
          The base text component keeps typography simple. Specific hierarchy now comes
          from direct Tamagui props instead of a growing preset system.
        </Text>
        <Text color="$colorMuted">
          Muted copy is still available through theme values, without adding text-specific
          tone variants.
        </Text>
      </YStack>
    </Section>
  )
}
