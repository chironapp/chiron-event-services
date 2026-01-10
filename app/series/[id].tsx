import type { RaceEventWithOrganiser } from "@/api/events";
import {
  fetchPublicRaceEventSeries,
  fetchPublicRaceEventsBySeries,
} from "@/api/raceSeriesPublic";
import { EventsList, EventsToggle, SearchBar } from "@/components/events";
import Footer from "@/components/Footer";
import { SeriesStandingsSummaryTable } from "@/components/results/SeriesStandingsSummaryTable";
import SeriesInfo from "@/components/SeriesInfo";
import SeriesTopNav from "@/components/SeriesTopNav";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import { Head } from "@/components/utils/Head";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { PublicRaceEventSeries } from "@/types/race";
import {
  filterResultsEvents,
  filterUpcomingEvents,
} from "@/utils/eventFilters";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

/**
 * Series details page component showing series information and its events
 *
 * @returns {JSX.Element} The series details page with events
 */
export default function SeriesDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [events, setEvents] = useState<RaceEventWithOrganiser[]>([]);
  const [series, setSeries] = useState<PublicRaceEventSeries | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasSetDefaultTab, setHasSetDefaultTab] = useState(false);

  // Fetch series and events on component mount
  useEffect(() => {
    async function loadData() {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch series details and their events in parallel
        const [seriesData, eventsResult] = await Promise.all([
          fetchPublicRaceEventSeries(id),
          fetchPublicRaceEventsBySeries(id, 0, 100),
        ]);

        if (!seriesData) {
          setError("Series not found");
          return;
        }

        setSeries(seriesData);
        setEvents(eventsResult.data as RaceEventWithOrganiser[]);
      } catch (err) {
        console.error("Error loading series data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // Set default tab to "results" if there are past events
  useEffect(() => {
    if (!hasSetDefaultTab && events.length > 0) {
      const pastEvents = filterResultsEvents(events);
      if (pastEvents.length > 0) {
        setSelectedTab("results");
      }
      setHasSetDefaultTab(true);
    }
  }, [events, hasSetDefaultTab]);

  // Filter events based on selected tab and search query
  const filteredEvents = React.useMemo(() => {
    let filtered =
      selectedTab === "upcoming"
        ? filterUpcomingEvents(events)
        : filterResultsEvents(events);

    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [events, selectedTab, searchQuery]);

  // Show loading state while fetching series
  if (loading && !series) {
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
              Loading series...
            </Text>
          </View>
        </View>
      </>
    );
  }

  // Show error state if series not found or error occurred
  if (error || !series) {
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
              {error || "Series not found"}
            </Text>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Head
        title={`${series.title} – Chiron Event Services`}
        description={
          series.description ||
          `View upcoming events and results from ${series.title}`
        }
        ogTitle={series.title ?? undefined}
        ogDescription={
          series.description ||
          `View upcoming events and results from ${series.title}`
        }
        twitterTitle={series.title ?? undefined}
        twitterDescription={
          series.description ||
          `View upcoming events and results from ${series.title}`
        }
      />
      <Stack.Screen
        options={{
          headerShown: false,
          title: series.title ?? undefined,
        }}
      />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SeriesTopNav seriesName={series.title ?? ""} seriesId={id} />

        <ScrollView style={styles.content}>
          <MaxWidthContainer style={styles.contentContainer}>
            <SeriesInfo series={series} />

            {series.scoring_config_id && (
              <View style={styles.scoringSection}>
                <Text style={[styles.standingsTitle, { color: colors.text }]}>
                  Series Standings
                </Text>

                <Text style={[styles.categoryLabel, { color: colors.text }]}>
                  Male
                </Text>
                <SeriesStandingsSummaryTable
                  seriesId={id}
                  sexCategoryId={2}
                  maxResults={3}
                />
                <Link href={`/series/${id}/standings`} asChild>
                  <Pressable>
                    <Text
                      style={[styles.allStandingsLink, { color: colors.link }]}
                    >
                      All Standings →
                    </Text>
                  </Pressable>
                </Link>

                <Text style={[styles.categoryLabel, { color: colors.text }]}>
                  Female
                </Text>
                <SeriesStandingsSummaryTable
                  seriesId={id}
                  sexCategoryId={1}
                  maxResults={3}
                />
                <Link href={`/series/${id}/standings`} asChild>
                  <Pressable>
                    <Text
                      style={[styles.allStandingsLink, { color: colors.link }]}
                    >
                      All Standings →
                    </Text>
                  </Pressable>
                </Link>
              </View>
            )}

            <Text style={[styles.eventsTitle, { color: colors.text }]}>
              Events
            </Text>

            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

            <EventsToggle
              selectedValue={selectedTab}
              onSelectionChange={setSelectedTab}
            />

            <Text style={[styles.sectionHeading, { color: colors.text }]}>
              {selectedTab === "upcoming" ? "Upcoming Events" : "Past Events"}
            </Text>

            <EventsList
              events={filteredEvents}
              loading={loading}
              error={null}
              selectedTab={selectedTab}
              searchQuery={searchQuery}
            />

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
  sectionHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
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
  scoringSection: {
    marginBottom: 24,
  },
  standingsTitle: {
    fontSize: 20,
    fontWeight: "600",
    // marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 0,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: "600",
    // marginBottom: 24,
  },
  allStandingsLink: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 16,
    textDecorationLine: "underline",
  },
});
