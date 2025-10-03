import { useColorScheme } from "@/hooks/use-color-scheme";
import NoResultsFound from "@/components/ui/NoResultsFound";
import RaceEventCard from "@/components/ui/RaceEventCard";
import type { RaceEventWithOrganiser } from "@/api/events";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from "react-native";

interface EventsListProps {
  /**
   * Array of events to display
   */
  events: RaceEventWithOrganiser[];
  /**
   * Whether the data is currently loading
   */
  loading: boolean;
  /**
   * Error message if there was an error loading data
   */
  error: string | null;
  /**
   * The currently selected tab (upcoming or results)
   */
  selectedTab: string;
  /**
   * The current search query
   */
  searchQuery: string;
  /**
   * Optional container style
   */
  containerStyle?: ViewStyle;
}

/**
 * Reusable events list component for displaying a list of race events
 *
 * @example
 * ```tsx
 * <EventsList
 *   events={filteredEvents}
 *   loading={loading}
 *   error={error}
 *   selectedTab={selectedTab}
 *   searchQuery={searchQuery}
 * />
 * ```
 */
export default function EventsList({
  events,
  loading,
  error,
  selectedTab,
  searchQuery,
  containerStyle,
}: EventsListProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Loading State
  if (loading) {
    return (
      <View style={[styles.loadingContainer, containerStyle]}>
        <ActivityIndicator
          size="large"
          color={isDark ? "#ffffff" : "#000000"}
        />
        <Text
          style={[
            styles.loadingText,
            { color: isDark ? "#cccccc" : "#666666" },
          ]}
        >
          Loading events...
        </Text>
      </View>
    );
  }

  // Error State
  if (error && !loading) {
    return (
      <View style={[styles.errorContainer, containerStyle]}>
        <Text
          style={[
            styles.errorText,
            { color: isDark ? "#ff6b6b" : "#d32f2f" },
          ]}
        >
          Error: {error}
        </Text>
      </View>
    );
  }

  // Events List
  if (events.length > 0) {
    return (
      <View style={[styles.eventsListContainer, containerStyle]}>
        {events.map((event) => (
          <RaceEventCard key={event.id} event={event} />
        ))}
      </View>
    );
  }

  // No Results State
  return (
    <NoResultsFound
      title={
        selectedTab === "upcoming"
          ? "No Upcoming Events"
          : "No Results Found"
      }
      message={
        searchQuery.trim()
          ? "No events match your search criteria. Try a different search term."
          : selectedTab === "upcoming"
            ? "There are no upcoming events at this time. Check back later for new races!"
            : "No race results available. Try adjusting your search criteria."
      }
      containerStyle={[styles.noResultsContainer, containerStyle]}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    marginTop: 32,
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    marginTop: 32,
    marginBottom: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(211, 47, 47, 0.1)",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  eventsListContainer: {
    marginTop: 16,
  },
  noResultsContainer: {
    marginTop: 32,
    marginBottom: 40,
  },
});
