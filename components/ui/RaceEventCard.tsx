import type { RaceEventWithOrganiser } from "@/api/events";
import { SPORT_TYPE_LABELS } from "@/constants/raceTypes";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatEventDate } from "@/utils/dateUtils";
import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import RaceStatusBadge from "./RaceStatusBadge";

interface RaceEventCardProps {
  /**
   * The race event data to display
   */
  event: RaceEventWithOrganiser;
}

/**
 * Reusable race event card component for displaying event information
 *
 * @example
 * ```tsx
 * <RaceEventCard event={eventData} />
 * ```
 */
export default function RaceEventCard({ event }: RaceEventCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Get sport type label
  const sportLabel = SPORT_TYPE_LABELS[event.sport_type] || "Other";

  return (
    <Link href={`/events/${event.id}`} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.eventCard,
          {
            backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
            borderColor: isDark ? "#333333" : "#e0e0e0",
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        {/* Event Title */}
        <View style={styles.eventHeader}>
          <Text
            style={[
              styles.eventTitle,
              { color: isDark ? "#ffffff" : "#000000" },
            ]}
            numberOfLines={2}
          >
            {event.title || "Untitled Event"}
          </Text>
        </View>

        {/* Event Details */}
        <View style={styles.eventDetails}>
          <View style={styles.dateStatusRow}>
            <Text
              style={[
                styles.detailText,
                { color: isDark ? "#cccccc" : "#666666" },
              ]}
            >
              {formatEventDate(event.race_start_date)}
            </Text>
            {/* Status Badge */}
            <RaceStatusBadge raceStatus={event.race_status} />
          </View>
          <Text
            style={[
              styles.detailText,
              { color: isDark ? "#cccccc" : "#666666" },
            ]}
          >
            {event.location || "Location TBA"}
          </Text>
          <Text
            style={[
              styles.detailText,
              { color: isDark ? "#cccccc" : "#666666" },
            ]}
          >
            {sportLabel}
            {event.distance && ` | ${(event.distance / 1000).toFixed(event.distance % 1000 === 0 ? 0 : 1)}km`}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 26,
  },
  eventDetails: {
    marginBottom: 8,
    gap: 4,
  },
  dateStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
