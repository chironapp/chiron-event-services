import { fetchEventById, type RaceEventWithOrganiser } from "@/api/events";
import { fetchRaceTeams, type RaceTeamWithMemberCount } from "@/api/results";
import EventTopNav from "@/components/EventTopNav";
import Footer from "@/components/Footer";
import { EventHeader, ResultsToggle, SearchBar } from "@/components/events";
import { RelayTeamResultsTable } from "@/components/results/RelayTeamResultsTable";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import NoResultsFound from "@/components/ui/NoResultsFound";
import SectionHeading from "@/components/ui/SectionHeading";
import { Head } from "@/components/utils/Head";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { isUpcoming } from "@/utils/eventFilters";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
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
  const [resultsView, setResultsView] = useState("teams");
  const [event, setEvent] = useState<RaceEventWithOrganiser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<RaceTeamWithMemberCount[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamsCount, setTeamsCount] = useState(0);

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

  // Fetch teams when event is loaded or search query changes
  useEffect(() => {
    async function loadTeams() {
      if (!id || !event) return;

      try {
        setTeamsLoading(true);

        const teamsData = await fetchRaceTeams(id);

        // Filter teams based on search query
        let filteredTeams = teamsData;
        if (searchQuery.trim()) {
          const search = searchQuery.toLowerCase();
          filteredTeams = teamsData.filter((team) =>
            team.name.toLowerCase().includes(search)
          );
        }

        setTeams(filteredTeams);
        setTeamsCount(filteredTeams.length);
      } catch (err) {
        console.error("Error loading teams:", err);
        // Don't show error for missing teams, just show empty state
        setTeams([]);
        setTeamsCount(0);
      } finally {
        setTeamsLoading(false);
      }
    }

    loadTeams();
  }, [id, event, searchQuery]);

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

  // Handle results view toggle navigation
  const handleResultsViewChange = (value: string) => {
    if (value === "individuals") {
      router.push(`/events/${id}`);
    } else {
      setResultsView(value);
    }
  };

  return (
    <>
      <Head
        title={`Team Results – ${event.title} – Chiron Event Services`}
        description={
          event.description ||
          `View team ${eventIsUpcoming ? "start list" : "results"} for ${event.title}`
        }
        ogTitle={`Team Results – ${event.title}`}
        ogDescription={
          event.description ||
          `View team ${eventIsUpcoming ? "start list" : "results"} for ${event.title}`
        }
        twitterTitle={`Team Results – ${event.title}`}
        twitterDescription={
          event.description ||
          `View team ${eventIsUpcoming ? "start list" : "results"} for ${event.title}`
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

            <ResultsToggle
              selectedValue={resultsView}
              onSelectionChange={handleResultsViewChange}
            />

            <SectionHeading>
              {eventIsUpcoming ? "Teams" : "Team Results"}
            </SectionHeading>

            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Team name"
            />

            {teamsLoading ? (
              <View style={styles.resultsLoadingContainer}>
                <ActivityIndicator size="small" color={colors.text} />
                <Text
                  style={[styles.resultsLoadingText, { color: colors.subText }]}
                >
                  Loading {eventIsUpcoming ? "teams" : "team results"}...
                </Text>
              </View>
            ) : teamsCount > 0 ? (
              <>
                <Text style={[styles.resultsCount, { color: colors.subText }]}>
                  {teamsCount} {teamsCount === 1 ? "team" : "teams"}
                </Text>
                <RelayTeamResultsTable
                  eventId={id}
                  teams={teams}
                  isDark={isDark}
                />
              </>
            ) : (
              <NoResultsFound
                title={
                  searchQuery
                    ? "No Teams Found"
                    : eventIsUpcoming
                    ? "Teams Not Yet Available"
                    : "Team Results Not Yet Available"
                }
                message={
                  searchQuery
                    ? `No teams match "${searchQuery}"`
                    : eventIsUpcoming
                    ? "Team information will be available closer to the race date."
                    : "Team results will be posted after the race is completed."
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
