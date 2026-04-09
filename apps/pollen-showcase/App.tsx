import { StatusBar } from 'expo-status-bar'
import {
  Button,
  ButtonText,
  config,
  ScrollView,
  Separator,
  TamaguiProvider,
  Text,
  Theme,
  XStack,
  YStack,
} from 'pollen'
import { Section } from './src/Section'
import { ButtonShowcase } from './src/sections/ButtonShowcase'
import { TextShowcase } from './src/sections/TextShowcase'

function ShowcaseScreen() {
  return (
    <Theme name="light">
      <YStack f={1} bg="$background">
        <ScrollView
          f={1}
          contentContainerStyle={{
            padding: 24,
            gap: 24,
          }}
        >
          <YStack
            gap="$md"
            bg="$backgroundStrong"
            p="$md"
            br="$md"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text fontFamily="$heading" fontSize={32} lineHeight={38} fontWeight="700">
              Pollen
            </Text>
            <Text color="$colorMuted">
              Minimal Tamagui foundation for the next cross-platform app baseline.
            </Text>
            <Button>
              <ButtonText>Base button</ButtonText>
            </Button>
          </YStack>

          <Section title="Foundation">
            <Text>
              Pollen now exposes only a base button, a base text component, and Tamagui
              primitives. Any extra hierarchy is created with plain style props.
            </Text>
          </Section>

          <ButtonShowcase />

          <Separator borderColor="$borderColor" />

          <TextShowcase />
        </ScrollView>
      </YStack>
    </Theme>
  )
}

export default function App() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <ShowcaseScreen />
      <StatusBar style="auto" />
    </TamaguiProvider>
  )
}
