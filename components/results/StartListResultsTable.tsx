/**
 * StartListResultsTable - Responsive table component for race results
 *
 * This is an improved version of StartListResultsTable with responsive design.
 * Test this component at app/events/[id]/test1.tsx
 */

import type { RaceStartListResultWithCategories } from "@/api/results";
import { Colors } from "@/constants/theme";
import { formatRacePosition, isSpecialPosition } from "@/constants/raceTypes";
import { capitalizeFirst, getNameWithRaceNumber } from "@/utils/nameUtils";
import { getTeamOrder } from "@/utils/relayRaceUtils";
import { Link } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

/**
 * Format position for display based on position type
 */
function formatPositionForDisplay(
  result: RaceStartListResultWithCategories,
  positionType: "overall" | "age" | "sex"
): string {
  let position: number | null | undefined;
  
  switch (positionType) {
    case "age":
      position = result.age_category_position;
      break;
    case "sex":
      position = result.sex_category_position;
      break;
    default:
      position = result.position;
      break;
  }
  
  // Handle null/undefined positions
  if (position === null || position === undefined) {
    return "-";
  }
  
  // Format special positions (negative numbers) using the formatRacePosition function
  if (isSpecialPosition(position)) {
    return formatRacePosition(position);
  }
  
  // For regular positions, just return the number as string
  return position.toString();
}

/**
 * Sort results to put special positions (DNS, DNF, DQ) at the bottom
 */
function sortResultsWithSpecialPositions(
  results: RaceStartListResultWithCategories[],
  positionType: "overall" | "age" | "sex"
): RaceStartListResultWithCategories[] {
  return [...results].sort((a, b) => {
    let positionA: number | null | undefined;
    let positionB: number | null | undefined;
    
    switch (positionType) {
      case "age":
        positionA = a.age_category_position;
        positionB = b.age_category_position;
        break;
      case "sex":
        positionA = a.sex_category_position;
        positionB = b.sex_category_position;
        break;
      default:
        positionA = a.position;
        positionB = b.position;
        break;
    }
    
    // Handle null/undefined positions
    if (positionA == null && positionB == null) return 0;
    if (positionA == null) return 1;
    if (positionB == null) return -1;
    
    const isSpecialA = isSpecialPosition(positionA);
    const isSpecialB = isSpecialPosition(positionB);
    
    // If both are special or both are regular, sort normally
    if (isSpecialA === isSpecialB) {
      return positionA - positionB;
    }
    
    // Special positions go to the bottom
    return isSpecialA ? 1 : -1;
  });
}

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

interface StartListResultsTableProps {
  eventId: string;
  results: RaceStartListResultWithCategories[];
  isUpcoming: boolean;
  isDark?: boolean;
  showTeamOrder?: boolean;
  isRelay?: boolean;
  positionType?: "overall" | "age" | "sex";
}

/**
 * Responsive table component to display race start list or results.
 * Uses responsive width calculations to adapt from desktop (~1000px) to mobile widths.
 * Automatically hides the category column on narrow screens (< 600px) for better mobile display.
 */
export function StartListResultsTable({
  eventId,
  results,
  isUpcoming,
  isDark = false,
  showTeamOrder = false,
  isRelay = false,
  positionType = "overall",
}: StartListResultsTableProps) {
  const { width } = useWindowDimensions();

  if (results.length === 0) {
    return null;
  }

  // Sort results to put special positions at bottom (only for completed races)
  const sortedResults = !isUpcoming 
    ? sortResultsWithSpecialPositions(results, positionType)
    : results;

  // Calculate responsive widths
  // Max width is 1000, but adapt to screen width
  const containerMaxWidth = Math.min(width - 32, 1000);

  // Determine if we should show category column based on screen width
  const showCategory = containerMaxWidth > 600;

  // Calculate column widths
  const positionWidth = isUpcoming ? 0 : 90;
  const teamOrderWidth = showTeamOrder ? 70 : 0;
  const timeWidth = isUpcoming ? 0 : 80;
  const categoryWidth = showCategory ? 90 : 0;

  // Athlete column gets remaining space
  const fixedWidths =
    positionWidth + teamOrderWidth + timeWidth + categoryWidth;
  const athleteWidth = containerMaxWidth - fixedWidths;

  const colors = Colors[isDark ? "dark" : "light"];
  const borderColor = colors.border;
  const headerBg = colors.tableHeader;
  const textColor = colors.text;
  const subTextColor = colors.subText;
  const linkColor = colors.link;

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
                {positionType === "age"
                  ? "Category Position"
                  : positionType === "sex"
                  ? "Category Position"
                  : "Position"}
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
                {isRelay ? "Net Time" : "Finish Time"}
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
          {sortedResults.map((result, index) => (
            <View
              key={result.id}
              style={[
                styles.row,
                index % 2 === 1 && {
                  backgroundColor: colors.tableRowAlt,
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
                  {formatPositionForDisplay(result, positionType)}
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
                  {getTeamOrder(result, sortedResults) || "-"}
                </Text>
              )}
              <View style={[styles.cell, { borderColor, width: athleteWidth }]}>
                <Link
                  href={`/events/${eventId}/individuals/${result.id}`}
                  asChild
                >
                  <Pressable>
                    <Text
                      style={[
                        styles.nameText,
                        {
                          color: linkColor,
                          textDecorationLine: "underline",
                        },
                      ]}
                    >
                      {getNameWithRaceNumber(
                        result.first_name,
                        result.last_name,
                        result.race_number
                      ) || "Unknown"}
                    </Text>
                  </Pressable>
                </Link>
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
                  {isRelay
                    ? result.net_finish_time100
                      ? formatTime(result.net_finish_time100)
                      : "-"
                    : result.finish_time100
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
