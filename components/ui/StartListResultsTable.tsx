import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import type { RaceStartListResult } from "@/lib/supabase";

interface StartListResultsTableProps {
  results: RaceStartListResult[];
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
              Bib
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
                {result.bib_number || "-"}
              </Text>
              <Text
                style={[
                  styles.cell,
                  styles.nameCell,
                  { color: textColor, borderColor },
                ]}
              >
                {result.athlete_name || "Unknown"}
              </Text>
              <Text
                style={[
                  styles.cell,
                  styles.categoryCell,
                  { color: subTextColor, borderColor },
                ]}
              >
                {result.category || "-"}
              </Text>
              {!isUpcoming && (
                <Text
                  style={[
                    styles.cell,
                    styles.timeCell,
                    { color: textColor, borderColor },
                  ]}
                >
                  {result.finish_time || "-"}
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
  categoryCell: {
    width: 120,
  },
  timeCell: {
    width: 120,
    textAlign: "center",
  },
});
