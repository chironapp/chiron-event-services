import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatShortDate } from "@/utils/dateUtils";
import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface EventTopNavProps {
  /**
   * The name of the event to display
   */
  eventName: string;
  /**
   * The start date of the event
   */
  eventStartDate: string;
  /**
   * The event ID for linking to the event details page
   */
  eventId: string;
}

/**
 * Top navigation component for event details screen with event name and date
 *
 * @example
 * ```tsx
 * <EventTopNav
 *   eventName="Boston Marathon"
 *   eventStartDate="2024-04-15"
 *   eventId="123"
 * />
 * ```
 */
export default function EventTopNav({
  eventName,
  eventStartDate,
  eventId,
}: EventTopNavProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        <Link href={`/events/${eventId}`} asChild>
          <Pressable>
            <Text
              style={[styles.eventInfo, { color: colors.text }]}
              numberOfLines={1}
            >
              {eventName} | {formatShortDate(eventStartDate)}
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  eventInfo: {
    fontSize: 18,
    fontWeight: "600",
  },
});
