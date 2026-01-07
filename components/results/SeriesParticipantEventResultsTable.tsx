/**
 * SeriesParticipantEventResultsTable - Table component for series participant event results
 *
 * Displays event results for a specific series participant including:
 * - Event name (with link to event)
 * - Sex category position
 * - Finish time
 */

import type { SeriesParticipantEventResult } from "@/api/raceSeriesPublic";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatTime } from "@/utils/dateUtils";
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

interface SeriesParticipantEventResultsTableProps {
  /**
   * Array of event results for the series participant
   */
  results: SeriesParticipantEventResult[];
}

/**
 * Format position for display, handling null values
 */
function formatPosition(position: number | null): string {
  return position?.toString() ?? "-";
}

/**
 * Table component to display event results for a series participant.
 * Shows event name, sex category position, and finish time.
 * Each row links to the individual result page.
 */
export function SeriesParticipantEventResultsTable({
  results,
}: SeriesParticipantEventResultsTableProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];
  const { width } = useWindowDimensions();

  // Calculate responsive widths
  const containerMaxWidth = Math.min(width - 32, 1000);
  const isMobile = containerMaxWidth < 600;

  // Column widths
  const positionWidth = isMobile ? 70 : 100;
  const timeWidth = isMobile ? 90 : 120;
  const fixedWidths = positionWidth + timeWidth;
  const eventNameWidth = containerMaxWidth - fixedWidths;

  const borderColor = colors.border;
  const headerBg = colors.tableHeader;
  const textColor = colors.text;
  const linkColor = colors.link;

  // Show empty state if no results
  if (results.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.subText }]}>
          No event results found
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { maxWidth: containerMaxWidth }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.headerRow, { backgroundColor: headerBg }]}>
            <Text
              style={[
                styles.headerCell,
                { color: textColor, borderColor, width: eventNameWidth },
              ]}
            >
              Event
            </Text>
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
                { color: textColor, borderColor, width: timeWidth },
              ]}
            >
              Time
            </Text>
          </View>

          {/* Table Body */}
          {results.map((result, index) => {
            // Use net finish time if available, otherwise use finish time
            const displayTime = result.net_finish_time100 ?? result.finish_time100;

            return (
              <View
                key={result.id}
                style={[
                  styles.row,
                  index % 2 === 1 && {
                    backgroundColor: colors.tableRowAlt,
                  },
                ]}
              >
                {/* Event Name */}
                <View
                  style={[styles.cell, { borderColor, width: eventNameWidth }]}
                >
                  <Link
                    href={`/events/${result.public_race_event_id}/individuals/${result.id}`}
                    asChild
                  >
                    <Pressable>
                      <Text
                        style={[
                          styles.eventNameText,
                          styles.linkText,
                          { color: linkColor },
                        ]}
                      >
                        {result.event_name || "Untitled Event"}
                      </Text>
                    </Pressable>
                  </Link>
                </View>

                {/* Sex Category Position */}
                <View
                  style={[styles.cell, { borderColor, width: positionWidth }]}
                >
                  <Text style={[styles.centerText, { color: textColor }]}>
                    {formatPosition(result.sex_category_position)}
                  </Text>
                </View>

                {/* Finish Time */}
                <View style={[styles.cell, { borderColor, width: timeWidth }]}>
                  <Text style={[styles.centerText, { color: textColor }]}>
                    {displayTime ? formatTime(displayTime) : "-"}
                  </Text>
                </View>
              </View>
            );
          })}
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
    justifyContent: "center",
  },
  centerText: {
    textAlign: "center",
  },
  eventNameText: {
    fontSize: 14,
  },
  linkText: {
    textDecorationLine: "underline",
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
