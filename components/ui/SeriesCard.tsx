import { SPORT_TYPE_LABELS } from "@/constants/raceTypes";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { PublicRaceEventSeries } from "@/types/race";
import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SeriesCardProps {
  /**
   * The series data to display
   */
  series: PublicRaceEventSeries;
}

/**
 * Reusable series card component for displaying series information
 *
 * @example
 * ```tsx
 * <SeriesCard series={seriesData} />
 * ```
 */
export default function SeriesCard({ series }: SeriesCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  // Get sport type label
  const sportLabel = SPORT_TYPE_LABELS[series.sport_type] || "Other";

  return (
    <View style={styles.cardWrapper}>
      <Link href={`/series/${series.id}`} asChild>
        <Pressable
          style={({ pressed }) => [
            styles.seriesCard,
            {
              backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
              borderColor: colors.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          {/* Series Title */}
          <View style={styles.seriesHeader}>
            <Text
              style={[styles.seriesTitle, { color: colors.text }]}
              numberOfLines={2}
            >
              {series.title}
            </Text>
          </View>

          {/* Series Sport Type */}
          <View style={styles.seriesMetadata}>
            <Text style={[styles.sportType, { color: colors.subText }]}>
              {sportLabel}
            </Text>
          </View>

          {/* Series Description */}
          {series.description && (
            <Text
              style={[styles.description, { color: colors.secondaryText }]}
              numberOfLines={2}
            >
              {series.description}
            </Text>
          )}
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 24,
  },
  seriesCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  seriesHeader: {
    marginBottom: 8,
  },
  seriesTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  seriesMetadata: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sportType: {
    fontSize: 14,
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});
