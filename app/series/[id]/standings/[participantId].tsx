import {
  fetchPublicRaceEventSeries,
  fetchSeriesParticipantEventResults,
  fetchSeriesStandingByParticipantId,
  type SeriesParticipantEventResult,
  type SeriesStandingsResult,
} from "@/api/raceSeriesPublic";
import Footer from "@/components/Footer";
import { SeriesParticipantEventResultsTable } from "@/components/results/SeriesParticipantEventResultsTable";
import SeriesTopNav from "@/components/SeriesTopNav";
import MaxWidthContainer from "@/components/ui/MaxWidthContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import { Head } from "@/components/utils/Head";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { PublicRaceEventSeries } from "@/types/race";
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
 * Format points for display, handling null values
 */
function formatPoints(points: number | null): string {
  return points?.toFixed(1) ?? "-";
}

/**
 * Series participant details page showing standings info and event results
 *
 * @returns {JSX.Element} The series participant page
 */
export default function SeriesParticipantPage() {
  const { id, participantId } = useLocalSearchParams<{
    id: string;
    participantId: string;
  }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const [series, setSeries] = useState<PublicRaceEventSeries | null>(null);
  const [standing, setStanding] = useState<SeriesStandingsResult | null>(null);
  const [eventResults, setEventResults] = useState<
    SeriesParticipantEventResult[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    async function loadData() {
      if (!id || !participantId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch series info, standings, and event results in parallel
        const [seriesData, standingData, resultsData] = await Promise.all([
          fetchPublicRaceEventSeries(id),
          fetchSeriesStandingByParticipantId(id, participantId),
          fetchSeriesParticipantEventResults(participantId),
        ]);

        if (!seriesData) {
          setError("Series not found");
          return;
        }

        if (!standingData) {
          setError("Participant not found in series standings");
          return;
        }

        setSeries(seriesData);
        setStanding(standingData);
        setEventResults(resultsData);
      } catch (err) {
        console.error("Error loading series participant data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, participantId]);

  // Show loading state while fetching data
  if (loading && !standing) {
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
              Loading participant...
            </Text>
          </View>
        </View>
      </>
    );
  }

  // Show error state if data not found or error occurred
  if (error || !standing || !series) {
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
              {error || "Participant not found"}
            </Text>
          </View>
        </View>
      </>
    );
  }

  const participantName = `${standing.first_name} ${standing.last_name}`;

  return (
    <>
      <Head
        title={`${participantName} – ${series.title} – Chiron Event Services`}
        description={`View series standings and event results for ${participantName} in ${series.title}`}
        ogTitle={`${participantName} – ${series.title}`}
        ogDescription={`View series standings and event results for ${participantName} in ${series.title}`}
        twitterTitle={`${participantName} – ${series.title}`}
        twitterDescription={`View series standings and event results for ${participantName} in ${series.title}`}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          title: participantName || "Participant",
        }}
      />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SeriesTopNav seriesName={series.title ?? ""} seriesId={id} />

        <ScrollView style={styles.content}>
          <MaxWidthContainer style={styles.contentContainer}>
            <Text style={[styles.heading, { color: colors.text }]}>
              {participantName}
            </Text>

            {/* Standings Summary Section */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionHeading, { color: colors.text }]}
              >
                Series Standings
              </Text>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.subText }]}>
                  Rank:
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {standing.rank ?? "-"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.subText }]}>
                  Total Points:
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {formatPoints(standing.total_points)}
                </Text>
              </View>
              {standing.races_counted > 0 && (
                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.subText }]}>
                    Races Counted:
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {standing.races_counted}
                  </Text>
                </View>
              )}
            </View>

            {/* Event Results Section */}
            <View style={styles.section}>
              <SectionHeading>Event Results</SectionHeading>
              <SeriesParticipantEventResultsTable results={eventResults} />
            </View>

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
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
    minWidth: 140,
  },
  infoValue: {
    fontSize: 16,
    flex: 1,
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
