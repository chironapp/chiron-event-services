import { RACE_STATUS_COLORS, RACE_STATUS_LABELS } from "@/constants/raceTypes";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface RaceStatusBadgeProps {
  /**
   * The race status value
   */
  raceStatus: string | null;
}

/**
 * Reusable race status badge component for displaying status with color coding
 *
 * @example
 * ```tsx
 * <RaceStatusBadge raceStatus="registration_open" />
 * ```
 */
export default function RaceStatusBadge({ raceStatus }: RaceStatusBadgeProps) {
  // Get status color
  const statusColor = raceStatus
    ? RACE_STATUS_COLORS[raceStatus as keyof typeof RACE_STATUS_COLORS]
    : "#757575";

  // Get status label
  const statusLabel = raceStatus
    ? RACE_STATUS_LABELS[raceStatus as keyof typeof RACE_STATUS_LABELS]
    : "Unknown";

  return (
    <View
      style={[
        styles.statusBadge,
        {
          backgroundColor: statusColor,
        },
      ]}
    >
      <Text style={styles.statusText}>{statusLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
});
