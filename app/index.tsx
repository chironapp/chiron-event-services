import Footer from "@/components/Footer";
import { SearchInput, ToggleSwitch } from "@/components/input";
import TopNav from "@/components/TopNav";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import NoResultsFound from "@/components/ui/NoResultsFound";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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

  const toggleOptions = [
    { label: "Results", value: "results" },
    { label: "Upcoming", value: "upcoming" },
  ];

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

            <SearchInput
              // label="Search Events"
              placeholder="Enter event name, location, or type..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              containerStyle={styles.searchContainer}
            />

            <ToggleSwitch
              options={toggleOptions}
              selectedValue={selectedTab}
              onSelectionChange={setSelectedTab}
              containerStyle={styles.toggleContainer}
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

            <NoResultsFound
              title={
                selectedTab === "upcoming"
                  ? "No Upcoming Events"
                  : "No Results Found"
              }
              message={
                selectedTab === "upcoming"
                  ? "There are no upcoming events at this time. Check back later for new races!"
                  : "No race results available. Try adjusting your search criteria."
              }
              containerStyle={styles.noResultsContainer}
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
  searchContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  toggleContainer: {
    marginBottom: 24,
  },
  noResultsContainer: {
    marginTop: 32,
    marginBottom: 40,
  },
});
