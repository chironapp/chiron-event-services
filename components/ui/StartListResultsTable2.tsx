/**
 * StartListResultsTable2 - Responsive table component for race results
 *
 * This is an improved version of StartListResultsTable with responsive design.
 * Test this component at app/events/[id]/test1.tsx
 */

import type { RaceStartListResultWithCategories } from "@/api/results";
import { capitalizeFirst, getNameWithRaceNumber } from "@/utils/nameUtils";
import { getTeamOrder } from "@/utils/relayRaceUtils";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

/**
 * Format time from centiseconds to readable format (HH:MM:SS or MM:SS)
 */
function formatTime(centiseconds: number | null): string {
  if (!centiseconds) return "-";

  const totalSeconds = Math.floor(centiseconds / 100);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

interface StartListResultsTable2Props {
  results: RaceStartListResultWithCategories[];
  isUpcoming: boolean;
  isDark?: boolean;
  showTeamOrder?: boolean;
}

/**
 * Responsive table component to display race start list or results.
 * Uses responsive width calculations to adapt from desktop (~1000px) to mobile widths.
 * Automatically hides the category column on narrow screens (< 600px) for better mobile display.
 */
export function StartListResultsTable2({
  results,
  isUpcoming,
  isDark = false,
  showTeamOrder = false,
}: StartListResultsTable2Props) {
  const { width } = useWindowDimensions();

  if (results.length === 0) {
    return null;
  }

  // Calculate responsive widths
  // Max width is 1000, but adapt to screen width
  const containerMaxWidth = Math.min(width - 32, 1000);

  // Determine if we should show category column based on screen width
  const showCategory = containerMaxWidth > 600;

  // Calculate column widths
  const positionWidth = isUpcoming ? 0 : 80;
  const teamOrderWidth = showTeamOrder ? 80 : 0;
  const timeWidth = isUpcoming ? 0 : 90;
  const categoryWidth = showCategory ? 90 : 0;

  // Athlete column gets remaining space
  const fixedWidths =
    positionWidth + teamOrderWidth + timeWidth + categoryWidth;
  const athleteWidth = containerMaxWidth - fixedWidths;

  const borderColor = isDark ? "#333333" : "#e0e0e0";
  const headerBg = isDark ? "#1a1a1a" : "#f5f5f5";
  const textColor = isDark ? "#ffffff" : "#000000";
  const subTextColor = isDark ? "#cccccc" : "#666666";

  return (
    <View style={[styles.container, { maxWidth: containerMaxWidth }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.headerRow, { backgroundColor: headerBg }]}>
            {!isUpcoming && (
              <Text
                style={[
                  styles.headerCell,
                  { color: textColor, borderColor, width: positionWidth },
                ]}
              >
                Position
              </Text>
            )}
            {showTeamOrder && (
              <Text
                style={[
                  styles.headerCell,
                  { color: textColor, borderColor, width: teamOrderWidth },
                ]}
              >
                Team Order
              </Text>
            )}
            <Text
              style={[
                styles.headerCell,
                { color: textColor, borderColor, width: athleteWidth },
              ]}
            >
              Athlete
            </Text>
            {!isUpcoming && (
              <Text
                style={[
                  styles.headerCell,
                  { color: textColor, borderColor, width: timeWidth },
                ]}
              >
                Finish Time
              </Text>
            )}
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
          {results.map((result, index) => (
            <View
              key={result.id}
              style={[
                styles.row,
                index % 2 === 1 && {
                  backgroundColor: isDark ? "#0a0a0a" : "#fafafa",
                },
              ]}
            >
              {!isUpcoming && (
                <Text
                  style={[
                    styles.cell,
                    styles.centerText,
                    { color: textColor, borderColor, width: positionWidth },
                  ]}
                >
                  {result.position || "-"}
                </Text>
              )}
              {showTeamOrder && (
                <Text
                  style={[
                    styles.cell,
                    styles.centerText,
                    { color: textColor, borderColor, width: teamOrderWidth },
                  ]}
                >
                  {getTeamOrder(result, results) || "-"}
                </Text>
              )}
              <View style={[styles.cell, { borderColor, width: athleteWidth }]}>
                <Text style={[styles.nameText, { color: textColor }]}>
                  {getNameWithRaceNumber(
                    result.first_name,
                    result.last_name,
                    result.race_number
                  ) || "Unknown"}
                </Text>
                {result.team?.name && (
                  <Text style={[styles.teamText, { color: subTextColor }]}>
                    {result.team.name}
                  </Text>
                )}
              </View>
              {!isUpcoming && (
                <Text
                  style={[
                    styles.cell,
                    styles.centerText,
                    { color: textColor, borderColor, width: timeWidth },
                  ]}
                >
                  {result.finish_time100
                    ? formatTime(result.finish_time100)
                    : "-"}
                </Text>
              )}
              {showCategory && (
                <View
                  style={[styles.cell, { borderColor, width: categoryWidth }]}
                >
                  <Text style={[styles.categoryText, { color: subTextColor }]}>
                    {capitalizeFirst(result.sex_category?.name || "") || "-"}
                  </Text>
                  {result.age_category?.name && (
                    <Text
                      style={[styles.categoryText, { color: subTextColor }]}
                    >
                      {result.age_category.name}
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
    marginVertical: 16,
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
  teamText: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.7,
  },
  categoryText: {
    fontSize: 12,
    lineHeight: 16,
  },
});
