import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EventTopNavProps {
  /**
   * The name of the event to display
   */
  eventName: string;
  /**
   * The start date of the event
   */
  eventStartDate: string;
}

/**
 * Top navigation component for event details screen with event name and date
 *
 * @example
 * ```tsx
 * <EventTopNav eventName="Boston Marathon" eventStartDate="2024-04-15" />
 * ```
 */
export default function EventTopNav({
  eventName,
  eventStartDate,
}: EventTopNavProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#1a1a1a" : "#ffffff" },
      ]}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.eventInfo,
            { color: isDark ? "#ffffff" : "#000000" },
          ]}
          numberOfLines={1}
        >
          {eventName} | {formatDate(eventStartDate)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
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
