import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface NoResultsFoundProps {
  /**
   * Custom title text
   * @default "No Results Found"
   */
  title?: string;
  /**
   * Custom message text
   * @default "Try adjusting your search or check back later for new events."
   */
  message?: string;
  /**
   * Additional styles for the container
   */
  containerStyle?: any;
}

/**
 * Component to display when no search results or events are found
 *
 * @example
 * ```tsx
 * <NoResultsFound />
 * <NoResultsFound
 *   title="No Events Found"
 *   message="There are no upcoming events at this time."
 * />
 * ```
 */
export default function NoResultsFound({
  title = "No Results Found",
  message = "Try adjusting your search or check back later for new events.",
  containerStyle,
}: NoResultsFoundProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🔍</Text>
      </View>

      <Text
        style={[
          styles.title,
          { color: isDark ? Colors.dark.text : Colors.light.text },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          styles.message,
          { color: isDark ? Colors.dark.icon : Colors.light.icon },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
    opacity: 0.6,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
});
