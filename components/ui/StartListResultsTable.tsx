import type { RaceStartListResultWithCategories } from "@/api/results";
import { capitalizeFirst, getFullName } from "@/utils/nameUtils";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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
  results: RaceStartListResultWithCategories[];
  isUpcoming: boolean;
  isDark?: boolean;
}

/**
 * Table component to display race start list or results
 */
export function StartListResultsTable({
  results,
  isUpcoming,
  isDark = false,
}: StartListResultsTableProps) {
  if (results.length === 0) {
    return null;
  }

  const borderColor = isDark ? "#333333" : "#e0e0e0";
  const headerBg = isDark ? "#1a1a1a" : "#f5f5f5";
  const textColor = isDark ? "#ffffff" : "#000000";
  const subTextColor = isDark ? "#cccccc" : "#666666";

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.headerRow, { backgroundColor: headerBg }]}>
            {!isUpcoming && (
              <Text
                style={[
                  styles.headerCell,
                  styles.positionCell,
                  { color: textColor, borderColor },
                ]}
              >
                Position
              </Text>
            )}
            <Text
              style={[
                styles.headerCell,
                styles.bibCell,
                { color: textColor, borderColor },
              ]}
            >
              Race #
            </Text>
            <Text
              style={[
                styles.headerCell,
                styles.nameCell,
                { color: textColor, borderColor },
              ]}
            >
              Athlete
            </Text>
            <Text
              style={[
                styles.headerCell,
                styles.categoryCell,
                { color: textColor, borderColor },
              ]}
            >
              Category
            </Text>
            {!isUpcoming && (
              <Text
                style={[
                  styles.headerCell,
                  styles.timeCell,
                  { color: textColor, borderColor },
                ]}
              >
                Finish Time
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
                    styles.positionCell,
                    { color: textColor, borderColor },
                  ]}
                >
                  {result.position || "-"}
                </Text>
              )}
              <Text
                style={[
                  styles.cell,
                  styles.bibCell,
                  { color: textColor, borderColor },
                ]}
              >
                {result.race_number || "-"}
              </Text>
              <View
                style={[
                  styles.cell,
                  styles.nameCell,
                  { borderColor },
                ]}
              >
                <Text style={[styles.nameText, { color: textColor }]}>
                  {getFullName(result.first_name, result.last_name) || "Unknown"}
                </Text>
              </View>
              <View
                style={[
                  styles.cell,
                  styles.categoryCell,
                  { borderColor },
                ]}
              >
                <Text style={[styles.categoryText, { color: subTextColor }]}>
                  {capitalizeFirst(result.sex_category?.name) || "-"}
                </Text>
                {result.age_category?.name && (
                  <Text style={[styles.categorySubText, { color: subTextColor }]}>
                    {result.age_category.name}
                  </Text>
                )}
              </View>
              {!isUpcoming && (
                <Text
                  style={[
                    styles.cell,
                    styles.timeCell,
                    { color: textColor, borderColor },
                  ]}
                >
                  {result.finish_time100
                    ? formatTime(result.finish_time100)
                    : "-"}
                </Text>
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
  positionCell: {
    width: 80,
    textAlign: "center",
  },
  bibCell: {
    width: 80,
    textAlign: "center",
  },
  nameCell: {
    width: 200,
    minWidth: 200,
  },
  nameText: {
    fontSize: 14,
  },
  categoryCell: {
    width: 120,
  },
  categoryText: {
    fontSize: 12,
    textAlign: "center",
  },
  categorySubText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
  timeCell: {
    width: 120,
    textAlign: "center",
  },
});
