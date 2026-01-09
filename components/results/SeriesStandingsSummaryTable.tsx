/**
 * SeriesStandingsSummaryTable - Summary table component for series standings
 *
 * Displays top N standings for a series with rank, name, points, and category
 */

import type { SeriesStandingsResult } from "@/api/raceSeriesPublic";
import { fetchSeriesStandings } from "@/api/raceSeriesPublic";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { capitalizeFirst } from "@/utils/nameUtils";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

interface SeriesStandingsSummaryTableProps {
  /**
   * The series ID to fetch standings for
   */
  seriesId: string;
  /**
   * Sex category ID filter (1 = female, 2 = male, 3 = other)
   */
  sexCategoryId?: number;
  /**
   * Maximum number of results to display (default: 3)
   */
  maxResults?: number;
  /**
   * Whether to show the category column (default: false)
   */
  showCategory?: boolean;
}

/**
 * Format points for display, handling null values
 */
function formatPoints(points: number | null): string {
  if (points === null || points === undefined) return "-";
  return points.toFixed(1);
}

/**
 * Responsive summary table to display top series standings.
 * Shows rank, athlete name, points, and category information.
 */
export function SeriesStandingsSummaryTable({
  seriesId,
  sexCategoryId,
  maxResults = 3,
  showCategory: showCategoryProp = false,
}: SeriesStandingsSummaryTableProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];
  const { width } = useWindowDimensions();

  const [standings, setStandings] = useState<SeriesStandingsResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch standings on component mount or when props change
  useEffect(() => {
    async function loadStandings() {
      if (!seriesId) return;

      try {
        setLoading(true);
        setError(null);

        const result = await fetchSeriesStandings(
          seriesId,
          0,
          maxResults,
          undefined,
          sexCategoryId,
          "rank",
          "asc"
        );

        setStandings(result.data);
      } catch (err) {
        console.error("Error loading series standings:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load standings"
        );
      } finally {
        setLoading(false);
      }
    }

    loadStandings();
  }, [seriesId, sexCategoryId, maxResults]);

  // Show loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.text} />
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      </View>
    );
  }

  // Show empty state
  if (standings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.subText }]}>
          No standings available
        </Text>
      </View>
    );
  }

  // Calculate responsive widths
  const containerMaxWidth = Math.min(width - 32, 1000);
  // Show category column based on prop (if enabled) and screen width
  const showCategory = showCategoryProp && containerMaxWidth > 600;

  // Column widths
  const rankWidth = 70;
  const pointsWidth = 90;
  const categoryWidth = showCategory ? 100 : 0;
  const fixedWidths = rankWidth + pointsWidth + categoryWidth;
  const nameWidth = containerMaxWidth - fixedWidths;

  const borderColor = colors.border;
  const headerBg = colors.tableHeader;
  const textColor = colors.text;
  const subTextColor = colors.subText;

  return (
    <View style={[styles.container, { maxWidth: containerMaxWidth }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.headerRow, { backgroundColor: headerBg }]}>
            <Text
              style={[
                styles.headerCell,
                { color: textColor, borderColor, width: rankWidth },
              ]}
            >
              Rank
            </Text>
            <Text
              style={[
                styles.headerCell,
                { color: textColor, borderColor, width: nameWidth },
              ]}
            >
              Name
            </Text>
            <Text
              style={[
                styles.headerCell,
                { color: textColor, borderColor, width: pointsWidth },
              ]}
            >
              Points
            </Text>
            {showCategory && (
              <Text
                style={[
                  styles.headerCell,
                  { color: textColor, borderColor, width: categoryWidth },
                ]}
              >
                Category
              </Text>
            )}
          </View>

          {/* Table Body */}
          {standings.map((standing, index) => (
            <View
              key={standing.id}
              style={[
                styles.row,
                index % 2 === 1 && {
                  backgroundColor: colors.tableRowAlt,
                },
              ]}
            >
              {/* Rank */}
              <View style={[styles.cell, { borderColor, width: rankWidth }]}>
                <Text style={[styles.centerText, { color: textColor }]}>
                  {standing.rank ?? "-"}
                </Text>
              </View>

              {/* Name */}
              <View style={[styles.cell, { borderColor, width: nameWidth }]}>
                <Link
                  href={`/series/${seriesId}/standings/${standing.series_participant_id}`}
                  asChild
                >
                  <Pressable>
                    <Text
                      style={[
                        styles.nameText,
                        styles.linkText,
                        { color: colors.link },
                      ]}
                    >
                      {standing.first_name} {standing.last_name}
                    </Text>
                  </Pressable>
                </Link>
              </View>

              {/* Points */}
              <View style={[styles.cell, { borderColor, width: pointsWidth }]}>
                <Text style={[styles.centerText, { color: textColor }]}>
                  {formatPoints(standing.total_points)}
                </Text>
              </View>

              {/* Category (if space allows) */}
              {showCategory && (
                <View
                  style={[styles.cell, { borderColor, width: categoryWidth }]}
                >
                  <Text style={[styles.categoryText, { color: subTextColor }]}>
                    {capitalizeFirst(standing.sex_category_name || "") || "-"}
                  </Text>
                  {standing.age_category_name && (
                    <Text
                      style={[styles.categoryText, { color: subTextColor }]}
                    >
                      {standing.age_category_name}
                    </Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "100%",
    alignSelf: "center",
  },
  table: {
    borderRadius: 8,
    overflow: "hidden",
    minWidth: "100%",
  },
  headerRow: {
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
  },
  headerCell: {
    padding: 12,
    fontWeight: "600",
    fontSize: 14,
    borderBottomWidth: 2,
    borderRightWidth: 1,
  },
  cell: {
    padding: 12,
    fontSize: 14,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  centerText: {
    textAlign: "center",
  },
  nameText: {
    fontSize: 14,
  },
  linkText: {
    textDecorationLine: "underline",
  },
  categoryText: {
    fontSize: 12,
    lineHeight: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});
