import { fetchEvents, type RaceEventWithOrganiser } from "@/api/events";
import { fetchOrganiserById } from "@/api/organisers";
import { fetchOrganiserRaceEventSeries } from "@/api/raceSeriesPublic";
import Footer from "@/components/Footer";
import OrganiserInfo from "@/components/OrganiserInfo";
import OrganiserTopNav from "@/components/OrganiserTopNav";
import { EventsList, EventsToggle, SearchBar } from "@/components/events";
import SeriesList from "@/components/events/SeriesList";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import { Head } from "@/components/utils/Head";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { Organiser } from "@/lib/supabase";
import type { PublicRaceEventSeries } from "@/types/race";
import {
  filterResultsEvents,
  filterUpcomingEvents,
} from "@/utils/eventFilters";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

/**
 * Organiser details page component showing organiser information and their events
 *
 * @returns {JSX.Element} The organiser details page with events
 */
export default function OrganiserDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [events, setEvents] = useState<RaceEventWithOrganiser[]>([]);
  const [series, setSeries] = useState<PublicRaceEventSeries[]>([]);
  const [organiser, setOrganiser] = useState<Organiser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seriesLoading, setSeriesLoading] = useState(false);

  // Fetch organiser and events on component mount
  useEffect(() => {
    async function loadData() {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch organiser details and their events in parallel
        const [organiserData, eventsResult] = await Promise.all([
          fetchOrganiserById(id),
          fetchEvents({
            limit: 100,
            sortBy: "race_start_date",
            sortOrder: "asc",
            organiserId: id,
          }),
        ]);

        if (!organiserData) {
          setError("Organiser not found");
          return;
        }

        setOrganiser(organiserData);
        setEvents(eventsResult.data);

        // Fetch series when tab is selected or on initial load
        if (selectedTab === "series") {
          setSeriesLoading(true);
          try {
            const seriesResult = await fetchOrganiserRaceEventSeries(
              id,
              0,
              100
            );
            setSeries(seriesResult.data as PublicRaceEventSeries[]);
          } catch (seriesErr) {
            console.error("Error loading series:", seriesErr);
          } finally {
            setSeriesLoading(false);
          }
        }
      } catch (err) {
        console.error("Error loading organiser data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, selectedTab]);

  // Fetch series when series tab is selected
  useEffect(() => {
    async function loadSeries() {
      if (!id || selectedTab !== "series" || series.length > 0) return;

      try {
        setSeriesLoading(true);
        const seriesResult = await fetchOrganiserRaceEventSeries(id, 0, 100);
        setSeries(seriesResult.data as PublicRaceEventSeries[]);
      } catch (err) {
        console.error("Error loading series:", err);
      } finally {
        setSeriesLoading(false);
      }
    }

    loadSeries();
  }, [id, selectedTab]);

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

  // Filter series based on search query
  const filteredSeries = React.useMemo(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return series.filter(
        (s) =>
          s.title?.toLowerCase().includes(query) ||
          s.description?.toLowerCase().includes(query)
      );
    }
    return series;
  }, [series, searchQuery]);

  // Show loading state while fetching organiser
  if (loading && !organiser) {
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
              Loading organiser...
            </Text>
          </View>
        </View>
      </>
    );
  }

  // Show error state if organiser not found or error occurred
  if (error || !organiser) {
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
              {error || "Organiser not found"}
            </Text>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <Head
        title={`${organiser.name} – Chiron Event Services`}
        description={`View upcoming events and results from ${organiser.name}`}
        ogTitle={organiser.name}
        ogDescription={`View upcoming events and results from ${organiser.name}`}
        twitterTitle={organiser.name}
        twitterDescription={`View upcoming events and results from ${organiser.name}`}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          title: organiser.name,
        }}
      />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <OrganiserTopNav organiserName={organiser.name} />

        <ScrollView style={styles.content}>
          <MaxWidthContainer style={styles.contentContainer}>
            <OrganiserInfo organiser={organiser} />

            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

            <EventsToggle
              selectedValue={selectedTab}
              onSelectionChange={setSelectedTab}
              showSeries={true}
            />

            <Text style={[styles.sectionHeading, { color: colors.text }]}>
              {selectedTab === "upcoming"
                ? "Upcoming Events"
                : selectedTab === "results"
                ? "Past Events"
                : "Series"}
            </Text>

            {selectedTab === "series" ? (
              <SeriesList
                series={filteredSeries}
                loading={seriesLoading}
                error={null}
                searchQuery={searchQuery}
              />
            ) : (
              <EventsList
                events={filteredEvents}
                loading={loading}
                error={null}
                selectedTab={selectedTab}
                searchQuery={searchQuery}
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
  sectionHeading: {
    fontSize: 20,
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
});
