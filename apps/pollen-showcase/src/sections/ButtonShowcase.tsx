import { useState } from 'react'
import { Button, ButtonText, Text, XStack, YStack } from 'pollen'
import { Section } from '../Section'

export function ButtonShowcase() {
  const [loading, setLoading] = useState(false)

  async function runLoadingDemo() {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setLoading(false)
  }

  return (
    <Section title="Button">
      <YStack gap="$md">
        <Text>The button surface is one base style. Differences should come from layout and composition, not variants.</Text>

        <XStack gap="$md" fw="wrap">
          <Button>
            <ButtonText>Default action</ButtonText>
          </Button>
          <Button loading={loading} onPress={runLoadingDemo}>
            <ButtonText>{loading ? 'Working' : 'Loading demo'}</ButtonText>
          </Button>
        </XStack>

        <Button fullWidth>
          <ButtonText>Full width action</ButtonText>
        </Button>
      </YStack>
    </Section>
  )
}
