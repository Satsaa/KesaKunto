import type { ReactNode } from 'react'
import { Text, YStack } from 'pollen'

interface SectionProps {
  title: string
  children: ReactNode
}

export function Section({ children, title }: SectionProps) {
  return (
    <YStack
      gap="$md"
      bg="$backgroundStrong"
      p="$md"
      br="$md"
      borderWidth={1}
      borderColor="$borderColor"
    >
      <Text fontFamily="$heading" fontSize={22} lineHeight={28} fontWeight="700">
        {title}
      </Text>
      {children}
    </YStack>
  )
}
