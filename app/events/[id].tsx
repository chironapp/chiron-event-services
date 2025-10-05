import { fetchEventById, type RaceEventWithOrganiser } from "@/api/events";
import {
  fetchRaceResults,
  type RaceStartListResultWithCategories,
} from "@/api/results";
import EventTopNav from "@/components/EventTopNav";
import Footer from "@/components/Footer";
import { SearchBar } from "@/components/events";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import NoResultsFound from "@/components/ui/NoResultsFound";
import { StartListResultsTable } from "@/components/ui/StartListResultsTable";
import { RACE_STATUS_LABELS } from "@/constants/raceTypes";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { isUpcoming } from "@/utils/eventFilters";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Event details page component showing event information
 *
 * @returns {JSX.Element} The event details page
 */
export default function EventDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [event, setEvent] = useState<RaceEventWithOrganiser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RaceStartListResultWithCategories[]>(
    []
  );
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsPage, setResultsPage] = useState(1);
  const [resultsCount, setResultsCount] = useState(0);
  const [hasMoreResults, setHasMoreResults] = useState(false);

  // Fetch event on component mount
  useEffect(() => {
    async function loadEvent() {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const eventData = await fetchEventById(id);

        if (!eventData) {
          setError("Event not found");
          return;
        }

        setEvent(eventData);
      } catch (err) {
        console.error("Error loading event data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  // Fetch race results when event is loaded or search query changes
  useEffect(() => {
    async function loadResults() {
      if (!id || !event) return;

      try {
        setResultsLoading(true);

        const resultsData = await fetchRaceResults({
          eventId: id,
          page: resultsPage,
          limit: 50,
          search: searchQuery,
          sortBy: isUpcoming(event) ? "race_number" : "position",
          sortOrder: "asc",
        });

        setResults(resultsData.data);
        setResultsCount(resultsData.count);
        setHasMoreResults(resultsData.hasNextPage);
      } catch (err) {
        console.error("Error loading results:", err);
        // Don't show error for missing results, just show empty state
        setResults([]);
        setResultsCount(0);
      } finally {
        setResultsLoading(false);
      }
    }

    loadResults();
  }, [id, event, searchQuery, resultsPage]);

  // Format the date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Date TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Show loading state while fetching event
  if (loading && !event) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
            title: "Loading...",
          }}
        />
        <View
          style={[
            styles.container,
            { backgroundColor: isDark ? "#000000" : "#ffffff" },
          ]}
        >
          <View style={styles.loadingContainer}>
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
              Loading event...
            </Text>
          </View>
        </View>
      </>
    );
  }

  // Show error state if event not found or error occurred
  if (error || !event) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
            title: "Error",
          }}
        />
        <View
          style={[
            styles.container,
            { backgroundColor: isDark ? "#000000" : "#ffffff" },
          ]}
        >
          <View style={styles.errorContainer}>
            <Text
              style={[
                styles.errorText,
                { color: isDark ? "#ff6b6b" : "#d32f2f" },
              ]}
            >
              {error || "Event not found"}
            </Text>
          </View>
        </View>
      </>
    );
  }

  const eventIsUpcoming = isUpcoming(event);
  const raceStatusLabel = event.race_status
    ? RACE_STATUS_LABELS[event.race_status]
    : "Unknown";

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          title: event.title || "Event",
        }}
      />

      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000000" : "#ffffff" },
        ]}
      >
        <EventTopNav
          eventName={event.title || "Event"}
          eventStartDate={event.race_start_date || ""}
        />

        <ScrollView style={styles.content}>
          <MaxWidthContainer style={styles.contentContainer}>
            <Text
              style={[
                styles.heading,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              {event.title}
            </Text>

            <View style={styles.eventInfoContainer}>
              <Text
                style={[
                  styles.infoLabel,
                  { color: isDark ? "#cccccc" : "#666666" },
                ]}
              >
                Event Date:
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                {formatDate(event.race_start_date)}
              </Text>
            </View>

            <View style={styles.eventInfoContainer}>
              <Text
                style={[
                  styles.infoLabel,
                  { color: isDark ? "#cccccc" : "#666666" },
                ]}
              >
                Race Status:
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: isDark ? "#ffffff" : "#000000" },
                ]}
              >
                {raceStatusLabel}
              </Text>
            </View>

            {event.race_status === "registration_open" &&
              event.registration_url && (
                <TouchableOpacity
                  style={styles.registrationButton}
                  onPress={() => Linking.openURL(event.registration_url!)}
                >
                  <Text style={styles.registrationButtonText}>
                    Register Now
                  </Text>
                </TouchableOpacity>
              )}

            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Race number or athlete name"
            />

            <Text
              style={[
                styles.sectionHeading,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              {eventIsUpcoming ? "Start List" : "Results"}
            </Text>

            {resultsLoading ? (
              <View style={styles.resultsLoadingContainer}>
                <ActivityIndicator
                  size="small"
                  color={isDark ? "#ffffff" : "#000000"}
                />
                <Text
                  style={[
                    styles.resultsLoadingText,
                    { color: isDark ? "#cccccc" : "#666666" },
                  ]}
                >
                  Loading {eventIsUpcoming ? "start list" : "results"}...
                </Text>
              </View>
            ) : resultsCount > 0 ? (
              <>
                <Text
                  style={[
                    styles.resultsCount,
                    { color: isDark ? "#cccccc" : "#666666" },
                  ]}
                >
                  {resultsCount} {resultsCount === 1 ? "entry" : "entries"}
                </Text>
                <StartListResultsTable
                  results={results}
                  isUpcoming={eventIsUpcoming}
                  isDark={isDark}
                />
                {hasMoreResults && (
                  <TouchableOpacity
                    style={styles.loadMoreButton}
                    onPress={() => setResultsPage(resultsPage + 1)}
                  >
                    <Text style={styles.loadMoreButtonText}>Load More</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <NoResultsFound
                title={
                  searchQuery
                    ? "No Results Found"
                    : eventIsUpcoming
                    ? "Start List Not Yet Available"
                    : "Results Not Yet Available"
                }
                message={
                  searchQuery
                    ? `No entries match "${searchQuery}"`
                    : eventIsUpcoming
                    ? "The start list for this event will be available closer to the race date."
                    : "Results will be posted after the race is completed."
                }
              />
            )}

            <Footer />
          </MaxWidthContainer>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  eventInfoContainer: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  registrationButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
    alignItems: "center",
  },
  registrationButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 16,
  },
  resultsLoadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  resultsLoadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  resultsCount: {
    fontSize: 14,
    marginBottom: 8,
  },
  loadMoreButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  loadMoreButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
  },
});
