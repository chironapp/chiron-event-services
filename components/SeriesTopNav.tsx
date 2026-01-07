import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SeriesTopNavProps {
  /**
   * The name of the series to display
   */
  seriesName: string;
  /**
   * The series ID for linking to the series details page
   */
  seriesId: string;
}

/**
 * Top navigation component for series details screen with series name
 *
 * @example
 * ```tsx
 * <SeriesTopNav
 *   seriesName="Summer Trail Series 2024"
 *   seriesId="123"
 * />
 * ```
 */
export default function SeriesTopNav({
  seriesName,
  seriesId,
}: SeriesTopNavProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        <Link href={`/series/${seriesId}`} asChild>
          <Pressable>
            <Text
              style={[styles.seriesInfo, { color: colors.text }]}
              numberOfLines={1}
            >
              {seriesName}
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  seriesInfo: {
    fontSize: 16,
    fontWeight: "600",
  },
});
