import type { RaceEventWithOrganiser } from "@/api/events";
import {
  RACE_STATUS_COLORS,
  RACE_STATUS_LABELS,
  SPORT_TYPE_LABELS,
} from "@/constants/raceTypes";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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

  // Format the date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Date TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status color
  const statusColor = event.race_status
    ? RACE_STATUS_COLORS[event.race_status]
    : "#757575";

  // Get status label
  const statusLabel = event.race_status
    ? RACE_STATUS_LABELS[event.race_status]
    : "Unknown";

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
        {/* Status Badge */}
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
          <Text
            style={[
              styles.detailText,
              { color: isDark ? "#cccccc" : "#666666" },
            ]}
          >
            📅 {formatDate(event.race_start_date)}
          </Text>
          <Text
            style={[
              styles.detailText,
              { color: isDark ? "#cccccc" : "#666666" },
            ]}
          >
            🏃 {sportLabel}
          </Text>
          {event.distance && (
            <Text
              style={[
                styles.detailText,
                { color: isDark ? "#cccccc" : "#666666" },
              ]}
            >
              📏{" "}
              {(event.distance / 1000).toFixed(
                event.distance % 1000 === 0 ? 0 : 1
              )}
              km
            </Text>
          )}
          {event.organisers && (
            <Text
              style={[
                styles.detailText,
                { color: isDark ? "#cccccc" : "#666666" },
              ]}
            >
              🏢 {event.organisers.name}
            </Text>
          )}
        </View>

        {/* Description */}
        {event.description && (
          <Text
            style={[
              styles.eventDescription,
              { color: isDark ? "#cccccc" : "#666666" },
            ]}
            numberOfLines={3}
          >
            {event.description}
          </Text>
        )}
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
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  eventHeader: {
    marginBottom: 12,
    paddingRight: 100, // Make space for status badge
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
  detailText: {
    fontSize: 14,
    lineHeight: 20,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
});
