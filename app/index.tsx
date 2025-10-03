import Footer from "@/components/Footer";
import { SearchBar, EventsToggle, EventsList } from "@/components/events";
import TopNav from "@/components/TopNav";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fetchEvents, type RaceEventWithOrganiser } from "@/api/events";
import {
  filterUpcomingEvents,
  filterResultsEvents,
} from "@/utils/eventFilters";

/**
 * Home page component for finding races and events
 *
 * @returns {JSX.Element} The home page with navigation and content
 */
export default function HomePage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [events, setEvents] = useState<RaceEventWithOrganiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events on component mount
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchEvents({
          limit: 50, // Fetch more events since we'll filter client-side
          sortBy: "race_start_date",
          sortOrder: "asc",
        });
        setEvents(result.data);
      } catch (err) {
        console.error("Error loading events:", err);
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

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
          event.description?.toLowerCase().includes(query) ||
          event.organisers?.name?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [events, selectedTab, searchQuery]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          title: "Find Your Race",
        }}
      />

      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#000000" : "#ffffff" },
        ]}
      >
        <TopNav />

        <ScrollView style={styles.content}>
          <MaxWidthContainer style={styles.contentContainer}>
            <Text
              style={[
                styles.heading,
                { color: isDark ? "#ffffff" : "#000000" },
              ]}
            >
              Find Your Race
            </Text>

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
                styles.paragraph,
                { color: isDark ? "#e0e0e0" : "#333333" },
              ]}
            >
              Discover and participate in endurance events and races managed
              through the Chiron Event Services platform.
            </Text>

            <EventsList
              events={filteredEvents}
              loading={loading}
              error={error}
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
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subheading: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
});
