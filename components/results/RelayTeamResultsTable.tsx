/**
 * RelayTeamResultsTable - Responsive table component for race team results
 *
 * Displays relay team results with position, team name with member count, and finish time
 */

import type { RaceTeamWithMemberCount } from "@/api/results";
import { Colors } from "@/constants/theme";
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

interface RelayTeamResultsTableProps {
  eventId: string;
  teams: RaceTeamWithMemberCount[];
  isDark?: boolean;
}

/**
 * Responsive table component to display relay team results.
 * Uses responsive width calculations to adapt from desktop (~1000px) to mobile widths.
 */
export function RelayTeamResultsTable({
  eventId,
  teams,
  isDark = false,
}: RelayTeamResultsTableProps) {
  const { width } = useWindowDimensions();

  if (teams.length === 0) {
    return null;
  }

  // Calculate responsive widths
  // Max width is 1000, but adapt to screen width
  const containerMaxWidth = Math.min(width - 32, 1000);

  // Calculate column widths
  const positionWidth = 80;
  const timeWidth = 100;

  // Team name column gets remaining space
  const fixedWidths = positionWidth + timeWidth;
  const teamNameWidth = containerMaxWidth - fixedWidths;

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
            <Text
              style={[
                styles.headerCell,
                { color: textColor, borderColor, width: positionWidth },
              ]}
            >
              Position
            </Text>
            <Text
              style={[
                styles.headerCell,
                { color: textColor, borderColor, width: teamNameWidth },
              ]}
            >
              Team
            </Text>
            <Text
              style={[
                styles.headerCell,
                { color: textColor, borderColor, width: timeWidth },
              ]}
            >
              Finish Time
            </Text>
          </View>

          {/* Table Body */}
          {teams.map((team, index) => (
            <View
              key={team.id}
              style={[
                styles.row,
                index % 2 === 1 && {
                  backgroundColor: colors.tableRowAlt,
                },
              ]}
            >
              <Text
                style={[
                  styles.cell,
                  styles.centerText,
                  { color: textColor, borderColor, width: positionWidth },
                ]}
              >
                {team.position || "-"}
              </Text>
              <View
                style={[styles.cell, { borderColor, width: teamNameWidth }]}
              >
                <Link href={`/events/${eventId}/teams/${team.id}`} asChild>
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
                      {team.name || "Unknown Team"}
                    </Text>
                  </Pressable>
                </Link>
                <Text style={[styles.teamText, { color: subTextColor }]}>
                  {team.member_count}{" "}
                  {team.member_count === 1 ? "team member" : "team members"}
                </Text>
              </View>
              <Text
                style={[
                  styles.cell,
                  styles.centerText,
                  { color: textColor, borderColor, width: timeWidth },
                ]}
              >
                {team.finish_time100 ? formatTime(team.finish_time100) : "-"}
              </Text>
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
});
