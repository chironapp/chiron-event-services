import type { RaceStartListResultWithCategories } from "@/api/results";
import { formatTime } from "@/utils/dateUtils";
import { capitalizeFirst, getNameWithRaceNumber } from "@/utils/nameUtils";
import { getTeamOrder } from "@/utils/relayRaceUtils";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";


interface StartListResultsTableProps {
  results: RaceStartListResultWithCategories[];
  isUpcoming: boolean;
  isDark?: boolean;
  showTeamOrder?: boolean;
}

/**
 * Table component to display race start list or results
 */
export function StartListResultsTable({
  results,
  isUpcoming,
  isDark = false,
  showTeamOrder = false,
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
            {showTeamOrder && (
              <Text
                style={[
                  styles.headerCell,
                  styles.teamOrderCell,
                  { color: textColor, borderColor },
                ]}
              >
                Team Order
              </Text>
            )}
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
              {showTeamOrder && (
                <Text
                  style={[
                    styles.cell,
                    styles.teamOrderCell,
                    { color: textColor, borderColor },
                  ]}
                >
                  {getTeamOrder(result, results) || "-"}
                </Text>
              )}
              <View style={[styles.cell, styles.nameCell, { borderColor }]}>
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
              <View style={[styles.cell, styles.categoryCell, { borderColor }]}>
                <Text style={[styles.categoryText, { color: subTextColor }]}>
                  {capitalizeFirst(result.sex_category?.name || "") || "-"}
                </Text>
                {result.age_category?.name && (
                  <Text style={[styles.categoryText, { color: subTextColor }]}>
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
    width: "100%",
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
  teamOrderCell: {
    width: 100,
    textAlign: "center",
  },
  nameCell: {
    width: 250,
    minWidth: 250,
  },
  categoryCell: {
    width: 120,
  },
  timeCell: {
    width: 120,
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
