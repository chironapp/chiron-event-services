import Footer from "@/components/Footer";
import OrganiserTopNav from "@/components/OrganiserTopNav";
import OrganiserInfo from "@/components/OrganiserInfo";
import { SearchBar, EventsToggle, EventsList } from "@/components/events";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import { Head } from "@/components/utils/Head";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { fetchEvents, type RaceEventWithOrganiser } from "@/api/events";
import { fetchOrganiserById } from "@/api/organisers";
import type { Organiser } from "@/lib/supabase";
import {
  filterUpcomingEvents,
  filterResultsEvents,
} from "@/utils/eventFilters";

/**
 * Organiser details page component showing organiser information and their events
 *
 * @returns {JSX.Element} The organiser details page with events
 */
export default function OrganiserDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [events, setEvents] = useState<RaceEventWithOrganiser[]>([]);
  const [organiser, setOrganiser] = useState<Organiser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        console.error("Error loading organiser data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

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

      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000000" : "#ffffff" },
        ]}
      >
        <OrganiserTopNav organiserName={organiser.name} />

        <ScrollView style={styles.content}>
          <MaxWidthContainer style={styles.contentContainer}>
            <OrganiserInfo organiser={organiser} />

            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <EventsToggle
              selectedValue={selectedTab}
              onSelectionChange={setSelectedTab}
            />

            <Text
              style={[
                styles.sectionHeading,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
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
