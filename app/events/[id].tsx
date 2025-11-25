import { fetchEventById, type RaceEventWithOrganiser } from "@/api/events";
import {
  fetchRaceResults,
  type RaceStartListResultWithCategories,
} from "@/api/results";
import EventTopNav from "@/components/EventTopNav";
import Footer from "@/components/Footer";
import { EventHeader, ResultsToggle, SearchBar } from "@/components/events";
import { StartListResultsTable } from "@/components/results/StartListResultsTable";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import NoResultsFound from "@/components/ui/NoResultsFound";
import SectionHeading from "@/components/ui/SectionHeading";
import { Head } from "@/components/utils/Head";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { isUpcoming } from "@/utils/eventFilters";
import { isRelay } from "@/utils/relayRaceUtils";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  const colors = Colors[isDark ? "dark" : "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsView, setResultsView] = useState("individuals");
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
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.text} />
            <Text style={[styles.loadingText, { color: colors.subText }]}>
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
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.error }]}>
              {error || "Event not found"}
            </Text>
          </View>
        </View>
      </>
    );
  }

  const eventIsUpcoming = isUpcoming(event);
  const isRelayEvent = event ? isRelay(event) : false;

  // Handle results view toggle navigation
  const handleResultsViewChange = (value: string) => {
    if (value === "teams") {
      router.push(`/events/${id}/teams`);
    } else {
      setResultsView(value);
    }
  };

  return (
    <>
      <Head
        title={`${event.title} – Chiron Event Services`}
        description={
          event.description ||
          `View ${eventIsUpcoming ? "start list" : "results"} for ${event.title}`
        }
        ogTitle={event.title || "Event"}
        ogDescription={
          event.description ||
          `View ${eventIsUpcoming ? "start list" : "results"} for ${event.title}`
        }
        twitterTitle={event.title || "Event"}
        twitterDescription={
          event.description ||
          `View ${eventIsUpcoming ? "start list" : "results"} for ${event.title}`
        }
      />
      <Stack.Screen
        options={{
          headerShown: false,
          title: event.title || "Event",
        }}
      />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EventTopNav
          eventName={event.title || "Event"}
          eventStartDate={event.race_start_date || ""}
          eventId={id}
        />

        <ScrollView style={styles.content}>
          <MaxWidthContainer style={styles.contentContainer}>
            <EventHeader event={event} />

            {isRelayEvent && (
              <ResultsToggle
                selectedValue={resultsView}
                onSelectionChange={handleResultsViewChange}
              />
            )}

            <SectionHeading>
              {eventIsUpcoming ? "Start List" : "Results"}
            </SectionHeading>

            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Race number or athlete name"
            />

            {resultsLoading ? (
              <View style={styles.resultsLoadingContainer}>
                <ActivityIndicator size="small" color={colors.text} />
                <Text
                  style={[styles.resultsLoadingText, { color: colors.subText }]}
                >
                  Loading {eventIsUpcoming ? "start list" : "results"}...
                </Text>
              </View>
            ) : resultsCount > 0 ? (
              <>
                <Text style={[styles.resultsCount, { color: colors.subText }]}>
                  {resultsCount} {resultsCount === 1 ? "entry" : "entries"}
                </Text>
                <StartListResultsTable
                  eventId={id}
                  results={results}
                  isUpcoming={eventIsUpcoming}
                  isDark={isDark}
                  showTeamOrder={isRelay(event)}
                  isRelay={isRelay(event)}
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
    backgroundColor: Colors.light.primary,
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
