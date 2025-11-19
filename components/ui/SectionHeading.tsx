import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text } from "react-native";

interface SectionHeadingProps {
  /**
   * The heading text to display
   */
  children: string;
}

/**
 * Reusable section heading component with consistent styling and theme support
 *
 * @example
 * ```tsx
 * <SectionHeading>Results</SectionHeading>
 * <SectionHeading>Team Results</SectionHeading>
 * ```
 */
export default function SectionHeading({ children }: SectionHeadingProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <Text style={[styles.sectionHeading, { color: colors.text }]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  sectionHeading: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 8,
  },
});
